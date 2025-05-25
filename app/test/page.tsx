"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type TestSection = "reading" | "listening" | "writing"
type ReadingPassage = 1 | 2 | 3
type WritingTask = 1 | 2

type TimerConfig = {
  reading: number
  listening: number
  writing: number
}

// Store test results locally in browser for backup
const storeLocalResults = (results: any) => {
  try {
    const existingResults = JSON.parse(localStorage.getItem("testResults") || "[]")
    existingResults.push({
      timestamp: new Date().toISOString(),
      ...results,
    })
    localStorage.setItem("testResults", JSON.stringify(existingResults))
  } catch (e) {
    console.error("Error storing results locally:", e)
  }
}

// Convert raw score to IELTS band score
const calculateBandScore = (rawScore: number, totalQuestions: number): number => {
  // Return 0 if the raw score is 0
  if (rawScore === 0) return 0

  // IELTS approximate band score conversion
  const percentage = (rawScore / totalQuestions) * 100

  if (percentage >= 90) return 9.0
  if (percentage >= 85) return 8.5
  if (percentage >= 80) return 8.0
  if (percentage >= 75) return 7.5
  if (percentage >= 70) return 7.0
  if (percentage >= 65) return 6.5
  if (percentage >= 60) return 6.0
  if (percentage >= 55) return 5.5
  if (percentage >= 50) return 5.0
  if (percentage >= 45) return 4.5
  if (percentage >= 40) return 4.0
  if (percentage >= 35) return 3.5
  if (percentage >= 30) return 3.0
  if (percentage >= 25) return 2.5
  if (percentage >= 20) return 2.0
  if (percentage >= 15) return 1.5
  if (percentage >= 10) return 1.0
  return 1.0// Minimum band score (unless score is 0)
}

// Add this CSS to the component to support animation delays
// Add this near the top of the file, after the imports
const audioLoadingStyles = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .animation-delay-300 {
    animation-delay: 300ms;
  }
  .animation-delay-600 {
    animation-delay: 600ms;
  }
