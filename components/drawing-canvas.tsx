"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eraser, Pencil, Trash2 } from "lucide-react"

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil")
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(2)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 })
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    // Get context
    const context = canvas.getContext("2d")
    if (!context) return

    // Configure context
    context.lineCap = "round"
    context.lineJoin = "round"
    context.strokeStyle = color
    context.lineWidth = lineWidth

    // Store context in ref
    contextRef.current = context

    // Load saved drawing if exists
    const savedDrawing = localStorage.getItem("writingTask1Drawing")
    if (savedDrawing) {
      const img = new Image()
      img.onload = () => {
        context.drawImage(img, 0, 0)
      }
      img.src = savedDrawing
    }
  }, [canvasSize, color, lineWidth])

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !contextRef.current) return

    setIsDrawing(true)

    const context = contextRef.current
    context.beginPath()

    // Get coordinates
    let x, y
    if ("touches" in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX
      y = e.nativeEvent.offsetY
    }

    context.moveTo(x, y)
  }

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return

    // Prevent scrolling on touch devices
    if ("touches" in e) {
      e.preventDefault()
    }

    const context = contextRef.current
    const canvas = canvasRef.current

    // Get coordinates
    let x, y
    if ("touches" in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX
      y = e.nativeEvent.offsetY
    }

    // Set style based on tool
    if (tool === "pencil") {
      context.strokeStyle = color
    } else if (tool === "eraser") {
      context.strokeStyle = "#FFFFFF" // White for eraser
    }

    context.lineTo(x, y)
    context.stroke()
  }

  // Stop drawing
  const stopDrawing = () => {
    if (!isDrawing || !contextRef.current) return

    contextRef.current.closePath()
    setIsDrawing(false)

    // Save drawing to localStorage
    if (canvasRef.current) {
      try {
        const dataURL = canvasRef.current.toDataURL()
        localStorage.setItem("writingTask1Drawing", dataURL)
      } catch (error) {
        console.error("Error saving drawing:", error)
      }
    }
  }

  // Clear canvas
  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return

    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    localStorage.removeItem("writingTask1Drawing")
  }

  return (
    <div className="border rounded-md p-2 bg-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={tool === "pencil" ? "default" : "outline"}
            onClick={() => setTool("pencil")}
            className="h-8 px-2"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Pencil
          </Button>
          <Button
            size="sm"
            variant={tool === "eraser" ? "default" : "outline"}
            onClick={() => setTool("eraser")}
            className="h-8 px-2"
          >
            <Eraser className="h-4 w-4 mr-1" />
            Eraser
          </Button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 cursor-pointer"
            disabled={tool === "eraser"}
          />
          <select
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="h-8 px-2 border rounded"
          >
            <option value="1">Thin</option>
            <option value="2">Medium</option>
            <option value="4">Thick</option>
          </select>
        </div>
        <Button size="sm" variant="destructive" onClick={clearCanvas} className="h-8 px-2">
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="border rounded w-full touch-none"
        style={{ height: `${canvasSize.height}px` }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  )
}
