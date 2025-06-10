"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Coins, Search, Filter, Calendar, ChevronDown, ChevronUp, Clock, CheckCircle2 } from "lucide-react"
import surveys from "@/data/surveys.json"
import { useLanguage } from "./language-provider"
import { MotionContainer, MotionItem, MotionDiv } from "./ui/motion"
import { AnimatePresence, motion } from "framer-motion"
import { useFirstVisit } from "@/lib/use-first-visit"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useRewards } from "./rewards-provider"

export default function SurveysRewards() {
  const [expandedSurvey, setExpandedSurvey] = useState<string | null>(null)
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "reward">("newest")
  const [showRewardAnimation, setShowRewardAnimation] = useState<{ show: boolean; amount: string }>({
    show: false,
    amount: "",
  })
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, Record<string, string>>>({})
  const [stableSurveys, setStableSurveys] = useState(surveys)
  const { t } = useLanguage()
  const isFirstVisit = useFirstVisit("surveysPageAnimated")
  const { addReward } = useRewards()
  const [rewardPopupTimer, setRewardPopupTimer] = useState<NodeJS.Timeout | null>(null)

  // Initialize stable surveys with due dates once on component mount
  useEffect(() => {
    const surveysWithDates = surveys.map((survey) => ({
      ...survey,
      dueDate: survey.dueDate || new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
    }))
    setStableSurveys(surveysWithDates)
  }, [])

  const filteredSurveys = stableSurveys
    .filter((survey) => {
      // Filter by search term
      if (
        searchTerm &&
        !survey.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !survey.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Filter by type
      if (activeFilter !== "all" && survey.type !== activeFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      } else {
        return Number.parseInt(b.reward) - Number.parseInt(a.reward)
      }
    })

  const toggleSurveyExpansion = (surveyId: string) => {
    setExpandedSurvey(expandedSurvey === surveyId ? null : surveyId)
  }

  const handleAnswerChange = (surveyId: string, questionIndex: string, answer: string) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [surveyId]: {
        ...(prev[surveyId] || {}),
        [questionIndex]: answer,
      },
    }))
  }

  const handleSubmitSurvey = (survey: any) => {
    // Check if all questions are answered
    const surveyResponses = surveyAnswers[survey.id] || {}
    const allQuestionsAnswered = survey.questions.every((_, index: number) => surveyResponses[index.toString()])

    if (allQuestionsAnswered) {
      // Show reward animation
      setShowRewardAnimation({ show: true, amount: survey.reward })

      // Mark survey as completed
      setCompletedSurveys((prev) => [...prev, survey.id])

      // Reset expanded state and answers
      setExpandedSurvey(null)
      setSurveyAnswers((prev) => ({
        ...prev,
        [survey.id]: {},
      }))

      // Add to total rewards
      addReward(Number.parseInt(survey.reward), survey.title)

      // Set timer to auto-close after 30 seconds
      if (rewardPopupTimer) {
        clearTimeout(rewardPopupTimer)
      }

      const timer = setTimeout(() => {
        setShowRewardAnimation({ show: false, amount: "" })
      }, 30000)

      setRewardPopupTimer(timer)
    } else {
      // Alert user to answer all questions
      alert("Please answer all questions before submitting.")
    }
  }

  const handleClaimReward = () => {
    if (rewardPopupTimer) {
      clearTimeout(rewardPopupTimer)
      setRewardPopupTimer(null)
    }
    setShowRewardAnimation({ show: false, amount: "" })
  }

  const getSurveyTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return t("surveys.multipleChoice")
      case "poll":
        return t("surveys.poll")
      case "short_answer":
        return t("surveys.shortAnswer")
      default:
        return type
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight gradient-text">{t("surveys.title")}</h2>
        <p className="text-muted-foreground">{t("surveys.subtitle")}</p>
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
            placeholder="Search surveys..."
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
                    : activeFilter === "multiple_choice"
                      ? "Multiple Choice"
                      : activeFilter === "poll"
                        ? "Polls"
                        : "Short Answer"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveFilter("all")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("multiple_choice")}>Multiple Choice</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("poll")}>Polls</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("short_answer")}>Short Answer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="w-4 h-4" />
                <span>{sortBy === "newest" ? "Due Date" : "Highest Reward"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>Due Date</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("reward")}>Highest Reward</DropdownMenuItem>
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
          <MotionContainer animate={isFirstVisit} className="space-y-6">
            {filteredSurveys.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No surveys found</h3>
                <p className="text-muted-foreground">Try changing your search or filter criteria</p>
              </div>
            ) : (
              filteredSurveys.map((survey, index) => {
                const isCompleted = completedSurveys.includes(survey.id)
                const isExpanded = expandedSurvey === survey.id
                const daysRemaining = getDaysRemaining(survey.dueDate)

                return (
                  <MotionItem key={survey.id} delay={index * 0.08} animate={isFirstVisit}>
                    <div
                      className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                        isCompleted ? "opacity-60" : ""
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10 border mt-1">
                            <AvatarImage src="/abstract-mpl-representation.png" alt="MPL" />
                            <AvatarFallback>MPL</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold">MPL Surveys</span>
                              <span className="text-xs text-muted-foreground">
                                Due: {new Date(survey.dueDate).toLocaleDateString()}
                              </span>
                              <Badge className={`bg-primary/10 text-primary hover:bg-primary/20 border-none`}>
                                <span className="flex items-center gap-1.5">{getSurveyTypeLabel(survey.type)}</span>
                              </Badge>
                              <Badge
                                className={`ml-auto bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-none`}
                              >
                                <span className="flex items-center gap-1.5">
                                  <Coins className="w-3.5 h-3.5" />
                                  <span>{survey.reward} tokens</span>
                                </span>
                              </Badge>
                            </div>

                            <div className="bg-secondary/20 p-4 rounded-lg rounded-tl-none shadow-sm">
                              <h3 className="text-lg font-bold mb-2">{survey.title}</h3>
                              <p className="text-sm mb-3">{survey.description}</p>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Due today"}
                                </span>
                                <span>
                                  {survey.questions.length}{" "}
                                  {survey.questions.length > 1 ? t("surveys.questions") : t("surveys.question")}
                                </span>
                              </div>
                            </div>

                            {!isCompleted && (
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => toggleSurveyExpansion(survey.id)}
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-4 h-4" />
                                      <span>Hide Survey</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4" />
                                      <span>Take Survey</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}

                            {isCompleted && (
                              <div className="flex justify-end">
                                <span className="text-sm flex items-center gap-1 text-green-500">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Completed
                                </span>
                              </div>
                            )}

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="border-t mt-4 pt-4 space-y-6">
                                    {survey.questions.map((question: any, qIndex: number) => (
                                      <div key={qIndex} className="space-y-4">
                                        <h4 className="font-medium text-base">
                                          {qIndex + 1}. {question.text}
                                        </h4>

                                        {(survey.type === "multiple_choice" || survey.type === "poll") && (
                                          <RadioGroup
                                            value={surveyAnswers[survey.id]?.[qIndex.toString()] || ""}
                                            onValueChange={(value) =>
                                              handleAnswerChange(survey.id, qIndex.toString(), value)
                                            }
                                            className="bg-secondary/10 p-4 rounded-md"
                                          >
                                            {question.options.map((option: string, optIndex: number) => (
                                              <div key={optIndex} className="flex items-center space-x-3 py-2">
                                                <RadioGroupItem
                                                  value={option}
                                                  id={`option-${survey.id}-${qIndex}-${optIndex}`}
                                                  className="h-5 w-5"
                                                />
                                                <Label
                                                  htmlFor={`option-${survey.id}-${qIndex}-${optIndex}`}
                                                  className="text-base cursor-pointer"
                                                >
                                                  {option}
                                                </Label>
                                              </div>
                                            ))}
                                          </RadioGroup>
                                        )}

                                        {survey.type === "short_answer" && (
                                          <Textarea
                                            value={surveyAnswers[survey.id]?.[qIndex.toString()] || ""}
                                            onChange={(e) =>
                                              handleAnswerChange(survey.id, qIndex.toString(), e.target.value)
                                            }
                                            placeholder="Type your answer here..."
                                            rows={4}
                                            className="bg-secondary/10 p-3 text-base"
                                          />
                                        )}
                                      </div>
                                    ))}

                                    <div className="flex justify-end mt-6">
                                      <Button variant="gradient" size="lg" onClick={() => handleSubmitSurvey(survey)}>
                                        Submit Survey
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </MotionItem>
                )
              })
            )}
          </MotionContainer>
        </motion.div>
      </AnimatePresence>

      {/* Reward Animation Dialog */}
      <Dialog
        open={showRewardAnimation.show}
        onOpenChange={(open) => {
          if (!open) handleClaimReward()
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="reward-animation"
          >
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-8 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.5)] text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
              >
                <Coins className="w-20 h-20 mx-auto text-white mb-4" />
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Congratulations!
              </motion.h2>

              <motion.p
                className="text-white/90 mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                You've earned
              </motion.p>

              <motion.div
                className="text-4xl font-bold text-white mb-6 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                }}
              >
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: 2,
                    repeatDelay: 0.5,
                  }}
                >
                  {showRewardAnimation.amount} Tokens
                </motion.span>
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                <Button
                  className="bg-white text-amber-600 hover:bg-white/90 hover:text-amber-700"
                  onClick={handleClaimReward}
                >
                  Claim Reward
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
