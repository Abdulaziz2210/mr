"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ConfettiExplosion } from "@/components/ui/confetti-explosion"

export default function TestCompletePage() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [student, setStudent] = useState("")
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({})
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({})
  const [writingTask1, setWritingTask1] = useState("")
  const [writingTask2, setWritingTask2] = useState("")
  const [resultsSaved, setResultsSaved] = useState(false)

  useEffect(() => {
    // Show confetti animation
    setShowConfetti(true)

    // Get student name
    const currentUser = sessionStorage.getItem("currentUser") || "Anonymous"
    setStudent(currentUser)

    // Load test answers
    const readingAnswers = localStorage.getItem("readingAnswers")
    if (readingAnswers) {
      setReadingAnswers(JSON.parse(readingAnswers))
    }

    const listeningAnswers = localStorage.getItem("listeningAnswers")
    if (listeningAnswers) {
      setListeningAnswers(JSON.parse(listeningAnswers))
    }

    const writingTask1 = localStorage.getItem("writingTask1Essay") || ""
    setWritingTask1(writingTask1)

    const writingTask2 = localStorage.getItem("writingTask2Essay") || ""
    setWritingTask2(writingTask2)

    // Save test results
    saveTestResults(
      currentUser,
      readingAnswers ? JSON.parse(readingAnswers) : {},
      listeningAnswers ? JSON.parse(listeningAnswers) : {},
      writingTask1,
      writingTask2,
    )
  }, [])

  const saveTestResults = (
    student: string,
    readingAnswers: Record<string, string>,
    listeningAnswers: Record<string, string>,
    writingTask1: string,
    writingTask2: string,
  ) => {
    if (resultsSaved) return

    try {
      // Calculate word counts
      const writingTask1Words = writingTask1.split(/\s+/).filter(Boolean).length
      const writingTask2Words = writingTask2.split(/\s+/).filter(Boolean).length

      // Create test result object
      const testResult = {
        timestamp: new Date().toISOString(),
        student,
        readingAnswers,
        readingScore: 0, // To be scored by admin
        readingTotal: 40,
        readingPercentage: 0,
        readingBand: 0,
        listeningAnswers,
        listeningScore: 0, // To be scored by admin
        listeningTotal: 40,
        listeningPercentage: 0,
        listeningBand: 0,
        writingTask1: writingTask1 || "NA",
        writingTask2: writingTask2 || "NA",
        writingTask1Words,
        writingTask2Words,
        writingBand: 0, // To be scored by admin
        overallBand: 0, // To be calculated by admin
        completed: new Date().toLocaleString(),
      }

      // Get existing results
      const existingResultsJSON = localStorage.getItem("testResults")
      const existingResults = existingResultsJSON ? JSON.parse(existingResultsJSON) : []

      // Add new result
      const updatedResults = [...existingResults, testResult]

      // Save to localStorage
      localStorage.setItem("testResults", JSON.stringify(updatedResults))
      setResultsSaved(true)

      // Send results to Telegram
      sendResultsToTelegram(testResult)
    } catch (error) {
      console.error("Error saving test results:", error)
    }
  }

  const sendResultsToTelegram = async (testResult: any) => {
    try {
      const message = `
*New IELTS Test Completed*
Student: ${testResult.student}
Date: ${new Date().toLocaleString()}

*Reading*
Questions Answered: ${Object.keys(testResult.readingAnswers).length}/40

*Listening*
Questions Answered: ${Object.keys(testResult.listeningAnswers).length}/40

*Writing*
Task 1 Words: ${testResult.writingTask1Words || "NA"}
Task 2 Words: ${testResult.writingTask2Words || "NA"}

*Note:* This test needs to be scored by an administrator.
      `

      const response = await fetch("/api/send-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          token: "8115894799:AAGckh-QqdWre1Bkfq6l8FrQcNqmVPgLJV4",
        }),
      })

      const data = await response.json()
      console.log("Telegram notification result:", data)
    } catch (error) {
      console.error("Error sending Telegram notification:", error)
    }
  }

  const handleReturnToLogin = () => {
    // Clear test data
    localStorage.removeItem("readingTestStarted")
    localStorage.removeItem("listeningTestStarted")
    localStorage.removeItem("writingTestStarted")
    localStorage.removeItem("currentSection")
    localStorage.removeItem("currentReadingPassage")
    localStorage.removeItem("currentListeningSection")
    localStorage.removeItem("writingTimeRemaining")
    localStorage.removeItem("readingAnswers")
    localStorage.removeItem("listeningAnswers")
    localStorage.removeItem("writingTask1Essay")
    localStorage.removeItem("writingTask2Essay")
    localStorage.removeItem("ieltsTestState")

    // Return to login page
    sessionStorage.removeItem("isLoggedIn")
    router.push("/")
  }

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      {showConfetti && <ConfettiExplosion />}
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">Test Completed!</CardTitle>
          <CardDescription className="text-center text-gray-700 dark:text-gray-300">
            Thank you for completing the IELTS practice test.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="mb-2 text-gray-800 dark:text-gray-200">Your test has been submitted successfully.</p>
            <p className="mb-4 text-gray-800 dark:text-gray-200">
              Your answers have been saved and will be reviewed by an administrator who will provide your scores.
            </p>
            <div className="space-y-2 text-gray-800 dark:text-gray-200">
              <p>
                <strong>Reading:</strong> {Object.keys(readingAnswers).length} questions answered
              </p>
              <p>
                <strong>Listening:</strong> {Object.keys(listeningAnswers).length} questions answered
              </p>
              <p>
                <strong>Writing Task 1:</strong> {writingTask1.split(/\s+/).filter(Boolean).length} words
              </p>
              <p>
                <strong>Writing Task 2:</strong> {writingTask2.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          </div>
          <Button onClick={handleReturnToLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Return to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