`

// Task 2 writing topics
const writingTask2Topics = [
  "Some people believe that universities should focus on providing academic skills, while others think that universities should prepare students for their future careers. Discuss both views and give your opinion.",
  "In many countries, the amount of crime committed by teenagers is increasing. What are the causes of this, and what solutions can you suggest?",
  "Some people think that the government should provide free healthcare for all citizens. Others believe that individuals should pay for their own healthcare. Discuss both views and give your opinion.",
  "Some people think that children should be taught how to manage money at school. Others believe that this is the responsibility of parents. Discuss both views and give your opinion.",
  "Some people believe that technology has made our lives too complex and that we should return to a simpler way of life. To what extent do you agree or disagree?",
  "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways of reducing crime. Discuss both views and give your opinion.",
  "Some people think that all university students should study whatever they like. Others believe that they should only be allowed to study subjects that will be useful in the future, such as those related to science and technology. Discuss both views and give your opinion.",
  "Some people think that governments should spend money on measures to save languages with few speakers from dying out completely. Others think this is a waste of financial resources. Discuss both views and give your opinion.",
  "Some people think that the increasing use of computers and mobile phones for communication has had a negative effect on young people's reading and writing skills. To what extent do you agree or disagree?",
  "Some people think that the government should ban dangerous sports, while others think people should have freedom to do any sports or activity. Discuss both views and give your opinion.",
  "Some people think that the teenage years are the happiest times of most people's lives. Others think that adult life brings more happiness, in spite of greater responsibilities. Discuss both views and give your opinion.",
  "Some people think that parents should teach children how to be good members of society. Others, however, believe that school is the place to learn this. Discuss both views and give your opinion.",
  "Some people think that the main purpose of schools is to turn children into good citizens and workers, rather than to benefit them as individuals. To what extent do you agree or disagree?",
  "Some people think that the main environmental problem facing by the world is the loss of particular species of plants and animals. Others believe that there are more important environmental problems. Discuss both views and give your opinion.",
  "Some people think that the best way to solve global environmental problems is to increase the cost of fuel. To what extent do you agree or disagree?",
  "Some people think that schools should select students according to their academic abilities, while others believe that it is better to have students with different abilities studying together. Discuss both views and give your opinion.",
  "Some people think that the government is wasting money on the arts and that this money could be better spent elsewhere. To what extent do you agree or disagree?",
  "Some people think that all young people should be required to have full-time education until they are at least 18 years old. To what extent do you agree or disagree?",
  "Some people think that in order to prevent illness and disease, governments should make efforts in reducing environmental pollution and housing problems. To what extent do you agree or disagree?",
  "Some people think that the increasing business and cultural contact between countries brings many positive effects. Others say that it causes the loss of national identities. Discuss both sides and give your opinion.",
  "Some people think that young people should be required to do unpaid work helping people in the community. To what extent do you agree or disagree?",
  "Some people think that the news media nowadays have influenced people's lives in negative ways. To what extent do you agree or disagree?",
  "Some people think that robots are very important for humans' future development. Others, however, think that robots are a dangerous invention that could have negative effects on society. Discuss both views and give your opinion.",
  "Some people think that the government should provide assistance to all kinds of artists including painters, musicians and poets. Others think that it is a waste of money. Discuss both views and give your opinion.",
  "Some people think that the government should ban dangerous sports, while others think people should have freedom to do any sports or activity. Discuss both views and give your opinion.",
  "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways of reducing crime. Discuss both views and give your opinion.",
  "Some people think that children should begin their formal education at a very early age and should spend most of their time studying. Others believe that young children should spend most of their time playing. Discuss both views and give your opinion.",
  "Some people think that it is better to educate boys and girls in separate schools. Others, however, believe that boys and girls benefit more from attending mixed schools. Discuss both views and give your opinion.",
  "Some people think that the government should ban dangerous sports, while others think people should have freedom to do any sports or activity. Discuss both views and give your opinion.",
  "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways of reducing crime. Discuss both views and give your opinion.",
  "Some people think that the government should ban dangerous sports, while others think people should have freedom to do any sports or activity. Discuss both views and give your opinion.",
  "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways of reducing crime. Discuss both views and give your opinion.",
  "Some people think that the government should ban dangerous sports, while others think people should have freedom to do any sports or activity. Discuss both views and give your opinion.",
  "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways of reducing crime. Discuss both views and give your opinion.",
  "Some people think that the government should ban dangerous sports, while others think people should have freedom to do any sports or activity. Discuss both views and give your opinion.",
  "Some people think that the best way to reduce crime is to give longer prison sentences. Others, however, believe there are better alternative ways of reducing crime.",
]

// Task 1 chart images
const task1Images = [
  {
    id: 1,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chart1-JrRCRZzDfFv252b12m5ocFfm9gCmj1.png",
    description: "CO2 emissions per person in the UK, Sweden, Italy, and Portugal from 1967-2007",
  },
  {
    id: 2,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chart2-yUaZPrzLnGqFDg49iHN1Ag3m4nPFMA.png",
    description: "Men and women in further education in Britain across three time periods",
  },
  {
    id: 3,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chart3-CqwkiSOD6M806e18bOZ3wtwi4T0Ckh.png",
    description: "Maps showing changes in the town of Springer from 1970 until now",
  },
  {
    id: 4,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chart4-0LRxqfXNdXWtwN65wdgopqBJFcGvVl.png",
    description: "Diagram showing the recycling process of aluminum drink cans",
  },
  {
    id: 5,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chart5-z4eWtTy3yauEr6UOrcPLkGiKPHmqeq.png",
    description: "Pie charts showing age demographics in Oman and Spain in 2005 and projections for 2055",
  },
  {
    id: 6,
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chart6-DXAPPZN9Hnfcak5TlpqjzgH8z5hFsH.png",
    description: "Table showing data about underground railway systems in six major cities",
  },
]

export default function TestPage() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialSection = (searchParams.get("section") as TestSection) || "reading"

  const [currentSection, setCurrentSection] = useState<TestSection>(initialSection)
  const [currentPassage, setCurrentPassage] = useState<ReadingPassage>(1)
  const [currentListeningSection, setCurrentListeningSection] = useState<number>(1)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isTestActive, setIsTestActive] = useState<boolean>(false)
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>("")
  const [currentUser, setCurrentUser] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const fullscreenContainerRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false)
  const [showFinishConfirmation, setShowFinishConfirmation] = useState<boolean>(false)
  const [isAudioLoaded, setIsAudioLoaded] = useState<boolean>(false)
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false)
  const [currentWritingTask, setCurrentWritingTask] = useState<WritingTask>(1)
  const [selectedTask1Image, setSelectedTask1Image] = useState<number>(1)
  const [selectedTask2Topic, setSelectedTask2Topic] = useState<number>(0)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [testTakers, setTestTakers] = useState<any[]>([])
  const [isAnnotationMode, setIsAnnotationMode] = useState<boolean>(false)
  const writingContentRef = useRef<HTMLDivElement>(null)
  const [pageError, setPageError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Reading test answers - 40 questions
  const [readingAnswers, setReadingAnswers] = useState<string[]>(Array(40).fill(""))

  // Correct answers for reading
  const correctReadingAnswers = [
    // Passage 1 (13 questions)
    "TRUE", // 1
    "FALSE", // 2
    "FALSE", // 3
    "TRUE", // 4
    "FALSE", // 5
    "TRUE", // 6
    "NOT GIVEN", // 7
    "46", // 8
    "the human eye", // 9
    "Indo-European", // 10
    "Richard Brocklesby", // 11
    "Royal Institution", // 12
    "gas lighting", // 13

    // Passage 2 (13 questions)
    "v", // 14
    "ii", // 15
    "iv", // 16
    "viii", // 17
    "i", // 18
    "iii", // 19
    "vi", // 20
    "sewing machine", // 21
    "department stores", // 22
    "prices", // 23
    "Europe", // 24
    "C", // 25
    "D", // 26

    // Passage 3 (14 questions)
    "D", // 27
    "L", // 28
    "F", // 29
    "J", // 30
    "I", // 31
    "B", // 32
    "YES", // 33
    "NOT GIVEN", // 34
    "YES", // 35
    "NOT GIVEN", // 36
    "D", // 37
    "A", // 38
    "B", // 39
    "C", // 40
  ]

  // Listening test answers - 40 questions
  const [listeningAnswers, setListeningAnswers] = useState<string[]>(Array(40).fill(""))

  // Correct answers for listening
  const correctListeningAnswers = [
    // Section 1 (10 questions)
    "database", // 1
    "rock", // 2
    "month", // 3
    "25", // 4
    "500", // 5
    "studio", // 6
    "legal", // 7
    "photograph", // 8
    "King", // 9
    "alive", // 10

    // Section 2 (10 questions)
    "A", // 11
    "B", // 12
    "C", // 13
    "C", // 14
    "F", // 15
    "A", // 16
    "D", // 17
    "H", // 18
    "B", // 19
    "G", // 20

    // Section 3 (10 questions)
    "A", // 21
    "C", // 22
    "C", // 23
    "A", // 24
    "C", // 25
    "C", // 26
    "B", // 27
    "C", // 28
    "F", // 29
    "D", // 30

    // Section 4 (10 questions)
    "erosion", // 31
    "fuel", // 32
    "pesticides", // 33
    "rubbish", // 34
    "bamboo", // 35
    "red", // 36
    "nursery", // 37
    "fresh", // 38
    "crab", // 39
    "storm", // 40
  ]

  // Writing test answers
  const [writingAnswer1, setWritingAnswer1] = useState<string>("")
  const [writingAnswer2, setWritingAnswer2] = useState<string>("")

  // Band scores
  const [readingBand, setReadingBand] = useState<number>(0)
  const [listeningBand, setListeningBand] = useState<number>(0)
  const [writingBand, setWritingBand] = useState<number>(0)
  const [overallBand, setOverallBand] = useState<number>(0)

  // Timer configuration in seconds
  const timerConfig: TimerConfig = {
    reading: 60 * 60, // 60 minutes
    listening: 30 * 60, // 30 minutes
    writing: 60 * 60, // 60 minutes
  }

  // For development/testing, use shorter times
  const devTimerConfig: TimerConfig = {
    reading: 3 * 60, // 3 minutes
    listening: 3 * 60, // 3 minutes
    writing: 3 * 60, // 3 minutes
  }

  // Check if user is logged in
  useEffect(() => {
    try {
      setIsLoading(true)
      const isLoggedIn = sessionStorage.getItem("isLoggedIn")
      const user = sessionStorage.getItem("currentUser") || ""

      if (!isLoggedIn) {
        router.push("/")
        return
      } else {
        setCurrentUser(user)

        // Check if user is admin
        if (user === "superadmin8071") {
          setIsAdmin(true)
          // Fetch test takers
          try {
            const testTakers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
            setTestTakers(testTakers)
          } catch (err) {
            console.error("Error parsing test takers:", err)
            setTestTakers([])
          }
        }

        // Initialize timer based on current section
        const isDev = process.env.NODE_ENV === "development" || window.location.hostname === "localhost"
        setTimeRemaining(isDev ? devTimerConfig[currentSection] : timerConfig[currentSection])

        setIsLoading(false)
      }
    } catch (err) {
      console.error("Authentication error:", err)
      setPageError("There was an error loading the test. Please try logging in again.")
      setIsLoading(false)
    }
  }, [router, currentSection])

  // Initialize timer based on current section
  useEffect(() => {
    if (!isTestActive) {
      // Use development timer in preview mode
      const isDev = process.env.NODE_ENV === "development" || window.location.hostname === "localhost"
      setTimeRemaining(isDev ? devTimerConfig[currentSection] : timerConfig[currentSection])
    }
  }, [currentSection, isTestActive])

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isTestActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (isTestActive && timeRemaining === 0) {
      // Move to next section when timer ends
      if (currentSection === "reading" && currentPassage < 3) {
        handleNextPassage()
      } else {
        handleSectionComplete()
      }
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isTestActive, timeRemaining, currentSection, currentPassage])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Randomly select Task 1 image and Task 2 topic when test starts
  useEffect(() => {
    if (isTestActive) {
      // Random Task 1 image (1-6)
      const randomImageIndex = Math.floor(Math.random() * 6) + 1
      setSelectedTask1Image(randomImageIndex)

      // Random Task 2 topic
      const randomTopicIndex = Math.floor(Math.random() * writingTask2Topics.length)
      setSelectedTask2Topic(randomTopicIndex)
    }
  }, [isTestActive])

  // Save test state when user leaves the page
  useEffect(() => {
    // Save test state when user leaves the page
    const handleBeforeUnload = () => {
      // Save current test state
      const testState = {
        currentSection,
        currentPassage,
        currentListeningSection,
        timeRemaining,
        readingAnswers,
        listeningAnswers,
        writingAnswer1,
        writingAnswer2,
        currentWritingTask,
        selectedTask1Image,
        selectedTask2Topic,
        timestamp: Date.now(),
      }
      localStorage.setItem("ieltsTestState", JSON.stringify(testState))

      // Also save partial results
      const student = sessionStorage.getItem("currentUser") || "Anonymous"

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
        writingTask1: writingAnswer1 || "NA",
        writingTask2: writingAnswer2 || "NA",
        writingTask1Words: writingAnswer1.split(/\s+/).filter(Boolean).length,
        writingTask2Words: writingAnswer2.split(/\s+/).filter(Boolean).length,
        writingBand: 0, // To be scored by admin
        overallBand: 0, // To be calculated by admin
        completed: new Date().toLocaleString(),
        status: "Incomplete",
      }

      // Get existing results
      const existingResultsJSON = localStorage.getItem("testResults")
      const existingResults = existingResultsJSON ? JSON.parse(existingResultsJSON) : []

      // Add new result
      const updatedResults = [...existingResults, testResult]

      // Save to localStorage
      localStorage.setItem("testResults", JSON.stringify(updatedResults))

      // Try to send to Telegram
      try {
        const message = `
