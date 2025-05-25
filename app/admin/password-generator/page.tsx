"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, RefreshCw, Send, Shield, Eye, EyeOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RegisteredUser {
  fullName: string
  password: string
  registeredAt: string
  used: boolean
  candidateNumber?: string
  passwordHistory?: string[]
  lastLoginAt?: string
}

export default function PasswordGeneratorPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [generatedPassword, setGeneratedPassword] = useState<string>("")
  const [passwordLength, setPasswordLength] = useState<number>(12)
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true)
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true)
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true)
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true)
  const [studentName, setStudentName] = useState<string>("")
  const [candidateNumber, setCandidateNumber] = useState<string>("")
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([])
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null)
  const [activeTab, setActiveTab] = useState<string>("generator")
  const [copied, setCopied] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const username = sessionStorage.getItem("currentUser")
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")

    if (username === "superadmin8071" && isLoggedIn === "true") {
      setIsAdmin(true)
      loadRegisteredUsers()
    } else {
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    // Generate a password when component mounts or settings change
    generatePassword()
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const loadRegisteredUsers = () => {
    try {
      const usersJSON = localStorage.getItem("registeredUsers")
      if (usersJSON) {
        const users = JSON.parse(usersJSON)
        setRegisteredUsers(users)
      }
    } catch (error) {
      console.error("Error loading registered users:", error)
    }
  }

  const generateSecurePassword = () => {
    let charset = ""
    const requiredChars = []

    if (includeUppercase) {
      charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      requiredChars.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)])
    }
    if (includeLowercase) {
      charset += "abcdefghijklmnopqrstuvwxyz"
      requiredChars.push("abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)])
    }
    if (includeNumbers) {
      charset += "0123456789"
      requiredChars.push("0123456789"[Math.floor(Math.random() * 10)])
    }
    if (includeSymbols) {
      charset += "!@#$%^&*()_-+=<>?"
      requiredChars.push("!@#$%^&*()_-+=<>?"[Math.floor(Math.random() * 15)])
    }

    if (charset === "") {
      return ""
    }

    // Generate random password
    let password = ""

    // Add required characters first
    for (const char of requiredChars) {
      password += char
    }

    // Fill the rest randomly
    for (let i = requiredChars.length; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    // Shuffle the password to avoid predictable patterns
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
  }

  const generatePassword = () => {
    setIsGenerating(true)

    // Add a small delay to show the generating state
    setTimeout(() => {
      const password = generateSecurePassword()

      if (!password) {
        setError("Please select at least one character type")
        setGeneratedPassword("")
      } else {
        setGeneratedPassword(password)
        setError("")
      }

      setIsGenerating(false)
    }, 300)
  }

  const calculatePasswordStrength = (password: string) => {
    let score = 0
    const feedback = []

    if (password.length >= 8) score += 1
    else feedback.push("Use at least 8 characters")

    if (password.length >= 12) score += 1
    else if (password.length >= 8) feedback.push("Consider using 12+ characters")

    if (/[a-z]/.test(password)) score += 1
    else feedback.push("Add lowercase letters")

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push("Add uppercase letters")

    if (/[0-9]/.test(password)) score += 1
    else feedback.push("Add numbers")

    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else feedback.push("Add special characters")

    const strength = score <= 2 ? "Weak" : score <= 4 ? "Medium" : "Strong"
    const color = score <= 2 ? "text-red-600" : score <= 4 ? "text-yellow-600" : "text-green-600"

    return { strength, color, score, feedback }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      setError("Failed to copy password to clipboard")
    }
  }

  const sendToTelegram = async () => {
    if (!generatedPassword) {
      setError("Please generate a password first")
      return
    }

    if (!studentName.trim()) {
      setError("Please enter a student name")
      return
    }

    setIsSending(true)
    setError("")

    try {
      const message = `
🔐 *Password Generated*

👤 *Student*: ${studentName.trim()}
${candidateNumber ? `🆔 *Candidate Number*: ${candidateNumber}` : ""}
🔑 *Password*: \`${generatedPassword}\`
⏰ *Generated*: ${new Date().toLocaleString()}
🔒 *Security*: Single-use password

*Instructions for student:*
1. Use this password to log in to the IELTS test system
2. This password is valid for one-time use only
3. Contact admin if you encounter any issues

*Admin Note:* Password sent via secure channel.
      `

      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess(`Password sent to Telegram successfully for ${studentName}!`)

        // Update user in localStorage
        const updatedUsers = registeredUsers.map((user) => {
          if (user.fullName.toLowerCase() === studentName.toLowerCase()) {
            const passwordHistory = user.passwordHistory || []
            passwordHistory.push(user.password) // Store old password in history

            return {
              ...user,
              password: generatedPassword,
              candidateNumber: candidateNumber || user.candidateNumber,
              passwordHistory,
              used: false, // Reset used status for new password
            }
          }
          return user
        })

        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
        setRegisteredUsers(updatedUsers)

        // Generate a new password for next use
        generatePassword()

        // Clear form
        setStudentName("")
        setCandidateNumber("")
        setSelectedUser(null)
      } else {
        setError(`Failed to send password: ${data.error}`)
      }
    } catch (error) {
      console.error("Error sending to Telegram:", error)
      setError("Error sending password to Telegram. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const selectUser = (user: RegisteredUser) => {
    setSelectedUser(user)
    setStudentName(user.fullName)
    setCandidateNumber(user.candidateNumber || "")
    setActiveTab("generator")
    setError("")
    setSuccess("")
  }

  const assignCandidateNumber = (user: RegisteredUser, candidateNum: string) => {
    if (!candidateNum.trim()) {
      setError("Please enter a candidate number")
      return
    }

    const updatedUsers = registeredUsers.map((u) => {
      if (u.fullName === user.fullName && u.registeredAt === user.registeredAt) {
        return { ...u, candidateNumber: candidateNum.trim() }
      }
      return u
    })

    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
    setRegisteredUsers(updatedUsers)
    setSuccess(`Candidate number ${candidateNum} assigned to ${user.fullName}`)
    setTimeout(() => setSuccess(""), 3000)
  }

  const generateCandidateNumber = () => {
    // Generate a candidate number in format: IELTS-YYYY-NNNN
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")
    return `IELTS-${year}-${randomNum}`
  }

  // If not admin, show login form
  if (!isAdmin) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Admin Access Required</CardTitle>
            <CardDescription className="text-center">
              Please log in as an administrator to access the password generator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin")} className="w-full">
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const passwordStrength = calculatePasswordStrength(generatedPassword)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Password Generator & User Management</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Back to Dashboard
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

      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="generator">Password Generator</TabsTrigger>
          <TabsTrigger value="users">Registered Users ({registeredUsers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Generate Secure Password
                </CardTitle>
                <CardDescription>Create a strong, random password for a student</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="passwordLength">Password Length: {passwordLength}</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        id="passwordLength"
                        min="8"
                        max="32"
                        value={passwordLength}
                        onChange={(e) => setPasswordLength(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500 min-w-[80px]">{passwordLength} chars</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeUppercase"
                        checked={includeUppercase}
                        onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                      />
                      <Label htmlFor="includeUppercase" className="text-sm">
                        Uppercase (A-Z)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeLowercase"
                        checked={includeLowercase}
                        onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                      />
                      <Label htmlFor="includeLowercase" className="text-sm">
                        Lowercase (a-z)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeNumbers"
                        checked={includeNumbers}
                        onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                      />
                      <Label htmlFor="includeNumbers" className="text-sm">
                        Numbers (0-9)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeSymbols"
                        checked={includeSymbols}
                        onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                      />
                      <Label htmlFor="includeSymbols" className="text-sm">
                        Symbols (!@#$%)
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={generatePassword}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isGenerating}
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                    {isGenerating ? "Generating..." : "Generate New Password"}
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="generatedPassword">Generated Password</Label>
                    <div className="flex">
                      <div className="flex-1 bg-gray-100 border border-gray-300 rounded-l-md p-3 font-mono text-lg">
                        {showPassword ? generatedPassword : "•".repeat(generatedPassword.length)}
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-none border-l-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-l-none border-l-0"
                        onClick={copyToClipboard}
                        disabled={!generatedPassword}
                      >
                        {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>

                    {generatedPassword && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span className={passwordStrength.color}>Strength: {passwordStrength.strength}</span>
                        </div>
                        <span className="text-gray-500">Score: {passwordStrength.score}/6</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Password to Student
                </CardTitle>
                <CardDescription>Send the generated password via Telegram</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Enter student's full name"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidateNumber">Candidate Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="candidateNumber"
                        value={candidateNumber}
                        onChange={(e) => setCandidateNumber(e.target.value)}
                        placeholder="Enter or generate candidate number"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setCandidateNumber(generateCandidateNumber())}
                        type="button"
                      >
                        Generate
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={sendToTelegram}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={!generatedPassword || !studentName.trim() || isSending}
                  >
                    <Send className={`h-4 w-4 ${isSending ? "animate-pulse" : ""}`} />
                    {isSending ? "Sending..." : "Send Password to Telegram"}
                  </Button>

                  <div className="mt-6 p-4 bg-gray-50 rounded-md border">
                    <h4 className="font-medium mb-2">Message Preview</h4>
                    <pre className="whitespace-pre-wrap text-xs text-gray-700 max-h-40 overflow-y-auto">
                      {`🔐 *Password Generated*

👤 *Student*: ${studentName || "[Student Name]"}
${candidateNumber ? `🆔 *Candidate Number*: ${candidateNumber}` : ""}
🔑 *Password*: \`${generatedPassword || "[Generated Password]"}\`
⏰ *Generated*: ${new Date().toLocaleString()}
🔒 *Security*: Single-use password

*Instructions for student:*
1. Use this password to log in to the IELTS test system
2. This password is valid for one-time use only
3. Contact admin if you encounter any issues

*Admin Note:* Password sent via secure channel.`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users Management</CardTitle>
              <CardDescription>
                Manage registered users, assign candidate numbers, and generate passwords
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Candidate Number</TableHead>
                      <TableHead>Login Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredUsers.length > 0 ? (
                      registeredUsers.map((user, index) => (
                        <TableRow key={`${user.fullName}-${user.registeredAt}`}>
                          <TableCell className="font-medium">{user.fullName}</TableCell>
                          <TableCell>{new Date(user.registeredAt).toLocaleString()}</TableCell>
                          <TableCell>
                            {user.candidateNumber ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">{user.candidateNumber}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    navigator.clipboard.writeText(user.candidateNumber!)
                                    setSuccess(`Candidate number copied: ${user.candidateNumber}`)
                                    setTimeout(() => setSuccess(""), 2000)
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Enter number"
                                  className="h-8 w-32 text-sm"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      const target = e.target as HTMLInputElement
                                      assignCandidateNumber(user, target.value)
                                      target.value = ""
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    const input = e.currentTarget.parentElement?.querySelector(
                                      "input",
                                    ) as HTMLInputElement
                                    if (input?.value) {
                                      assignCandidateNumber(user, input.value)
                                      input.value = ""
                                    }
                                  }}
                                >
                                  Save
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {user.candidateNumber ? (
                                <div className="flex items-center gap-2">
                                  {user.used ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                                      Password Used
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      Ready to Login
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                  No Candidate Number
                                </span>
                              )}
                              {user.lastLoginAt && (
                                <span className="text-xs text-gray-500">
                                  Last login: {new Date(user.lastLoginAt).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.candidateNumber ? (
                                <Button variant="outline" size="sm" onClick={() => selectUser(user)}>
                                  Generate New Password
                                </Button>
                              ) : (
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newNumber = generateCandidateNumber()
                                      assignCandidateNumber(user, newNumber)
                                    }}
                                  >
                                    Auto-assign Number
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => selectUser(user)} disabled>
                                    Need Candidate #
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="text-gray-500">
                            <p className="text-lg mb-2">No registered users found</p>
                            <p className="text-sm">Users will appear here after they register</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
