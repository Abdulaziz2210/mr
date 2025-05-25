"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { DrawingCanvas } from "@/components/drawing-canvas"

export default function WritingTask1() {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds for both tasks
  const [isStarted, setIsStarted] = useState(false)
  const [essay, setEssay] = useState("")
  const [chartImage, setChartImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  useEffect(() => {
    // Load saved essay from localStorage
    const savedEssay = localStorage.getItem("writingTask1Essay")
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

    // Select a random chart image
    selectRandomChart()
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
    localStorage.setItem("writingTask1Essay", essay)
  }, [essay])

  useEffect(() => {
    // Save test started status to localStorage
    localStorage.setItem("writingTestStarted", isStarted.toString())
  }, [isStarted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTest = () => {
    setIsStarted(true)
  }

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssay(e.target.value)
  }

  const handleNextTask = () => {
    router.push("/writing/task2")
  }

  const selectRandomChart = () => {
    const chartOptions = [
      "/images/task1/chart1.png",
      "/images/task1/chart2.png",
      "/images/task1/chart3.png",
      "/images/task1/chart4.png",
      "/images/task1/chart5.png",
      "/images/task1/chart6.png",
      "/images/task1/chart7.png",
      "/images/task1/user-chart.png",
    ]

    const randomIndex = Math.floor(Math.random() * chartOptions.length)
    const selectedChart = chartOptions[randomIndex]
    setChartImage(selectedChart)
    localStorage.setItem("selectedChartImage", selectedChart)
    setImageError(null)
  }

  const handleImageError = () => {
    setImageError("Failed to load chart image. Please check the file path.")
  }

  if (!isStarted) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">IELTS Writing Test</h1>
        <p className="mb-4">You have 60 minutes to complete both Task 1 and Task 2.</p>
        <p className="mb-4">
          Task 1: You will be presented with a chart, graph, table, or diagram and asked to describe, summarize, or
          explain the information in your own words.
        </p>
        <p className="mb-4">
          Task 2: You will be asked to write an essay in response to a point of view, argument, or problem.
        </p>
        <p className="mb-4">
          Recommended time: 20 minutes for Task 1 (minimum 150 words) and 40 minutes for Task 2 (minimum 250 words).
        </p>
        <Button onClick={handleStartTest}>Start Test</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Writing Task 1</h1>
        <div className="text-xl font-semibold">Time Remaining: {formatTime(timeRemaining)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="h-full">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Task Instructions</h2>
            <p className="mb-4">
              The chart below shows information about changes in average house prices in five different cities between
              1990 and 2002 compared with the average house prices in 1989.
            </p>
            <p className="mb-4">
              Summarize the information by selecting and reporting the main features, and make comparisons where
              relevant.
            </p>
            <p className="mb-4">Write at least 150 words.</p>

            <div className="relative w-full h-64 mb-4 border">
              {chartImage ? (
                <Image
                  src={chartImage || "/placeholder.svg"}
                  alt="Chart for analysis"
                  fill
                  style={{ objectFit: "contain" }}
                  onError={handleImageError}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">Loading chart...</div>
              )}
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-500">
                  {imageError}
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold mb-2">Drawing Tools</h3>
            <DrawingCanvas width={400} height={300} />
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
              Word count: {essay.split(/\s+/).filter(Boolean).length} words (minimum 150)
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={handleNextTask}>Next: Task 2</Button>
      </div>
    </div>
  )
}
