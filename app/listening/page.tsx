"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Volume2 } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { TextAnnotator } from "@/components/text-annotator"
import { TextAnnotationTools } from "@/components/text-annotation-tools"

export default function ListeningTest() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [volume, setVolume] = useState(70)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [inputErrors, setInputErrors] = useState<Record<string, string>>({})
  const [annotations, setAnnotations] = useState<any[]>([])
  const [currentTool, setCurrentTool] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(30 * 60) // 30 minutes in seconds
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now())

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Load saved answers from localStorage
    const savedAnswers = localStorage.getItem("listeningAnswers")
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }

    // Load current section
    const savedSection = localStorage.getItem("currentListeningSection")
    if (savedSection) {
      setCurrentSection(Number.parseInt(savedSection))
    }

    // Load saved annotations from localStorage
    const savedAnnotations = localStorage.getItem("listeningAnnotations")
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations))
    }

    // Load saved time from localStorage
    const savedTime = localStorage.getItem("listeningTimeRemaining")
    if (savedTime) {
      const parsedTime = Number.parseInt(savedTime, 10)
      if (!isNaN(parsedTime)) {
        setTimeRemaining(parsedTime)
      }
    }

    // Get the last refresh time
    const savedRefreshTime = localStorage.getItem("listeningLastRefreshTime")
    if (savedRefreshTime) {
      const parsedRefreshTime = Number.parseInt(savedRefreshTime, 10)
      if (!isNaN(parsedRefreshTime)) {
        const currentTime = Date.now()
        const timeDiff = Math.floor((currentTime - parsedRefreshTime) / 1000)

        // Apply time penalty (3 seconds) for refreshing
        setTimeRemaining((prev) => Math.max(0, prev - timeDiff - 3))
      }
    }

    // Save current refresh time
    setLastRefreshTime(Date.now())
    localStorage.setItem("listeningLastRefreshTime", Date.now().toString())

    // Start playing audio automatically
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback error:", error)
      })
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("currentListeningSection", currentSection.toString())
    localStorage.setItem("listeningAnswers", JSON.stringify(answers))
    localStorage.setItem("listeningAnnotations", JSON.stringify(annotations))
    localStorage.setItem("listeningTimeRemaining", timeRemaining.toString())
  }, [currentSection, answers, annotations, timeRemaining])

  // Update audio volume
  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      audioRef.current.volume = volume / 100
    }
  }, [volume, audioLoaded])

  // Add event listener for audio ended
  useEffect(() => {
    const handleAudioEnded = () => {
      localStorage.setItem("currentSection", "reading")
      router.push("/reading")
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnded)
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioEnded)
      }
    }
  }, [router])

  const handleAnswerChange = (questionId: string, value: string) => {
    // For questions 15-20, validate that the input is a letter from A to I
    if (questionId.match(/^lq1[5-9]$/) || questionId === "lq20") {
      if (value && !value.match(/^[A-I]$/i)) {
        setInputErrors({
          ...inputErrors,
          [questionId]: "Please enter a letter from A to I only",
        })
        return
      } else {
        // Clear error if input is valid
        const newErrors = { ...inputErrors }
        delete newErrors[questionId]
        setInputErrors(newErrors)
      }

      // Convert to uppercase for consistency
      value = value.toUpperCase()
    }

    // For questions 27-30, validate that the input is a letter from A to F
    if (questionId.match(/^lq(27|28|29|30)$/)) {
      if (value && !value.match(/^[A-F]$/i)) {
        setInputErrors({
          ...inputErrors,
          [questionId]: "Please enter a letter from A to F only",
        })
        return
      } else {
        // Clear error if input is valid
        const newErrors = { ...inputErrors }
        delete newErrors[questionId]
        setInputErrors(newErrors)
      }

      // Convert to uppercase for consistency
      value = value.toUpperCase()
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNextSection = () => {
    if (currentSection < sections.length) {
      setCurrentSection(currentSection + 1)
      window.scrollTo(0, 0)
    } else {
      localStorage.setItem("currentSection", "reading")
      router.push("/reading")
      // Mark listening as completed when moving to reading
      if (currentSection === sections.length) {
        localStorage.setItem("listeningCompleted", "true")
      }
    }
  }

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleAnnotation = (annotation: any) => {
    setAnnotations((prev) => [...prev, annotation])
  }

  const handleCircleClick = () => {
    setCurrentTool(currentTool === "circle" ? null : "circle")
  }

  const handleUndoAnnotation = () => {
    setAnnotations((prev) => prev.slice(0, -1))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Listening sections content
  const sections = [
    {
      title: "SECTION 1 Questions 1-10",
      instructions: "Complete the notes below.\n\nWrite ONE WORD or A NUMBER for each answer.",
      content: `Music Alive Agency
Example
Contact person: Jim Granley

Members' details are on a [1] 
Type of music represented: modem music ([2] and jazz)
Newsletter comes out once a [3] 
Cost of adult membership: [4] £ 
Current number of members: [5] 
Facilities include: rehearsal rooms and a [6] 
There is no charge for [7] advice
To become a member, send -a letter with contact details
                        -a recent [8] 
Address: 707, [9] Street, Marbury
Contact email: music.[10]@bsu.co.uk`,
    },
    {
      title: "SECTION 2 Questions 11-20",
      instructions: "Questions 11-14\n\nChoose the correct letter A, B or C.",
      content: `Information for participants in the Albany fishing competition

11 What do participants need to take to the registration desk?
A a form of identification
B a competitor number
C cash for the entrance fee

12 What does the entrance fee to the competition include?
A equipment for fishing
B all food for both days
C fuel for the fishing

13 Participants without a fishing licence are recommended to apply for one
A at the registration desk.
B over the phone.
C on the internet.

14 What will happen at 6pm on Sunday?
A The time allocated for fishing will end.
B The fish caught will be judged.
C The prizes will be awarded to the winners.

Questions 15-20

Label the map below.

Write the correct letter, A-I, next to questions 15-20.

Albany Fishing Competition Map

15 Registration area 
16 Shore fishing area 
17 Boat launching area 
18 Judging area 
19 Dining area 
20 Prize-giving area `,
      hasMap: true,
      mapQuestions: [15, 16, 17, 18, 19, 20],
    },
    {
      title: "SECTION 3 Questions 21-30",
      instructions: "Questions 21-26\n\nChoose the correct letter, A, B or C.",
      content: `Preparing for the end-of-year art exhibition

21 Max and Abby agree that in the art exhibition they are looking forward to
A showing people their work.
B getting feedback from their tutor.
C talking to other students about their displays.

22 In last year's exhibition, both students were impressed by
A a set of metal sculptures.
B a series of wooden models.
C a collection of textile designs.

23 What has Max decided to call his display?
A Mother Nature
B Views of Farmland
C Seasons

24 What does Abby think will be difficult about preparing for their displays?
A having enough time to set it up
B choosing which pieces to show
C filling up all the available space

25 What does Abby say about the summary they have to write?
A She isn't sure whether people will read it.
B It will be difficult to keep it short enough.
C It will be hard to clarify the reasons for her work.

26 What aspect of the display will the students organise themselves?
A arranging the lighting
B inviting local journalists
C providing comment forms

Questions 27-30

Which feature do the speakers identify as particularly interesting for each of the following exhibitions they saw?
Choose FOUR answers from the box and write the correct letter, A-F, next to questions 27-30.

Interesting features
A the realistic colours
B the sense of space
C the unusual interpretation of the theme
D the painting technique
E the variety of materials use
F the use of light and shade

Exhibitions
27 On the Water 
28 City Life 
29 Faces 
30 Moods `,
      boxQuestions: [27, 28, 29, 30],
    },
    {
      title: "SECTION 4 Questions 31-40",
      instructions: "Complete the notes below\n\nWrite NO MORE THAN TWO WORDS for each answer",
      content: `The Mangrove Regeneration Project
Background:
Mangrove forests:
• protect coastal areas from [31] by the sea
• are an important habitat for wildlife

Problems:
• mangroves had been used by farmers as [32]
• mangroves were poisoned by the use of [33]
• local people used the mangroves as a place to put their [34]

Actions taken to protect the mangroves:
• a barrier which was made of [35] was constructed - but it failed
• new mangroves had to be grown from seed
• the seeds of the [36] mangrove were used

First set of seedlings:
• kept in small pots in a [37]
• Watered with [38] rain water
• planted out on south side of a small island
• at risk from the large [39] population

Second set of seedlings:
• planted in the seabed near established mangrove roots
• the young plants were destroyed in a [40]

Results: The first set of seedlings was successful`,
    },
  ]

  const currentSectionData = sections[currentSection - 1]

  // Function to render content with input fields
  const renderContent = (content: string) => {
    // Replace [number] with input fields
    const parts = content.split(/(\[\d+\])/g)

    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/)
      if (match) {
        const questionNumber = match[1]
        const questionId = `lq${questionNumber}`

        return (
          <span key={index} className="inline-block">
            <input
              type="text"
              value={answers[questionId] || ""}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              className="border-b-2 border-dotted border-gray-400 focus:outline-none focus:border-gray-600 min-w-[120px] bg-transparent mx-1 text-lg"
              aria-label={`Question ${questionNumber}`}
            />
            {inputErrors[questionId] && <div className="text-red-500 text-xs mt-1">{inputErrors[questionId]}</div>}
          </span>
        )
      }

      return <span key={index}>{part}</span>
    })
  }

  // Function to render multiple choice questions
  const renderMultipleChoice = (content: string) => {
    const lines = content.split("\n")
    const result = []

    let currentQuestion = null
    let options = []
    let inMapSection = false
    let inBoxSection = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Check if we're entering the map section
      if (line.includes("Questions 15-20")) {
        inMapSection = true
      }

      // Check if we're entering the box section (questions 27-30)
      if (line.includes("Questions 27-30")) {
        inBoxSection = true
      }

      // Check if this is a question line (starts with a number)
      const questionMatch = line.match(/^(\d+)\s(.+)/)
      if (questionMatch) {
        const questionNumber = Number.parseInt(questionMatch[1])

        // If we have a previous question, add it to the result
        if (currentQuestion) {
          result.push(
            <div key={`question-${currentQuestion.number}`} className="mb-6">
              <p className="mb-3 text-lg font-medium">
                {currentQuestion.number} {currentQuestion.text}
              </p>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <label
                    key={`option-${index}`}
                    className={`flex items-start ml-4 mb-1 p-3 rounded cursor-pointer text-lg ${
                      answers[`lq${currentQuestion.number}`] === option.letter
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    htmlFor={`lq${currentQuestion.number}-${option.letter}`}
                  >
                    <input
                      type="radio"
                      id={`lq${currentQuestion.number}-${option.letter}`}
                      name={`lq${currentQuestion.number}`}
                      value={option.letter}
                      checked={answers[`lq${currentQuestion.number}`] === option.letter}
                      onChange={() => handleAnswerChange(`lq${currentQuestion.number}`, option.letter)}
                      className="mr-3 mt-1"
                    />
                    <span>
                      {option.letter} {option.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>,
          )
          options = []
        }

        // Handle map questions (15-20)
        if (inMapSection && currentSectionData.mapQuestions?.includes(questionNumber)) {
          result.push(
            <div key={`map-question-${questionNumber}`} className="mb-4 flex items-center">
              <span className="mr-3 text-lg">
                {questionNumber} {questionMatch[2]}
              </span>
              <input
                type="text"
                value={answers[`lq${questionNumber}`] || ""}
                onChange={(e) => handleAnswerChange(`lq${questionNumber}`, e.target.value)}
                className="border-b-2 border-dotted border-gray-400 focus:outline-none focus:border-gray-600 w-16 bg-transparent text-lg"
                aria-label={`Question ${questionNumber}`}
                maxLength={1}
                placeholder="A-I"
              />
              {inputErrors[`lq${questionNumber}`] && (
                <div className="text-red-500 text-xs ml-2">{inputErrors[`lq${questionNumber}`]}</div>
              )}
            </div>,
          )
          continue
        }

        // Handle box questions (27-30)
        if (inBoxSection && currentSectionData.boxQuestions?.includes(questionNumber)) {
          result.push(
            <div key={`box-question-${questionNumber}`} className="mb-4 flex items-center">
              <span className="mr-3 text-lg">
                {questionNumber} {questionMatch[2]}
              </span>
              <input
                type="text"
                value={answers[`lq${questionNumber}`] || ""}
                onChange={(e) => handleAnswerChange(`lq${questionNumber}`, e.target.value)}
                className="border-b-2 border-dotted border-gray-400 focus:outline-none focus:border-gray-600 w-16 bg-transparent text-lg"
                aria-label={`Question ${questionNumber}`}
                maxLength={1}
                placeholder="A-F"
              />
              {inputErrors[`lq${questionNumber}`] && (
                <div className="text-red-500 text-xs ml-2">{inputErrors[`lq${questionNumber}`]}</div>
              )}
            </div>,
          )
          continue
        }

        currentQuestion = {
          number: questionMatch[1],
          text: questionMatch[2],
        }
      }
      // Check if this is an option line (starts with A, B, or C)
      else if (currentQuestion && line.match(/^[A-C]\s/)) {
        const optionMatch = line.match(/^([A-C])\s(.+)/)
        if (optionMatch) {
          options.push({
            letter: optionMatch[1],
            text: optionMatch[2],
          })
        }
      }
      // If this is a section header or other text, add it directly
      else if (line && !line.match(/^[A-C]\s/)) {
        // If we have a previous question, add it to the result
        if (currentQuestion) {
          result.push(
            <div key={`question-${currentQuestion.number}`} className="mb-6">
              <p className="mb-3 text-lg font-medium">
                {currentQuestion.number} {currentQuestion.text}
              </p>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <label
                    key={`option-${index}`}
                    className={`flex items-start ml-4 mb-1 p-3 rounded cursor-pointer text-lg ${
                      answers[`lq${currentQuestion.number}`] === option.letter
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    htmlFor={`lq${currentQuestion.number}-${option.letter}`}
                  >
                    <input
                      type="radio"
                      id={`lq${currentQuestion.number}-${option.letter}`}
                      name={`lq${currentQuestion.number}`}
                      value={option.letter}
                      checked={answers[`lq${currentQuestion.number}`] === option.letter}
                      onChange={() => handleAnswerChange(`lq${currentQuestion.number}`, option.letter)}
                      className="mr-3 mt-1"
                    />
                    <span>
                      {option.letter} {option.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>,
          )
          currentQuestion = null
          options = []
        }

        // Check if this is the map section
        if (line.includes("Albany Fishing Competition Map")) {
          result.push(
            <div key="map-section" className="my-6">
              <p className="mb-3 text-lg">{line}</p>
              <div className="flex justify-center my-6">
                <Image
                  src="/images/listening/map.png"
                  alt="Albany Fishing Competition Map"
                  width={600}
                  height={420}
                  className="border border-gray-300 rounded"
                />
              </div>
            </div>,
          )
        }
        // Check if this is the features box for questions 27-30
        else if (line.includes("Interesting features")) {
          result.push(
            <div key="features-box" className="my-6 p-5 border border-gray-300 rounded bg-gray-50 dark:bg-gray-800">
              <p className="font-bold mb-3 text-lg">{line}</p>
              <div className="grid grid-cols-2 gap-3 text-lg">
                <div>A the realistic colours</div>
                <div>B the sense of space</div>
                <div>C the unusual interpretation of the theme</div>
                <div>D the painting technique</div>
                <div>E the variety of materials use</div>
                <div>F the use of light and shade</div>
              </div>
            </div>,
          )
        } else if (line === "Exhibitions") {
          result.push(
            <p key="exhibitions-header" className="font-bold mt-5 mb-3 text-lg">
              {line}
            </p>,
          )
        } else {
          result.push(
            <p key={`text-${i}`} className="mb-3 text-lg">
              {line}
            </p>,
          )
        }
      }
    }

    // Add the last question if there is one
    if (currentQuestion) {
      result.push(
        <div key={`question-${currentQuestion.number}`} className="mb-6">
          <p className="mb-3 text-lg font-medium">
            {currentQuestion.number} {currentQuestion.text}
          </p>
          <div className="space-y-3">
            {options.map((option, index) => (
              <label
                key={`option-${index}`}
                className={`flex items-start ml-4 mb-1 p-3 rounded cursor-pointer text-lg ${
                  answers[`lq${currentQuestion.number}`] === option.letter
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                htmlFor={`lq${currentQuestion.number}-${option.letter}`}
              >
                <input
                  type="radio"
                  id={`lq${currentQuestion.number}-${option.letter}`}
                  name={`lq${currentQuestion.number}`}
                  value={option.letter}
                  checked={answers[`lq${currentQuestion.number}`] === option.letter}
                  onChange={() => handleAnswerChange(`lq${currentQuestion.number}`, option.letter)}
                  className="mr-3 mt-1"
                />
                <span>
                  {option.letter} {option.text}
                </span>
              </label>
            ))}
          </div>
        </div>,
      )
    }

    return result
  }

  // Function to render fill-in-the-blank questions in a more readable format
  const renderFillInTheBlank = (content: string) => {
    // First, let's handle the special case for Section 1 and Section 4 which have numbered blanks
    if (currentSection === 1 || currentSection === 4) {
      // Split content by lines for better processing
      const lines = content.split("\n")
      const result = []

      // Process each line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Skip empty lines
        if (!line.trim()) {
          result.push(<br key={`br-${i}`} />)
          continue
        }

        // Check if the line contains a question [number]
        if (line.includes("[") && line.includes("]")) {
          // Split the line by the question markers
          const parts = line.split(/(\[\d+\])/g)

          // Create a line with input fields
          const lineWithInputs = (
            <div key={`line-${i}`} className="mb-3 flex flex-wrap items-center">
              {parts.map((part, partIndex) => {
                const match = part.match(/\[(\d+)\]/)
                if (match) {
                  const questionNumber = match[1]
                  const questionId = `lq${questionNumber}`

                  return (
                    <span key={`input-${partIndex}`} className="inline-block mx-1">
                      <input
                        type="text"
                        value={answers[questionId] || ""}
                        onChange={(e) => handleAnswerChange(questionId, e.target.value)}
                        className="border-b-2 border-dotted border-gray-400 focus:outline-none focus:border-gray-600 min-w-[120px] bg-transparent text-lg"
                        aria-label={`Question ${questionNumber}`}
                      />
                      {inputErrors[questionId] && (
                        <div className="text-red-500 text-xs mt-1">{inputErrors[questionId]}</div>
                      )}
                    </span>
                  )
                }
                return <span key={`text-${partIndex}`}>{part}</span>
              })}
            </div>
          )

          result.push(lineWithInputs)
        } else {
          // Regular text line
          result.push(
            <p key={`text-line-${i}`} className="mb-3 text-lg">
              {line}
            </p>,
          )
        }
      }

      return result
    }

    // For other sections, use the original implementation
    const lines = content.split("\n")
    const result = []

    // Extract the title/context part (first few lines)
    const titlePart = []
    let i = 0
    while (i < lines.length && !lines[i].includes("[")) {
      if (lines[i].trim()) {
        titlePart.push(lines[i])
      }
      i++
    }

    if (titlePart.length > 0) {
      result.push(
        <div key="context" className="mb-6 text-lg">
          {titlePart.map((line, idx) => (
            <p key={`title-${idx}`} className="mb-2">
              {line}
            </p>
          ))}
        </div>,
      )
    }

    // Process the remaining lines with questions
    let currentQuestion = ""
    let questionNumber = 0

    for (; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const match = line.match(/\[(\d+)\]/)
      if (match) {
        // If we have a previous question, add it to the result
        if (currentQuestion) {
          result.push(
            <div key={`question-${questionNumber}`} className="mb-4 flex flex-wrap items-baseline">
              <div className="mr-2 text-lg">{currentQuestion}</div>
              <input
                type="text"
                value={answers[`lq${questionNumber}`] || ""}
                onChange={(e) => handleAnswerChange(`lq${questionNumber}`, e.target.value)}
                className="border-b-2 border-dotted border-gray-400 focus:outline-none focus:border-gray-600 min-w-[150px] bg-transparent mx-1 text-lg"
                aria-label={`Question ${questionNumber}`}
              />
              {inputErrors[`lq${questionNumber}`] && (
                <div className="text-red-500 text-xs ml-2 w-full mt-1">{inputErrors[`lq${questionNumber}`]}</div>
              )}
            </div>,
          )
        }

        questionNumber = Number.parseInt(match[1])
        // Extract the text before the question number
        const parts = line.split(/\[(\d+)\]/)
        currentQuestion = parts[0].trim()
      } else {
        // Continue building the current question
        currentQuestion += " " + line
      }
    }

    // Add the last question if there is one
    if (currentQuestion && questionNumber > 0) {
      result.push(
        <div key={`question-${questionNumber}`} className="mb-4 flex flex-wrap items-baseline">
          <div className="mr-2 text-lg">{currentQuestion}</div>
          <input
            type="text"
            value={answers[`lq${questionNumber}`] || ""}
            onChange={(e) => handleAnswerChange(`lq${questionNumber}`, e.target.value)}
            className="border-b-2 border-dotted border-gray-400 focus:outline-none focus:border-gray-600 min-w-[150px] bg-transparent mx-1 text-lg"
            aria-label={`Question ${questionNumber}`}
          />
          {inputErrors[`lq${questionNumber}`] && (
            <div className="text-red-500 text-xs ml-2 w-full mt-1">{inputErrors[`lq${questionNumber}`]}</div>
          )}
        </div>,
      )
    }

    return result
  }

  // Fix the renderMultipleChoice function to ensure radio buttons are clickable
  const renderMultipleChoiceFixed = (content: string) => {
    const lines = content.split("\n")
    const result = []

    let currentQuestion = null
    let options = []
    let inMapSection = false
    let inBoxSection = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Check if we're entering the map section
      if (line.includes("Questions 15-20")) {
        inMapSection = true
      }

      // Check if we're entering the box section (questions 27-30)
      if (line.includes("Questions 27-30")) {
        inBoxSection = true
      }

      // Check if this is a question line (starts with a number)
      const questionMatch = line.match(/^(\d+)\s(.+)/)
      if (questionMatch) {
        const questionNumber = Number.parseInt(questionMatch[1])

        // If we have a previous question, add it to the result
        if (currentQuestion) {
          result.push(
            <div key={`question-${currentQuestion.number}`} className="mb-6">
              <p className="mb-3 text-lg font-medium">
                {currentQuestion.number} {currentQuestion.text}
              </p>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={`option-${index}`}
                    className={`flex items-start ml-4 mb-1 p-3 rounded cursor-pointer text-lg ${
                      answers[`lq${currentQuestion.number}`] === option.letter
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleAnswerChange(`lq${currentQuestion.number}`, option.letter)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[`lq${currentQuestion.number}`] === option.letter
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400"
                        }`}
                      >
                        {answers[`lq${currentQuestion.number}`] === option.letter && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="flex-1">
                        {option.letter} {option.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>,
          )
          options = []
        }

        // Handle map questions (15-20)
        if (inMapSection && currentSectionData.mapQuestions?.includes(questionNumber)) {
          result.push(
            <div key={`map-question-${questionNumber}`} className="mb-4 flex items-center">
              <span className="mr-3 text-lg">
                {questionNumber} {questionMatch[2]}
              </span>
              <input
                type="text"
                value={answers[`lq${questionNumber}`] || ""}
                onChange={(e) => handleAnswerChange(`lq${questionNumber}`, e.target.value)}
                className="border-b-2 border-dotted border-gray-400 focus:outline-none focus:border-gray-600 w-16 bg-transparent text-lg"
                aria-label={`Question ${questionNumber}`}
                maxLength={1}
                placeholder="A-I"
              />
              {inputErrors[`lq${questionNumber}`] && (
                <div className="text-red-500 text-xs ml-2">{inputErrors[`lq${questionNumber}`]}</div>
              )}
            </div>,
          )
          continue
        }

        // Handle box questions (27-30)
        if (inBoxSection && currentSectionData.boxQuestions?.includes(questionNumber)) {
          result.push(
            <div key={`box-question-${questionNumber}`} className="mb-4 flex items-center">
              <span className="mr-3 text-lg">
                {questionNumber} {questionMatch[2]}
              </span>
              <input
                type="text"
                value={answers[`lq${questionNumber}`] || ""}
                onChange={(e) => handleAnswerChange(`lq${questionNumber}`, e.target.value)}
                className="border-b-2 border-dotted border-gray-400 focus:outline-none focus:border-gray-600 w-16 bg-transparent text-lg"
                aria-label={`Question ${questionNumber}`}
                maxLength={1}
                placeholder="A-F"
              />
              {inputErrors[`lq${questionNumber}`] && (
                <div className="text-red-500 text-xs ml-2">{inputErrors[`lq${questionNumber}`]}</div>
              )}
            </div>,
          )
          continue
        }

        currentQuestion = {
          number: questionMatch[1],
          text: questionMatch[2],
        }
      }
      // Check if this is an option line (starts with A, B, or C)
      else if (currentQuestion && line.match(/^[A-C]\s/)) {
        const optionMatch = line.match(/^([A-C])\s(.+)/)
        if (optionMatch) {
          options.push({
            letter: optionMatch[1],
            text: optionMatch[2],
          })
        }
      }
      // If this is a section header or other text, add it directly
      else if (line && !line.match(/^[A-C]\s/)) {
        // If we have a previous question, add it to the result
        if (currentQuestion) {
          result.push(
            <div key={`question-${currentQuestion.number}`} className="mb-6">
              <p className="mb-3 text-lg font-medium">
                {currentQuestion.number} {currentQuestion.text}
              </p>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={`option-${index}`}
                    className={`flex items-start ml-4 mb-1 p-3 rounded cursor-pointer text-lg ${
                      answers[`lq${currentQuestion.number}`] === option.letter
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleAnswerChange(`lq${currentQuestion.number}`, option.letter)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[`lq${currentQuestion.number}`] === option.letter
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400"
                        }`}
                      >
                        {answers[`lq${currentQuestion.number}`] === option.letter && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="flex-1">
                        {option.letter} {option.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>,
          )
          currentQuestion = null
          options = []
        }

        // Check if this is the map section
        if (line.includes("Albany Fishing Competition Map")) {
          result.push(
            <div key="map-section" className="my-6">
              <p className="mb-3 text-lg">{line}</p>
              <div className="flex justify-center my-6">
                <Image
                  src="/images/listening/map.png"
                  alt="Albany Fishing Competition Map"
                  width={600}
                  height={420}
                  className="border border-gray-300 rounded"
                />
              </div>
            </div>,
          )
        }
        // Check if this is the features box for questions 27-30
        else if (line.includes("Interesting features")) {
          result.push(
            <div key="features-box" className="my-6 p-5 border border-gray-300 rounded bg-gray-50 dark:bg-gray-800">
              <p className="font-bold mb-3 text-lg">{line}</p>
              <div className="grid grid-cols-2 gap-3 text-lg">
                <div>A the realistic colours</div>
                <div>B the sense of space</div>
                <div>C the unusual interpretation of the theme</div>
                <div>D the painting technique</div>
                <div>E the variety of materials use</div>
                <div>F the use of light and shade</div>
              </div>
            </div>,
          )
        } else if (line === "Exhibitions") {
          result.push(
            <p key="exhibitions-header" className="font-bold mt-5 mb-3 text-lg">
              {line}
            </p>,
          )
        } else {
          result.push(
            <p key={`text-${i}`} className="mb-3 text-lg">
              {line}
            </p>,
          )
        }
      }
    }

    // Add the last question if there is one
    if (currentQuestion) {
      result.push(
        <div key={`question-${currentQuestion.number}`} className="mb-6">
          <p className="mb-3 text-lg font-medium">
            {currentQuestion.number} {currentQuestion.text}
          </p>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={`option-${index}`}
                className={`flex items-start ml-4 mb-1 p-3 rounded cursor-pointer text-lg ${
                  answers[`lq${currentQuestion.number}`] === option.letter
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleAnswerChange(`lq${currentQuestion.number}`, option.letter)}
              >
                <div className="flex items-center w-full">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[`lq${currentQuestion.number}`] === option.letter
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-400"
                    }`}
                  >
                    {answers[`lq${currentQuestion.number}`] === option.letter && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="flex-1">
                    {option.letter} {option.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return result
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-300 pb-2 mb-2 px-4 pt-4">
        <div className="text-lg font-bold">FULL MOCK EXAM</div>
        <div className="text-lg font-bold">Time: {formatTime(timeRemaining)}</div>
        <div className="text-lg font-bold">DREAM ZONE LANGUAGE SCHOOL</div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/audio/listening-test.mp3"
        className="hidden"
        onLoadedData={() => setAudioLoaded(true)}
      />

      <div className="mb-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mx-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-grow">
          <Volume2 className="h-5 w-5" />
          <Slider
            value={[volume]}
            onValueChange={(values) => setVolume(values[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
            disabled={!audioLoaded}
          />
          <span className="text-sm w-8">{volume}%</span>
        </div>
      </div>

      <TextAnnotationTools
        onCircleClick={handleCircleClick}
        onUndoClick={handleUndoAnnotation}
        activeMode={currentTool}
      />

      <Card className="mx-4 flex-grow mb-4 h-[calc(100vh-220px)]">
        <CardContent className="p-6 h-full overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 sticky top-0 bg-white dark:bg-gray-950 py-2 z-10">
            {currentSectionData.title}
          </h2>
          <div className="whitespace-pre-line mb-6 text-lg">{currentSectionData.instructions}</div>

          <div className="mb-6 font-medium">
            {currentSection === 1 || currentSection === 4 ? (
              <TextAnnotator
                content=""
                annotations={annotations}
                onAnnotation={handleAnnotation}
                currentTool={currentTool}
              >
                {renderFillInTheBlank(currentSectionData.content)}
              </TextAnnotator>
            ) : (
              <TextAnnotator
                content=""
                annotations={annotations}
                onAnnotation={handleAnnotation}
                currentTool={currentTool}
              >
                {renderMultipleChoiceFixed(currentSectionData.content)}
              </TextAnnotator>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mx-4 my-4">
        {currentSection > 1 && <Button onClick={handlePreviousSection}>Previous Section</Button>}
        {currentSection < sections.length ? (
          <Button onClick={handleNextSection} className="ml-auto">
            Next Section
          </Button>
        ) : (
          <Button onClick={() => router.push("/reading")} className="ml-auto">
            Go to Reading
          </Button>
        )}
      </div>
    </div>
  )
}