*IELTS Test Incomplete*
Student: ${student}
Date: ${new Date().toLocaleString()}

*Reading*
Questions Answered: ${Object.keys(readingAnswers).length}/40

*Listening*
Questions Answered: ${Object.keys(listeningAnswers).length}/40

*Writing*
Task 1 Words: ${writingAnswer1.split(/\s+/).filter(Boolean).length || "NA"}
Task 2 Words: ${writingAnswer2.split(/\s+/).filter(Boolean).length || "NA"}

*Note:* This test was not completed. The student left the test.
      `

        fetch("/api/send-telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            token: "8115894799:AAGckh-QqdWre1Bkfq6l8FrQcNqmVPgLJV4",
          }),
          keepalive: true,
        }).catch((err) => console.error("Failed to send to Telegram:", err))
      } catch (error) {
        console.error("Error sending to Telegram:", error)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [
    currentSection,
    currentPassage,
    currentListeningSection,
    timeRemaining,
    readingAnswers,
    listeningAnswers,
    writingAnswer1,
    writingAnswer2,
    currentWritingTask,
    selectedTask1Image,
    selectedTask2Topic,
  ])

  const startTest = () => {
    setIsTestActive(true)
    // Redirect to listening test when starting
    router.push("/listening")
  }

  const handleNextPassage = () => {
    if (currentPassage < 3) {
      setCurrentPassage((prev) => (prev + 1) as ReadingPassage)
    }
  }

  const handlePreviousPassage = () => {
    if (currentPassage > 1) {
      setCurrentPassage((prev) => (prev - 1) as ReadingPassage)
    }
  }

  const handleNextListeningSection = () => {
    if (currentListeningSection < 4) {
      setCurrentListeningSection(currentListeningSection + 1)
    }
  }

  const handlePreviousListeningSection = () => {
    if (currentListeningSection > 1) {
      setCurrentListeningSection(currentListeningSection - 1)
    }
  }

  const calculateReadingScore = () => {
    let score = 0
    for (let i = 0; i < correctReadingAnswers.length; i++) {
      if (readingAnswers[i]?.toUpperCase() === correctReadingAnswers[i]?.toUpperCase()) {
        score++
      }
    }
    return score
  }

  const calculateListeningScore = () => {
    let score = 0
    for (let i = 0; i < correctListeningAnswers.length; i++) {
      if (listeningAnswers[i]?.toUpperCase() === correctListeningAnswers[i]?.toUpperCase()) {
        score++
      }
    }
    return score
  }

  const handleSectionComplete = () => {
    // Move to next section
    if (currentSection === "listening") {
      // Calculate listening band score before moving to next section
      const listeningScore = calculateListeningScore()
      const band = calculateBandScore(listeningScore, correctListeningAnswers.length)
      setListeningBand(band)

      router.push("/reading") // Navigate to reading page
    } else if (currentSection === "reading") {
      // Calculate reading band score
      const readingScore = calculateReadingScore()
      const band = calculateBandScore(readingScore, correctReadingAnswers.length)
      setReadingBand(band)

      router.push("/writing/task1") // Navigate to writing task 1 page
    } else if (currentSection === "writing") {
      // Don't rate writing, just count words
      const task1Words = writingAnswer1.split(/\s+/).filter((word) => word.length > 0).length
      const task2Words = writingAnswer2.split(/\s+/).filter((word) => word.length > 0).length

      // Calculate overall band score (average of reading and listening only)
      const overall = (readingBand + listeningBand) / 2
      setOverallBand(Math.round(overall * 10) / 10) // Round to nearest 0.1

      // Test is complete - send results
      router.push("/test-complete") // Navigate to test completion page
    }
  }

  const checkAudioLoaded = () => {
    if (audioRef.current) {
      if (audioRef.current.readyState >= 2) {
        setIsAudioLoaded(true)
        setIsAudioLoading(false)
      } else {
        setIsAudioLoaded(false)
      }
    }
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause()
        setIsAudioPlaying(false)
      } else {
        // First, check if the audio is actually loaded
        if (audioRef.current.readyState < 2) {
          // Audio not loaded yet, try to load it first
          setIsAudioLoading(true)
          audioRef.current.load()

          // Show a message to the user
          alert(
            "Audio is loading. Please try again in a moment. If the issue persists, ensure the audio file exists in the public/audio directory.",
          )
          return
        }

        // Try to play the audio
        try {
          const playPromise = audioRef.current.play()

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsAudioPlaying(true)
                console.log("Audio playback started successfully")
              })
              .catch((error) => {
                console.error("Audio playback failed:", error)
                setIsAudioPlaying(false)

                // Provide a more helpful message
                if (error.name === "NotAllowedError") {
                  alert("Browser blocked autoplay. Please interact with the page first and try again.")
                } else if (error.name === "NotSupportedError") {
                  alert("Audio format not supported by your browser.")
                } else {
                  alert(
                    `Audio playback failed: ${error.message || "Unknown error"}. Please ensure the audio file exists in the public/audio directory.`,
                  )
                }
              })
          }
        } catch (error) {
          console.error("Error playing audio:", error)
          setIsAudioPlaying(false)
          alert(`Error playing audio: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
      }
    } else {
      alert("Audio player not initialized. Please refresh the page and try again.")
    }
  }

  // Add this effect to auto-play audio when listening section starts and handle loading
  useEffect(() => {
    // Auto-play audio when listening section starts
    if (currentSection === "listening" && isTestActive && audioRef.current) {
      setIsAudioLoading(true)

      // Check if audio is already loaded
      if (audioRef.current.readyState >= 2) {
        setIsAudioLoaded(true)
        setIsAudioLoading(false)
        tryPlayAudio()
      } else {
        // Set up event listeners for audio loading
        const handleCanPlay = () => {
          setIsAudioLoaded(true)
          setIsAudioLoading(false)
          if (isTestActive && currentSection === "listening") {
            tryPlayAudio()
          }
        }

        audioRef.current.addEventListener("canplay", handleCanPlay)
        audioRef.current.load() // Start loading the audio

        return () => {
          if (audioRef.current) {
            audioRef.current.removeEventListener("canplay", handleCanPlay)
          }
        }
      }
    }

    function tryPlayAudio() {
      if (!audioRef.current) return

      try {
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsAudioPlaying(true)
              console.log("Audio started automatically")
            })
            .catch((error) => {
              console.error("Auto-play failed:", error)

              // Provide more specific guidance based on the error
              if (error.name === "NotAllowedError") {
                console.log("Browser blocked autoplay due to lack of user interaction")
              }

              // Don't show alert as it might be disruptive, just log to console
              console.log("User needs to click 'Play Audio' button to start the listening test")
            })
        }
      } catch (error) {
        console.error("Error auto-playing audio:", error)
      }
    }
  }, [currentSection, isTestActive, isAudioPlaying])

  // Save test state to localStorage when it changes
  useEffect(() => {
    if (isTestActive) {
      const testState = {
        currentSection,
        currentPassage,
        currentListeningSection,
        timeRemaining,
        readingAnswers,
        listeningAnswers,
        writingAnswer1,
        writingAnswer2,
        currentWritingTask,
        selectedTask1Image,
        selectedTask2Topic,
        timestamp: Date.now(),
      }
      localStorage.setItem("ieltsTestState", JSON.stringify(testState))
    }
  }, [
    isTestActive,
    currentSection,
    currentPassage,
    currentListeningSection,
    timeRemaining,
    readingAnswers,
    listeningAnswers,
    writingAnswer1,
    writingAnswer2,
    currentWritingTask,
    selectedTask1Image,
    selectedTask2Topic,
  ])

  // Restore test state on component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("ieltsTestState")
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState)
          const currentTime = Date.now()
          const timePassed = Math.floor((currentTime - parsedState.timestamp) / 1000)

          // Apply time penalty (3 seconds) for refreshing
          const timeWithPenalty = Math.max(0, parsedState.timeRemaining - timePassed - 3)

          setCurrentSection(parsedState.currentSection)
          setCurrentPassage(parsedState.currentPassage)
          setCurrentListeningSection(parsedState.currentListeningSection)
          setTimeRemaining(timeWithPenalty)
          setReadingAnswers(parsedState.readingAnswers)
          setListeningAnswers(parsedState.listeningAnswers)
          setWritingAnswer1(parsedState.writingAnswer1 || "")
          setWritingAnswer2(parsedState.writingAnswer2 || "")
          setCurrentWritingTask(parsedState.currentWritingTask || 1)
          setSelectedTask1Image(parsedState.selectedTask1Image || 1)
          setSelectedTask2Topic(parsedState.selectedTask2Topic || 0)
          setIsTestActive(true)
        } catch (error) {
          console.error("Error restoring test state:", error)
          // Initialize with default values instead of failing
          const isDev = process.env.NODE_ENV === "development" || window.location.hostname === "localhost"
          setTimeRemaining(isDev ? devTimerConfig[currentSection] : timerConfig[currentSection])
        }
      } else {
        // No saved state, initialize with defaults
        const isDev = process.env.NODE_ENV === "development" || window.location.hostname === "localhost"
        setTimeRemaining(isDev ? devTimerConfig[currentSection] : timerConfig[currentSection])
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      // Initialize with default values
      const isDev = process.env.NODE_ENV === "development" || window.location.hostname === "localhost"
      setTimeRemaining(isDev ? devTimerConfig[currentSection] : timerConfig[currentSection])
    }
  }, [currentSection])

  const finishTest = async () => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const readingScore = calculateReadingScore()
      const listeningScore = calculateListeningScore()
      const readingBandScore = calculateBandScore(readingScore, correctReadingAnswers.length)
      const listeningBandScore = calculateBandScore(listeningScore, correctListeningAnswers.length)

      // Calculate word counts for writing tasks
      const task1Words = writingAnswer1.split(/\s+/).filter((word) => word.length > 0).length
      const task2Words = writingAnswer2.split(/\s+/).filter((word) => word.length > 0).length

      // Define total questions for reading and listening
      const readingTotal = correctReadingAnswers.length
      const listeningTotal = correctListeningAnswers.length

      const results = {
        student: currentUser,
        readingScore,
        readingTotal,
        readingPercentage: Math.round((readingScore / readingTotal) * 100),
        readingBand: readingBandScore,
        listeningScore,
        listeningTotal,
        listeningPercentage: Math.round((listeningScore / listeningTotal) * 100),
        listeningBand: listeningBandScore,
        writingTask1: writingAnswer1 || "No response provided",
        writingTask1Words: task1Words,
        writingTask2: writingAnswer2 || "No response provided",
        writingTask2Words: task2Words,
        // Calculate overall band score without writing
        overallBand: Math.round(((readingBandScore + listeningBandScore) / 2) * 10) / 10,
        completed: new Date().toLocaleString(),
      }

      // Store results locally in browser for backup
      storeLocalResults(results)

      const message = `
📊 *IELTS Test Results*

👤 *Student*: ${results.student}

📚 *Reading*: ${results.readingScore}/${results.readingTotal} (${results.readingPercentage}%) - Band ${results.readingBand.toFixed(1)}
🎧 *Listening*: ${results.listeningScore}/${results.listeningTotal} (${results.listeningPercentage}%) - Band ${results.listeningBand.toFixed(1)}

✍️ *Writing*:
Task 1 (${task1Words} words):
"${writingAnswer1}"

Task 2 (${task2Words} words):
"${writingAnswer2}"

🌟 *Overall Band Score*: ${results.overallBand.toFixed(1)}

⏰ *Completed*: ${results.completed}
    `

      // Always log results to console as a reliable fallback
      console.log("========== TEST RESULTS ==========")
      console.log(message)
      console.log("==================================")

      try {
        // Send to API endpoint
        const response = await fetch("/api/send-telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to submit results")
        }
      } catch (apiError) {
        console.error("API route error:", apiError)
        // Continue with test completion even if API fails
      }

      // Show completion message
      setIsTestComplete(true)
      setIsTestActive(false)

      // Clear ALL test data for a fresh start
      localStorage.removeItem("writingTask1Answer")
      localStorage.removeItem("writingTask2Answer")
      localStorage.removeItem("writingTask1TopicIndex")
      localStorage.removeItem("writingTask2TopicIndex")
      localStorage.removeItem("ieltsTestState")
      localStorage.removeItem("readingAnswers")
      localStorage.removeItem("listeningAnswers")
      sessionStorage.removeItem("isLoggedIn")
    } catch (error) {
      console.error("Error submitting results:", error)
      setSubmitError("There was an error submitting your results, but your test will still be completed.")

      // Still complete the test even if there's an error
      setTimeout(() => {
        setIsTestComplete(true)
        setIsTestActive(false)

        // Clear ALL test data for a fresh start
        localStorage.removeItem("writingTask1Answer")
        localStorage.removeItem("writingTask2Answer")
        localStorage.removeItem("writingTask1TopicIndex")
        localStorage.removeItem("writingTask2TopicIndex")
        localStorage.removeItem("ieltsTestState")
        localStorage.removeItem("readingAnswers")
        localStorage.removeItem("listeningAnswers")
        sessionStorage.removeItem("isLoggedIn")
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a function to completely reset the test state
  const resetTestState = () => {
    localStorage.removeItem("writingTask1Answer")
    localStorage.removeItem("writingTask2Answer")
    localStorage.removeItem("writingTask1TopicIndex")
    localStorage.removeItem("writingTask2TopicIndex")
    localStorage.removeItem("ieltsTestState")
    localStorage.removeItem("readingAnswers")
    localStorage.removeItem("listeningAnswers")
    setReadingAnswers(Array(40).fill(""))
    setListeningAnswers(Array(40).fill(""))
    setWritingAnswer1("")
    setWritingAnswer2("")
    setCurrentSection("reading")
    setCurrentPassage(1)
    setCurrentListeningSection(1)
    setIsTestActive(false)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours > 0 ? `${hours}:` : ""}${minutes < 10 && hours > 0 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`
  }

  const handleReadingAnswerChange = (index: number, value: string) => {
    const newAnswers = [...readingAnswers]
    newAnswers[index] = value
    setReadingAnswers(newAnswers)
  }

  const handleListeningAnswerChange = (index: number, value: string) => {
    const newAnswers = [...listeningAnswers]
    newAnswers[index] = value
    setListeningAnswers(newAnswers)
  }

  const toggleAnnotationMode = () => {
    setIsAnnotationMode(!isAnnotationMode)
  }

  const renderReadingSection = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Reading Section</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column - Reading passage */}
          <div className="border overflow-auto">
            <h3 className="text-xl font-semibold">Reading Passage {currentPassage}</h3>
            <div className="">
              <p>The first paragraph of reading passage {currentPassage}.</p>
              <p>The second paragraph of reading passage {currentPassage}.</p>
              <p>The third paragraph of reading passage {currentPassage}.</p>
              <p>The fourth paragraph of reading passage {currentPassage}.</p>
              <p>The fifth paragraph of reading passage {currentPassage}.</p>
              <p>The sixth paragraph of reading passage {currentPassage}.</p>
              <p>The seventh paragraph of reading passage {currentPassage}.</p>
              <p>The eighth paragraph of reading passage {currentPassage}.</p>
              <p>The ninth paragraph of reading passage {currentPassage}.</p>
              <p>The tenth paragraph of reading passage {currentPassage}.</p>
              <p>The eleventh paragraph of reading passage {currentPassage}.</p>
              <p>The twelfth paragraph of reading passage {currentPassage}.</p>
              <p>The thirteenth paragraph of reading passage {currentPassage}.</p>
              {currentPassage === 3 && <p>The fourteenth paragraph of reading passage {currentPassage}.</p>}
            </div>
          </div>

          {/* Right column - Questions */}
          <div className="">
            <h3 className="text-xl font-semibold">Reading Questions</h3>
            <ol className="list-decimal pl-5 space-y-4">
              {Array.from({ length: currentPassage === 3 ? 14 : 13 }, (_, i) => {
                const questionIndex = i + (currentPassage - 1) * (currentPassage === 3 ? 13 : 13)
                return (
                  <li key={questionIndex} className="mb-2">
                    <label htmlFor={`reading-answer-${questionIndex}`} className="font-medium block mb-2">
                      Question {questionIndex + 1}
                    </label>
                    <input
                      type="text"
                      id={`reading-answer-${questionIndex}`}
                      className="w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={readingAnswers[questionIndex] || ""}
                      onChange={(e) => handleReadingAnswerChange(questionIndex, e.target.value)}
                    />
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button onClick={handlePreviousPassage} disabled={currentPassage === 1}>
            Previous Passage
          </Button>
          <Button onClick={currentPassage === 3 ? () => router.push("/listening") : handleNextPassage}>
            {currentPassage === 3 ? "Go to Listening" : "Next Passage"}
          </Button>
        </div>
      </div>
    )
  }

  const renderListeningSection = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Listening Section</h2>
        <div className="mb-4">
          <p>Section {currentListeningSection}</p>
          <div className="flex justify-between">
            <Button onClick={handlePreviousListeningSection} disabled={currentListeningSection === 1}>
              Previous Section
            </Button>
            <Button onClick={handleNextListeningSection} disabled={currentListeningSection === 4}>
              Next Section
            </Button>
          </div>
        </div>

        {/* Listening Audio Player */}
        <div className="mb-4">
          <audio ref={audioRef} src="/audio/ielts-listening-test.mp3" preload="auto" onCanPlay={checkAudioLoaded} />

          <div className="flex items-center space-x-4">
            <Button onClick={toggleAudio} disabled={isAudioLoading}>
              {isAudioLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading Audio
                </>
              ) : isAudioPlaying ? (
                "Pause Audio"
              ) : (
                "Play Audio"
              )}
            </Button>
            {!isAudioLoaded && isAudioLoading && (
              <span className="text-gray-500">Audio is loading, please wait...</span>
            )}
          </div>
        </div>

        {/* Listening Questions */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Listening Questions</h3>
          <ol className="list-decimal pl-5">
            {Array.from({ length: 10 }, (_, i) => (
              <li key={i + (currentListeningSection - 1) * 10} className="mb-2">
                <label htmlFor={`listening-answer-${i + (currentListeningSection - 1) * 10}`}>
                  Question {i + (currentListeningSection - 1) * 10 + 1}
                </label>
                <input
                  type="text"
                  id={`listening-answer-${i + (currentListeningSection - 1) * 10}`}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={listeningAnswers[i + (currentListeningSection - 1) * 10] || ""}
                  onChange={(e) => handleListeningAnswerChange(i + (currentListeningSection - 1) * 10, e.target.value)}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }

  const renderWritingSection = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Writing Section</h2>

        {/* Task 1 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Writing Task 1: Chart Description</h3>
          <p>
            Summarize the information by selecting and reporting the main features, and make comparisons where relevant.
          </p>

          {/* Display the selected chart image */}
          {task1Images.find((image) => image.id === selectedTask1Image) && (
            <div className="mb-4">
              <img
                src={task1Images.find((image) => image.id === selectedTask1Image)?.url || "/placeholder.svg"}
                alt={task1Images.find((image) => image.id === selectedTask1Image)?.description}
                className="max-w-full h-auto"
              />
              <p className="text-sm text-gray-500 mt-1">
                {task1Images.find((image) => image.id === selectedTask1Image)?.description}
              </p>
            </div>
          )}

          <textarea
            id="writing-answer-1"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={6}
            placeholder="Write your answer here..."
            value={writingAnswer1}
            onChange={(e) => setWritingAnswer1(e.target.value)}
          />
        </div>

        {/* Task 2 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Writing Task 2: Essay</h3>
          <p>
            Write at least 250 words. Give reasons for your answer and include any relevant examples from your own
            knowledge or experience.
          </p>

          {/* Display the selected topic */}
          {writingTask2Topics[selectedTask2Topic] && (
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">{writingTask2Topics[selectedTask2Topic]}</p>
            </div>
          )}

          <textarea
            id="writing-answer-2"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={6}
            placeholder="Write your answer here..."
            value={writingAnswer2}
            onChange={(e) => setWritingAnswer2(e.target.value)}
          />
        </div>
      </div>
    )
  }

  // Add this right after all the state and effect declarations, before rendering the main content
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">{t("loading_test")}</h2>
        <p className="text-gray-500 dark:text-gray-400">{t("please_wait_while_we_prepare_your_test")}</p>
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{pageError}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/")} className="w-full">
            {t("return_to_login")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 p-4">
      <style dangerouslySetInnerHTML={{ __html: audioLoadingStyles }} />

      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">IELTS Test</h1>

        {isTestComplete ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Test Complete</h2>
            {submitError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <p className="mb-6">Thank you for completing the test.</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Return to Login Page
            </Button>
          </div>
        ) : isTestActive ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg">
                Time Remaining: <span className="font-semibold">{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowFinishConfirmation(true)}>Finish Test</Button>
              </div>
            </div>

            {currentSection === "reading" && renderReadingSection()}
            {currentSection === "listening" && renderListeningSection()}
            {currentSection === "writing" && renderWritingSection()}
          </>
        ) : (
          <div className="text-center">
            <p className="mb-4">Ready to start your IELTS test?</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push("/")} variant="outline">
                Return to Login
              </Button>
              <Button onClick={startTest}>Start Test</Button>
            </div>
          </div>
        )}

        {showFinishConfirmation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Finish Test</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to finish the test?</p>
                </div>
                <div className="items-center px-4 py-3">
                  <Button
                    onClick={() => {
                      setShowFinishConfirmation(false)
                      finishTest()
                    }}
                    className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Finish
                  </Button>
                  <Button
                    onClick={() => setShowFinishConfirmation(false)}
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mt-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
