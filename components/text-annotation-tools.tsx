"use client"

import { Button } from "@/components/ui/button"
import { Circle, Undo2 } from "lucide-react"

interface TextAnnotationToolsProps {
  onCircleClick: () => void
  onUndoClick: () => void
  activeMode: string | null
}

export function TextAnnotationTools({ onCircleClick, onUndoClick, activeMode }: TextAnnotationToolsProps) {
  return (
    <div className="flex items-center space-x-2 mb-2 mx-4 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <Button
        variant={activeMode === "circle" ? "default" : "outline"}
        size="sm"
        onClick={onCircleClick}
        className="flex items-center"
      >
        <Circle className="h-4 w-4 mr-1" />
        Circle
      </Button>
      <Button variant="outline" size="sm" onClick={onUndoClick} className="flex items-center">
        <Undo2 className="h-4 w-4 mr-1" />
        Undo
      </Button>
    </div>
  )
}
