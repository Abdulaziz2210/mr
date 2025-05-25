"use client"

import { useState, useRef, type ReactNode } from "react"

interface Annotation {
  type: string
  startIndex: number
  endIndex: number
  text: string
}

interface TextAnnotatorProps {
  content: string
  annotations: Annotation[]
  onAnnotation: (annotation: Annotation) => void
  currentTool: string | null
  children?: ReactNode
}

export function TextAnnotator({ content, annotations, onAnnotation, currentTool, children }: TextAnnotatorProps) {
  const [selectedText, setSelectedText] = useState("")
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const handleMouseUp = () => {
    if (!currentTool) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const text = range.toString().trim()

    if (!text) return

    // Get the text content of the container
    const containerText = textRef.current?.textContent || ""

    // Find the start and end indices of the selected text in the container
    const startIndex = containerText.indexOf(text)
    const endIndex = startIndex + text.length

    if (startIndex === -1) return

    // Create annotation
    const annotation = {
      type: currentTool,
      startIndex,
      endIndex,
      text,
    }

    // Add annotation
    onAnnotation(annotation)

    // Clear selection
    selection.removeAllRanges()
    setSelectedText("")
    setSelectionRange(null)
  }

  // Render the text with annotations
  const renderAnnotatedText = () => {
    if (!content) return null

    // Sort annotations by start index
    const sortedAnnotations = [...annotations].sort((a, b) => a.startIndex - b.startIndex)

    // Create an array of text segments with annotations
    const segments = []
    let lastIndex = 0

    for (const annotation of sortedAnnotations) {
      // Add text before annotation
      if (annotation.startIndex > lastIndex) {
        segments.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex, annotation.startIndex)}</span>)
      }

      // Add annotated text
      const annotatedText = content.substring(annotation.startIndex, annotation.endIndex)
      if (annotation.type === "circle") {
        segments.push(
          <span key={`annotation-${annotation.startIndex}`} className="relative inline">
            <span className="relative z-10">{annotatedText}</span>
            <span className="absolute inset-0 border-2 border-red-500 rounded-full -m-0.5 z-0"></span>
          </span>,
        )
      }

      lastIndex = annotation.endIndex
    }

    // Add remaining text
    if (lastIndex < content.length) {
      segments.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>)
    }

    return segments
  }

  return (
    <div
      ref={textRef}
      className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 select-text cursor-text"
      onMouseUp={handleMouseUp}
    >
      {children || renderAnnotatedText()}
    </div>
  )
}
