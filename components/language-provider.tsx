"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import "../lib/i18n"

type LanguageContextType = {
  language: string
  changeLanguage: (lang: string) => void
  t: (key: string, options?: any) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n, t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
    localStorage.setItem("i18nextLng", lang)
  }

  useEffect(() => {
    const savedLang = localStorage.getItem("i18nextLng")
    if (savedLang) {
      changeLanguage(savedLang)
    }
    setMounted(true)
  }, [])

  // Don't render children until after client-side hydration
  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider
      value={{
        language: i18n.language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
