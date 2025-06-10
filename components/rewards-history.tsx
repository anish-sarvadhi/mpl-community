"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Coins, Search, Filter, Calendar, ArrowDown, ArrowUp } from "lucide-react"
import { useLanguage } from "./language-provider"
import { MotionContainer, MotionItem, MotionDiv } from "./ui/motion"
import { AnimatePresence, motion } from "framer-motion"
import { useFirstVisit } from "@/lib/use-first-visit"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRewards } from "./rewards-provider"

export default function RewardsHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "amount">("newest")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { t } = useLanguage()
  const isFirstVisit = useFirstVisit("rewardsPageAnimated")
  const { totalRewards, rewardHistory } = useRewards()

  const filteredRewards = rewardHistory
    .filter((reward) => {
      if (searchTerm === "") return true
      return reward.source.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB
      } else {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount
      }
    })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight gradient-text">Rewards History</h2>
        <p className="text-muted-foreground">Track your earned rewards and claim your tokens</p>
      </MotionDiv>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MotionDiv
          initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl p-6 border border-amber-500/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-lg font-medium">Total Rewards</h3>
          </div>
          <div className="text-3xl font-bold text-amber-500 mb-1">{totalRewards}</div>
          <p className="text-sm text-muted-foreground">tokens earned</p>
        </MotionDiv>

        <MotionDiv
          initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Completed Surveys</h3>
          </div>
          <div className="text-3xl font-bold text-primary mb-1">{rewardHistory.length}</div>
          <p className="text-sm text-muted-foreground">surveys completed</p>
        </MotionDiv>

        <MotionDiv
          initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-medium">Available to Claim</h3>
          </div>
          <div className="text-3xl font-bold text-accent mb-1">{totalRewards}</div>
          <p className="text-sm text-muted-foreground">tokens available</p>
        </MotionDiv>
      </div>

      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search rewards..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="w-4 h-4" />
                <span>{sortBy === "newest" ? "Date" : "Amount"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("amount")}>Amount</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="gap-1" onClick={toggleSortOrder}>
            {sortOrder === "desc" ? (
              <>
                <ArrowDown className="w-4 h-4" />
                <span>Descending</span>
              </>
            ) : (
              <>
                <ArrowUp className="w-4 h-4" />
                <span>Ascending</span>
              </>
            )}
          </Button>
        </div>
      </MotionDiv>

      <AnimatePresence mode="wait">
        <motion.div
          key={sortBy + sortOrder}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6 space-y-6"
        >
          <MotionContainer animate={isFirstVisit} className="space-y-4">
            {filteredRewards.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No rewards found</h3>
                <p className="text-muted-foreground">Complete surveys to earn rewards</p>
              </div>
            ) : (
              filteredRewards.map((reward, index) => (
                <MotionItem key={reward.id} delay={index * 0.05} animate={isFirstVisit}>
                  <div className="border rounded-lg p-4 hover:bg-secondary/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src="/abstract-mpl-representation.png" alt="MPL" />
                        <AvatarFallback>MPL</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{reward.source}</h3>
                          <Badge className="bg-amber-500/10 text-amber-500 border-none">
                            <span className="flex items-center gap-1.5">
                              <Coins className="w-3.5 h-3.5" />
                              <span>{reward.amount} tokens</span>
                            </span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(reward.date).toLocaleDateString()} •{" "}
                          {new Date(reward.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionItem>
              ))
            )}
          </MotionContainer>
        </motion.div>
      </AnimatePresence>

      {totalRewards > 0 && (
        <MotionDiv
          initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 gap-2"
          >
            <Coins className="w-5 h-5" />
            <span>Claim {totalRewards} Tokens</span>
          </Button>
        </MotionDiv>
      )}
    </div>
  )
}
