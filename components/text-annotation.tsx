"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Circle, Underline } from "lucide-react"

export default function TextAnnotation({ children, isWritingSection = false }) {
  const [mode, setMode] = useState<"circle" | "underline" | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTextSelection = () => {
    if (!mode || !isWritingSection) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return

    const range = selection.getRangeAt(0)
    const span = document.createElement("span")

    if (mode === "circle") {
      span.style.border = "2px solid blue"
      span.style.borderRadius = "50%"
      span.style.padding = "0 2px"
    } else {
      span.style.textDecorationColor = "blue"
      span.style.textDecorationThickness = "2px"
    }

    const contents = range.extractContents()
    span.appendChild(contents)
    range.insertNode(span)

    selection.removeAllRanges()
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("mouseup", handleTextSelection)
    return () => container.removeEventListener("mouseup", handleTextSelection)
  }, [mode, isWritingSection])

  if (!isWritingSection) return <div>{children}</div>

  return (
    <div className="relative">
      <div ref={containerRef} className="mb-4">
        {children}
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-50">
        <Button
          variant={mode === "circle" ? "default" : "outline"}
          size="icon"
          onClick={() => setMode(mode === "circle" ? null : "circle")}
          title="Circle Text"
        >
          <Circle className="h-4 w-4" />
        </Button>
        <Button
          variant={mode === "underline" ? "default" : "outline"}
          size="icon"
          onClick={() => setMode(mode === "underline" ? null : "underline")}
          title="Underline Text"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
