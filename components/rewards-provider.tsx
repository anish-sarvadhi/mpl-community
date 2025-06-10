"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type RewardHistory = {
  id: string
  amount: number
  source: string
  date: string
}

type RewardsContextType = {
  totalRewards: number
  rewardHistory: RewardHistory[]
  addReward: (amount: number, source: string) => void
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined)

export function RewardsProvider({ children }: { children: ReactNode }) {
  const [totalRewards, setTotalRewards] = useState(0)
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load rewards from localStorage
    const savedTotalRewards = localStorage.getItem("mpl-total-rewards")
    const savedRewardHistory = localStorage.getItem("mpl-reward-history")

    if (savedTotalRewards) {
      setTotalRewards(Number.parseInt(savedTotalRewards))
    }

    if (savedRewardHistory) {
      setRewardHistory(JSON.parse(savedRewardHistory))
    }

    setMounted(true)
  }, [])

  useEffect(() => {
    // Save rewards to localStorage when they change
    if (mounted) {
      localStorage.setItem("mpl-total-rewards", totalRewards.toString())
      localStorage.setItem("mpl-reward-history", JSON.stringify(rewardHistory))
    }
  }, [totalRewards, rewardHistory, mounted])

  const addReward = (amount: number, source: string) => {
    setTotalRewards((prev) => prev + amount)

    const newReward: RewardHistory = {
      id: `reward-${Date.now()}`,
      amount,
      source,
      date: new Date().toISOString(),
    }

    setRewardHistory((prev) => [newReward, ...prev])
  }

  return (
    <RewardsContext.Provider
      value={{
        totalRewards,
        rewardHistory,
        addReward,
      }}
    >
      {children}
    </RewardsContext.Provider>
  )
}

export function useRewards() {
  const context = useContext(RewardsContext)
  if (context === undefined) {
    throw new Error("useRewards must be used within a RewardsProvider")
  }
  return context
}
