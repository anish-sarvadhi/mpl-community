"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Gift, Gamepad2, Zap, Search, Filter, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import inboxMessages from "@/data/inbox.json"
import { useLanguage } from "./language-provider"
import { MotionContainer, MotionItem, MotionDiv } from "./ui/motion"
import { AnimatePresence, motion } from "framer-motion"
import { useFirstVisit } from "@/lib/use-first-visit"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type MessageType = "important" | "product" | "game" | "feature"

export default function Announcement() {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const isFirstVisit = useFirstVisit("announcementPageAnimated")
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest")

  const filteredMessages = inboxMessages
    .filter(
      (message) =>
        (activeFilter === "all" || message.type === activeFilter) &&
        (searchTerm === "" ||
          message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortBy === "latest" ? dateB - dateA : dateA - dateB
    })

  const getIcon = (type: MessageType) => {
    switch (type) {
      case "important":
        return <Bell className="w-5 h-5" />
      case "product":
        return <Zap className="w-5 h-5" />
      case "game":
        return <Gamepad2 className="w-5 h-5" />
      case "feature":
        return <Gift className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: MessageType) => {
    switch (type) {
      case "important":
        return t("inbox.important")
      case "product":
        return t("inbox.updates")
      case "game":
        return t("inbox.games")
      case "feature":
        return t("inbox.features")
    }
  }

  const getTypeColor = (type: MessageType) => {
    switch (type) {
      case "important":
        return "bg-[hsla(var(--important-color),0.15)] text-[hsl(var(--important-color))]"
      case "product":
        return "bg-[hsla(var(--product-color),0.15)] text-[hsl(var(--product-color))]"
      case "game":
        return "bg-[hsla(var(--game-color),0.15)] text-[hsl(var(--game-color))]"
      case "feature":
        return "bg-[hsla(var(--feature-color),0.15)] text-[hsl(var(--feature-color))]"
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight gradient-text">Announcements</h2>
        <p className="text-muted-foreground">Stay updated with the latest news and announcements</p>
      </MotionDiv>

      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search announcements..."
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
                <span>
                  {activeFilter === "all"
                    ? "All Types"
                    : activeFilter === "important"
                      ? "Important"
                      : activeFilter === "product"
                        ? "Updates"
                        : activeFilter === "game"
                          ? "Games"
                          : "Features"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveFilter("all")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("important")}>Important</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("product")}>Updates</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("game")}>Games</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("feature")}>Features</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="w-4 h-4" />
                <span>{sortBy === "latest" ? "Latest First" : "Oldest First"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("latest")}>Latest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest First</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MotionDiv>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter + sortBy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6 space-y-6"
        >
          {renderMessages(filteredMessages)}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  function renderMessages(messages: typeof inboxMessages) {
    if (messages.length === 0) {
      return (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No announcements found</h3>
          <p className="text-muted-foreground">Try changing your search or filter criteria</p>
        </MotionDiv>
      )
    }

    return (
      <MotionContainer animate={isFirstVisit} className="space-y-6">
        {messages.map((message, index) => (
          <MotionItem key={message.id} delay={index * 0.08} animate={isFirstVisit}>
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border mt-1">
                <AvatarImage src="/abstract-mpl-representation.png" alt="MPL" />
                <AvatarFallback>MPL</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">MPL Team</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleDateString()} •{" "}
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <Badge className={`${getTypeColor(message.type as MessageType)} border-none`}>
                    <span className="flex items-center gap-1.5">
                      {getIcon(message.type as MessageType)}
                      <span className="hidden sm:inline">{getTypeLabel(message.type as MessageType)}</span>
                    </span>
                  </Badge>
                </div>

                <div
                  className={`${getTypeColor(message.type as MessageType)} p-4 rounded-lg rounded-tl-none shadow-sm`}
                >
                  <h3 className="text-lg font-bold mb-2">{message.title}</h3>
                  <p className="text-sm">{message.message}</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark as Read
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </MotionItem>
        ))}
      </MotionContainer>
    )
  }
}
