"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface NavigationButtonsProps {
  onPrevious: () => void
  onNext: () => void
  previousLabel?: string
  nextLabel?: string
  showPrevious?: boolean
  showNext?: boolean
}

export function NavigationButtons({
  onPrevious,
  onNext,
  previousLabel = "Previous",
  nextLabel = "Next",
  showPrevious = true,
  showNext = true,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between">
      {showPrevious ? (
        <Button onClick={onPrevious} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {previousLabel}
        </Button>
      ) : (
        <div></div>
      )}
      {showNext ? (
        <Button onClick={onNext}>
          {nextLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default NavigationButtons
