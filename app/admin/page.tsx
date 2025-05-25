"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart, LineChart, PieChart, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TestResult {
  timestamp: string
  student: string
  readingAnswers: Record<string, string>
  readingScore: number
  readingTotal: number
  readingPercentage: number
  readingBand: number
  listeningAnswers: Record<string, string>
  listeningScore: number
  listeningTotal: number
  listeningPercentage: number
  listeningBand: number
  writingTask1: string
  writingTask2: string
  writingTask1Words: number
  writingTask2Words: number
  writingBand: number
  overallBand: number
  completed: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [writingBand, setWritingBand] = useState<number>(0)
  const [readingScore, setReadingScore] = useState<number>(0)
  const [listeningScore, setListeningScore] = useState<number>(0)
  const [overallBand, setOverallBand] = useState<number>(0)
  const [telegramMessage, setTelegramMessage] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // Check if user is admin
    const username = sessionStorage.getItem("currentUser")
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")

    console.log("Admin check:", { username, isLoggedIn })

    if (username === "superadmin8071" && isLoggedIn === "true") {
      setIsAdmin(true)
      loadTestResults()
    } else {
      // For debugging purposes, let's add a console log
      console.log("Admin access denied:", { username, isLoggedIn })

      // Instead of redirecting immediately, let's show an error message
      setIsAdmin(false)
    }
  }, [router])

  const loadTestResults = () => {
    try {
      // Load test results from localStorage
      const resultsJSON = localStorage.getItem("testResults")
      if (resultsJSON) {
        const results = JSON.parse(resultsJSON)
        setTestResults(results)
      }
    } catch (error) {
      console.error("Error loading test results:", error)
    }
  }

  const getAverageBand = (band: keyof TestResult) => {
    if (testResults.length === 0) return 0
    const sum = testResults.reduce((acc, result) => acc + (result[band] as number), 0)
    return (sum / testResults.length).toFixed(1)
  }

  const getTestsThisWeek = () => {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    return testResults.filter((result) => {
      const resultDate = new Date(result.timestamp)
      return resultDate >= oneWeekAgo
    }).length
  }

  const handleResultSelect = (result: TestResult) => {
    setSelectedResult(result)
    setWritingBand(result.writingBand || 0)
    setReadingScore(result.readingScore || 0)
    setListeningScore(result.listeningScore || 0)
    setOverallBand(result.overallBand || 0)
    setActiveTab("detail")
    setError("")
  }

  const calculateBandScore = (score: number, total: number) => {
    // Return 0 if score is 0
    if (score === 0) return 0

    const percentage = (score / total) * 100
    if (percentage >= 90) return 9.0
    if (percentage >= 85) return 8.5
    if (percentage >= 80) return 8.0
    if (percentage >= 75) return 7.5
    if (percentage >= 70) return 7.0
    if (percentage >= 65) return 6.5
    if (percentage >= 60) return 6.0
    if (percentage >= 55) return 5.5
    if (percentage >= 50) return 5.0
    if (percentage >= 40) return 4.0
    if (percentage >= 30) return 3.0
    if (percentage >= 20) return 2.0
    return 1.0
  }

  const calculateOverallBand = () => {
    const readingBand = calculateBandScore(readingScore, selectedResult?.readingTotal || 40)
    const listeningBand = calculateBandScore(listeningScore, selectedResult?.listeningTotal || 40)
    const overall = (readingBand + listeningBand + writingBand) / 3
    return Math.round(overall * 2) / 2 // Round to nearest 0.5
  }

  const validateScores = () => {
    setError("")

    if (readingScore > 40) {
      setError("Reading score cannot exceed 40")
      return false
    }

    if (listeningScore > 40) {
      setError("Listening score cannot exceed 40")
      return false
    }

    if (writingBand > 9) {
      setError("Writing band score cannot exceed 9.0")
      return false
    }

    return true
  }

  const handleUpdateScores = () => {
    if (!selectedResult) return

    if (!validateScores()) return

    const readingBand = calculateBandScore(readingScore, selectedResult.readingTotal)
    const listeningBand = calculateBandScore(listeningScore, selectedResult.listeningTotal)
    const calculatedOverallBand = calculateOverallBand()

    // Update the selected result
    const updatedResult = {
      ...selectedResult,
      readingScore,
      readingBand,
      listeningScore,
      listeningBand,
      writingBand,
      overallBand: calculatedOverallBand,
    }

    // Update the results array
    const updatedResults = testResults.map((result) =>
      result.timestamp === selectedResult.timestamp ? updatedResult : result,
    )

    // Save to localStorage
    localStorage.setItem("testResults", JSON.stringify(updatedResults))
    setTestResults(updatedResults)
    setSelectedResult(updatedResult)
    setOverallBand(calculatedOverallBand)

    // Prepare Telegram message
    const message = `
*IELTS Test Results*
Student: ${selectedResult.student}
Date: ${new Date(selectedResult.timestamp).toLocaleString()}

*Reading*
Score: ${readingScore}/${selectedResult.readingTotal}
Band: ${readingBand.toFixed(1)}

*Listening*
Score: ${listeningScore}/${selectedResult.listeningTotal}
Band: ${listeningBand.toFixed(1)}

*Writing*
Task 1 Words: ${selectedResult.writingTask1Words}
Task 2 Words: ${selectedResult.writingTask2Words}
Band: ${writingBand.toFixed(1)}

*Overall Band Score: ${calculatedOverallBand.toFixed(1)}*
  `
    setTelegramMessage(message)
  }

  const sendToTelegram = async () => {
    if (!telegramMessage) return

    try {
      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: telegramMessage }),
      })

      const data = await response.json()
      if (data.success) {
        alert("Results sent to Telegram successfully!")
      } else {
        alert(`Failed to send results: ${data.error}`)
      }
    } catch (error) {
      console.error("Error sending to Telegram:", error)
      alert("Error sending results to Telegram")
    }
  }

  // If not admin, show login form
  if (!isAdmin) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Please enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const username = (e.currentTarget.elements.namedItem("username") as HTMLInputElement).value
                const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value

                if (username === "superadmin8071" && password === "08268071") {
                  // Set admin session
                  sessionStorage.setItem("isLoggedIn", "true")
                  sessionStorage.setItem("currentUser", username)
                  setIsAdmin(true)
                  loadTestResults()
                } else {
                  setError("Invalid admin credentials")
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                Back to Main Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/admin/password-generator")}>
            Password Generator
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem("isLoggedIn")
              sessionStorage.removeItem("currentUser")
              router.push("/")
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="detail">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testResults.length}</div>
                <p className="text-xs text-muted-foreground">{getTestsThisWeek()} tests this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Reading Band</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getAverageBand("readingBand")}</div>
                <p className="text-xs text-muted-foreground">Out of 9.0 band score</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Listening Band</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getAverageBand("listeningBand")}</div>
                <p className="text-xs text-muted-foreground">Out of 9.0 band score</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>Overview of the most recent IELTS test results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Reading</TableHead>
                    <TableHead>Listening</TableHead>
                    <TableHead>Writing</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.slice(0, 5).map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.student}</TableCell>
                      <TableCell>{result.readingBand?.toFixed(1) || "Not scored"}</TableCell>
                      <TableCell>{result.listeningBand?.toFixed(1) || "Not scored"}</TableCell>
                      <TableCell>{result.writingBand?.toFixed(1) || "Not scored"}</TableCell>
                      <TableCell>{result.overallBand?.toFixed(1) || "Not scored"}</TableCell>
                      <TableCell>{new Date(result.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleResultSelect(result)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {testResults.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No test results available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>All Test Results</CardTitle>
              <CardDescription>Complete list of all IELTS test results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Reading</TableHead>
                    <TableHead>Listening</TableHead>
                    <TableHead>Writing</TableHead>
                    <TableHead>Overall</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.student}</TableCell>
                      <TableCell>
                        {result.readingBand?.toFixed(1) || "Not scored"} ({result.readingScore || 0}/
                        {result.readingTotal || 40})
                      </TableCell>
                      <TableCell>
                        {result.listeningBand?.toFixed(1) || "Not scored"} ({result.listeningScore || 0}/
                        {result.listeningTotal || 40})
                      </TableCell>
                      <TableCell>
                        {result.writingBand?.toFixed(1) || "Not scored"} (T1: {result.writingTask1Words || "NA"}, T2:{" "}
                        {result.writingTask2Words || "NA"})
                      </TableCell>
                      <TableCell>{result.overallBand?.toFixed(1) || "Not scored"}</TableCell>
                      <TableCell>{new Date(result.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleResultSelect(result)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {testResults.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No test results available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Test Analytics</CardTitle>
              <CardDescription>Performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-2">Band Score Distribution</h3>
                  <div className="h-[300px] flex items-end justify-around">
                    <div className="flex flex-col items-center">
                      <div className="bg-blue-500 w-16 h-[200px] rounded-t"></div>
                      <div className="mt-2">Reading</div>
                      <div className="text-sm">{getAverageBand("readingBand")}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-green-500 w-16 h-[180px] rounded-t"></div>
                      <div className="mt-2">Listening</div>
                      <div className="text-sm">{getAverageBand("listeningBand")}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-yellow-500 w-16 h-[170px] rounded-t"></div>
                      <div className="mt-2">Writing</div>
                      <div className="text-sm">{getAverageBand("writingBand")}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-amber-500 w-16 h-[190px] rounded-t"></div>
                      <div className="mt-2">Overall</div>
                      <div className="text-sm">{getAverageBand("overallBand")}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Test Completion Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Average Reading Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {testResults.length > 0
                            ? (
                                testResults.reduce((acc, result) => acc + (result.readingPercentage || 0), 0) /
                                testResults.length
                              ).toFixed(1) + "%"
                            : "0%"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Average Listening Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {testResults.length > 0
                            ? (
                                testResults.reduce((acc, result) => acc + (result.listeningPercentage || 0), 0) /
                                testResults.length
                              ).toFixed(1) + "%"
                            : "0%"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Average Writing Words</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {testResults.length > 0
                            ? Math.round(
                                testResults.reduce(
                                  (acc, result) =>
                                    acc + (result.writingTask1Words || 0) + (result.writingTask2Words || 0),
                                  0,
                                ) / testResults.length,
                              )
                            : "0"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detail">
          {selectedResult ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Details</CardTitle>
                  <CardDescription>
                    Student: {selectedResult.student} | Date: {new Date(selectedResult.timestamp).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Reading Answers</h3>
                      <div className="border rounded-md p-4 h-[400px] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Question</TableHead>
                              <TableHead>Answer</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedResult.readingAnswers &&
                              Object.entries(selectedResult.readingAnswers).map(([questionId, answer]) => (
                                <TableRow key={questionId}>
                                  <TableCell>{questionId}</TableCell>
                                  <TableCell>{answer}</TableCell>
                                </TableRow>
                              ))}
                            {(!selectedResult.readingAnswers ||
                              Object.keys(selectedResult.readingAnswers).length === 0) && (
                              <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                  No reading answers available
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Listening Answers</h3>
                      <div className="border rounded-md p-4 h-[400px] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Question</TableHead>
                              <TableHead>Answer</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedResult.listeningAnswers &&
                              Object.entries(selectedResult.listeningAnswers).map(([questionId, answer]) => (
                                <TableRow key={questionId}>
                                  <TableCell>{questionId}</TableCell>
                                  <TableCell>{answer}</TableCell>
                                </TableRow>
                              ))}
                            {(!selectedResult.listeningAnswers ||
                              Object.keys(selectedResult.listeningAnswers).length === 0) && (
                              <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                  No listening answers available
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Writing Task 1</h3>
                    <div className="border rounded-md p-4 min-h-[200px] mb-4">
                      <p className="whitespace-pre-wrap">{selectedResult.writingTask1 || "NA"}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Word count: {selectedResult.writingTask1Words || 0} words
                      </p>
                    </div>

                    <h3 className="text-lg font-medium mb-4">Writing Task 2</h3>
                    <div className="border rounded-md p-4 min-h-[200px]">
                      <p className="whitespace-pre-wrap">{selectedResult.writingTask2 || "NA"}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Word count: {selectedResult.writingTask2Words || 0} words
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border rounded-md p-6 bg-gray-50">
                    <h3 className="text-lg font-medium mb-4">Score and Rate Test</h3>

                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="readingScore">
                            Reading Score (out of {selectedResult.readingTotal || 40})
                          </Label>
                          <Input
                            id="readingScore"
                            type="number"
                            min="0"
                            max="40"
                            placeholder="0"
                            value={readingScore}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value)
                              if (isNaN(value)) {
                                setReadingScore(0)
                              } else if (value > 40) {
                                setReadingScore(40)
                                setError("Reading score cannot exceed 40")
                              } else {
                                setReadingScore(value)
                                setError("")
                              }
                            }}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Band: {calculateBandScore(readingScore, selectedResult.readingTotal || 40).toFixed(1)}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="listeningScore">
                            Listening Score (out of {selectedResult.listeningTotal || 40})
                          </Label>
                          <Input
                            id="listeningScore"
                            type="number"
                            min="0"
                            max="40"
                            placeholder="0"
                            value={listeningScore}
                            onChange={(e) => {
                              const value = Number.parseInt(e.target.value)
                              if (isNaN(value)) {
                                setListeningScore(0)
                              } else if (value > 40) {
                                setListeningScore(40)
                                setError("Listening score cannot exceed 40")
                              } else {
                                setListeningScore(value)
                                setError("")
                              }
                            }}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Band: {calculateBandScore(listeningScore, selectedResult.listeningTotal || 40).toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="writingBand">Writing Band Score (out of 9.0)</Label>
                          <Input
                            id="writingBand"
                            type="number"
                            min="0"
                            max="9"
                            step="0.5"
                            placeholder="0"
                            value={writingBand}
                            onChange={(e) => {
                              const value = Number.parseFloat(e.target.value)
                              if (isNaN(value)) {
                                setWritingBand(0)
                              } else if (value > 9) {
                                setWritingBand(9)
                                setError("Writing band score cannot exceed 9.0")
                              } else {
                                setWritingBand(value)
                                setError("")
                              }
                            }}
                          />
                        </div>

                        <div>
                          <Label htmlFor="overallBand">Overall Band Score</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="overallBand"
                              type="number"
                              value={calculateOverallBand()}
                              readOnly
                              className="bg-gray-100"
                            />
                            <Button onClick={handleUpdateScores}>Update Scores</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {telegramMessage && (
                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Send Results to Telegram</h4>
                          <Button onClick={sendToTelegram} size="sm" className="flex items-center">
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        </div>
                        <div className="border rounded-md p-4 bg-white">
                          <pre className="whitespace-pre-wrap text-sm">{telegramMessage}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No test selected</h3>
              <p className="text-gray-500">Please select a test from the Results tab to view details</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
