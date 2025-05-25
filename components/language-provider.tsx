"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type Language = "en" | "ru" | "uz"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    select_language: "Select Language",
    english: "English",
    russian: "Russian",
    uzbek: "Uzbek",
    // Add more translations as needed
  },
  ru: {
    select_language: "Выберите язык",
    english: "Английский",
    russian: "Русский",
    uzbek: "Узбекский",
    // Add more translations as needed
  },
  uz: {
    select_language: "Tilni tanlang",
    english: "Ingliz",
    russian: "Rus",
    uzbek: "O'zbek",
    // Add more translations as needed
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    if (!translations[language]) return key
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}