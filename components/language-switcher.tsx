import React from "react"
import { useLanguage } from "./language-provider" // adjust path if needed

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <label>{}</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
       className="hidden"

      >
      </select>
    </div>
  )
}
