"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function WritingTask2() {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds for both tasks
  const [isStarted, setIsStarted] = useState(false)
  const [essay, setEssay] = useState("")
  const [topic, setTopic] = useState("")

  useEffect(() => {
    // Load saved essay from localStorage
    const savedEssay = localStorage.getItem("writingTask2Essay")
    if (savedEssay) {
      setEssay(savedEssay)
    }

    // Check if test was already started
    const testStarted = localStorage.getItem("writingTestStarted")
    if (testStarted === "true") {
      setIsStarted(true)
    }

    // Load saved time
    const savedTime = localStorage.getItem("writingTimeRemaining")
    if (savedTime) {
      setTimeRemaining(Number.parseInt(savedTime))
    }

    // Select a random topic
    selectRandomTopic()
  }, [])

  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Handle time's up
            return 0
          }
          const newTime = prev - 1
          localStorage.setItem("writingTimeRemaining", newTime.toString())
          return newTime
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isStarted])

  useEffect(() => {
    // Save essay to localStorage
    localStorage.setItem("writingTask2Essay", essay)
  }, [essay])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssay(e.target.value)
  }

  const handleFinishTest = () => {
    router.push("/test-complete")
  }

  const handleBackToTask1 = () => {
    router.push("/writing/task1")
  }

  const selectRandomTopic = () => {
    const topics = [
      "Some people believe that universities should focus on providing academic skills rather than preparing students for employment. To what extent do you agree or disagree?",
      "In many countries, the proportion of older people is steadily increasing. Does this trend have more positive or negative effects on society?",
      "Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this. Discuss both these views and give your own opinion.",
      "The restoration of old buildings in major cities around the world costs numerous governments millions. Some people think that this money should be used to build new housing. To what extent do you agree or disagree?",
      "Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both these views and give your own opinion.",
      "In some countries, many young people choose to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages of this.",
    ]

    const randomIndex = Math.floor(Math.random() * topics.length)
    setTopic(topics[randomIndex])
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Writing Task 2</h1>
        <div className="text-xl font-semibold">Time Remaining: {formatTime(timeRemaining)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="h-full">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Task Instructions</h2>
            <p className="mb-4">Write about the following topic:</p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
              <p className="text-lg font-medium">{topic}</p>
            </div>
            <p className="mb-4">
              Give reasons for your answer and include any relevant examples from your own knowledge or experience.
            </p>
            <p className="mb-4">Write at least 250 words.</p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Your Response</h2>
            <textarea
              value={essay}
              onChange={handleEssayChange}
              placeholder="Write your response here..."
              className="w-full h-96 p-2 border rounded resize-none"
            />
            <div className="text-sm text-gray-500 mt-2">
              Word count: {essay.split(/\s+/).filter(Boolean).length} words (minimum 250)
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-4">
        <Button onClick={handleBackToTask1}>Back to Task 1</Button>
        <Button onClick={handleFinishTest}>Finish Test</Button>
      </div>
    </div>
  )
}
