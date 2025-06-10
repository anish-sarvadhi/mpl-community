"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Gift, Gamepad2, Zap, Search, Filter } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import inboxMessages from "@/data/inbox.json"
import { useLanguage } from "./language-provider"
import { MotionContainer, MotionItem, MotionDiv } from "./ui/motion"
import { AnimatePresence, motion } from "framer-motion"
import { useFirstVisit } from "@/lib/use-first-visit"

type MessageType = "important" | "product" | "game" | "feature"

export default function Inbox() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [inViewStates, setInViewStates] = useState<{ [key: string]: boolean }>({})
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const isFirstVisit = useFirstVisit("inboxPageAnimated")

  const filteredMessages = inboxMessages
    .filter(
      (message) =>
        (activeTab === "all" || message.type === activeTab) &&
        (searchTerm === "" ||
          message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight gradient-text">{t("inbox.title")}</h2>
        <p className="text-muted-foreground">{t("inbox.subtitle")}</p>
      </MotionDiv>

      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative w-full md:w-64 mb-4"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={t("inbox.searchPlaceholder")}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </MotionDiv>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <MotionDiv
          initial={isFirstVisit ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t("inbox.all")}
            </TabsTrigger>
            <TabsTrigger
              value="important"
              className="data-[state=active]:bg-[hsl(var(--important-color))] data-[state=active]:text-white"
            >
              {t("inbox.important")}
            </TabsTrigger>
            <TabsTrigger
              value="product"
              className="data-[state=active]:bg-[hsl(var(--product-color))] data-[state=active]:text-white"
            >
              {t("inbox.updates")}
            </TabsTrigger>
            <TabsTrigger
              value="game"
              className="data-[state=active]:bg-[hsl(var(--game-color))] data-[state=active]:text-white"
            >
              {t("inbox.games")}
            </TabsTrigger>
            <TabsTrigger
              value="feature"
              className="data-[state=active]:bg-[hsl(var(--feature-color))] data-[state=active]:text-white"
            >
              {t("inbox.features")}
            </TabsTrigger>
          </TabsList>
        </MotionDiv>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-6"
          >
            {renderMessages(filteredMessages)}
          </motion.div>
        </AnimatePresence>
      </Tabs>
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
          <h3 className="text-lg font-medium mb-2">{t("inbox.noMessages")}</h3>
          <p className="text-muted-foreground">{t("inbox.tryChanging")}</p>
        </MotionDiv>
      )
    }

    return (
      <MotionContainer animate={isFirstVisit}>
        {messages.map((message, index) => (
          <MotionItem key={message.id} delay={index * 0.08} animate={isFirstVisit}>
            <Card className={`overflow-hidden transition-all duration-500 category-${message.type}`}>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="/abstract-mpl-representation.png" alt="MPL" />
                    <AvatarFallback>MPL</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold">MPL Team</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleDateString()} •{" "}
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <Badge className={`ml-auto px-3 py-1`}>
                    <span className="flex items-center gap-1.5">
                      {getIcon(message.type as MessageType)}
                      {getTypeLabel(message.type as MessageType)}
                    </span>
                  </Badge>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{message.title}</h3>
                  <p className="text-muted-foreground">{message.message}</p>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="ghost" size="sm">
                    {t("inbox.markAsRead")}
                  </Button>
                </div>
              </div>
            </Card>
          </MotionItem>
        ))}
      </MotionContainer>
    )
  }
}
