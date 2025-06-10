"use client"

import { useState, useEffect } from "react"

export function useFirstVisit(key = "hasVisited"): boolean {
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  useEffect(() => {
    const hasVisited = localStorage.getItem(key)
    if (!hasVisited) {
      localStorage.setItem(key, "true")
      setIsFirstVisit(true)
    } else {
      setIsFirstVisit(false)
    }
  }, [key])

  return isFirstVisit
}
