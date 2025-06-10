"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguage } from "./language-provider"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MotionButton } from "./ui/motion"

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const languages = [
    { code: "en", name: "English" },
    { code: "pt-BR", name: "Português (Brasil)" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)?.name || "English"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MotionButton
          variant="ghost"
          size="sm"
          className="gap-1 h-9 px-3 rounded-full flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage}</span>
        </MotionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <motion.div key={lang.code} whileHover={{ x: 5 }}>
            <DropdownMenuItem
              onClick={() => changeLanguage(lang.code)}
              className={language === lang.code ? "bg-accent text-accent-foreground" : ""}
            >
              {lang.name}
            </DropdownMenuItem>
          </motion.div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
