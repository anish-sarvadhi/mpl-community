"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Plus, Quote, LinkIcon, Video, MessageSquare, Heart, Share2, Filter } from "lucide-react"
import testimonials from "@/data/testimonials.json"
import { useLanguage } from "./language-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type TestimonialType = "text" | "video"

interface Testimonial {
  id: string
  name: string
  location: string
  content: string
  type: TestimonialType
  date: string
  title?: string
  link?: string
  likes?: number
}

export default function WallOfLove() {
  const { t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>(
    testimonials.map((t) => ({
      ...t,
      likes: Math.floor(Math.random() * 50) + 1,
    })) as Testimonial[],
  )
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    location: "",
    title: "",
    content: "",
    type: "text" as TestimonialType,
    link: "",
  })
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [feedbackType, setFeedbackType] = useState<"comment" | "testimonial">("comment")
  const [filter, setFilter] = useState<"all" | "text" | "video">("all")
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest")
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmitTestimonial = () => {
    if (newTestimonial.name && newTestimonial.content) {
      const testimonialToAdd: Testimonial = {
        id: `local-${Date.now()}`,
        name: newTestimonial.name,
        location: newTestimonial.location || "MPL User",
        title: newTestimonial.title || (feedbackType === "comment" ? "User Feedback" : "User Testimonial"),
        content: feedbackType === "testimonial" && newTestimonial.link ? newTestimonial.link : newTestimonial.content,
        type: feedbackType === "testimonial" && newTestimonial.link ? "video" : "text",
        date: new Date().toISOString(),
        likes: 0,
      }

      setLocalTestimonials([testimonialToAdd, ...localTestimonials])

      setNewTestimonial({
        name: "",
        location: "",
        title: "",
        content: "",
        type: "text",
        link: "",
      })

      setFeedbackType("comment")
    }
  }

  const handleLike = (id: string) => {
    setLocalTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === id ? { ...testimonial, likes: (testimonial.likes || 0) + 1 } : testimonial,
      ),
    )
  }

  // Filter and sort testimonials
  const filteredTestimonials = localTestimonials
    .filter((testimonial) => filter === "all" || testimonial.type === filter)
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return (b.likes || 0) - (a.likes || 0)
      }
    })

  // Animation variants for grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight gradient-text">{t("wallOfLove.title")}</h2>
          <p className="text-muted-foreground">{t("wallOfLove.subtitle")}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="w-4 h-4" />
                <span>{filter === "all" ? "All Types" : filter === "text" ? "Text Only" : "Videos Only"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("text")}>Text Only</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("video")}>Videos Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <span>{sortBy === "latest" ? "Latest" : "Most Popular"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("latest")}>Latest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("popular")}>Most Popular</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Plus className="w-4 h-4" />
                <span>{t("wallOfLove.addYours")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>{t("wallOfLove.shareExperience")}</DialogTitle>
                <DialogDescription>{t("wallOfLove.tellUs")}</DialogDescription>
              </DialogHeader>

              <Tabs
                defaultValue="comment"
                onValueChange={(value) => setFeedbackType(value as "comment" | "testimonial")}
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="comment" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Written Feedback</span>
                  </TabsTrigger>
                  <TabsTrigger value="testimonial" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Video Testimonial</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comment" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">{t("wallOfLove.name")}</Label>
                        <Input
                          id="name"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="location">{t("wallOfLove.location")}</Label>
                        <Input
                          id="location"
                          value={newTestimonial.location}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="title">Feedback Title</Label>
                      <Input
                        id="title"
                        value={newTestimonial.title}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                        placeholder="What's your feedback about?"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="content">{t("wallOfLove.testimonial")}</Label>
                      <Textarea
                        id="content"
                        rows={4}
                        value={newTestimonial.content}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                        placeholder="Share your experience with MPL..."
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="testimonial" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name-video">{t("wallOfLove.name")}</Label>
                        <Input
                          id="name-video"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="location-video">{t("wallOfLove.location")}</Label>
                        <Input
                          id="location-video"
                          value={newTestimonial.location}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="title-video">Testimonial Title</Label>
                      <Input
                        id="title-video"
                        value={newTestimonial.title}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                        placeholder="Give your testimonial a title"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="video-link" className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        <span>Video Link (YouTube, Vimeo, etc.)</span>
                      </Label>
                      <Input
                        id="video-link"
                        value={newTestimonial.link}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, link: e.target.value })}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Please provide an embeddable link (e.g., YouTube embed URL)
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Brief Description (Optional)</Label>
                      <Textarea
                        id="description"
                        rows={2}
                        value={newTestimonial.content}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                        placeholder="Add a brief description of your video testimonial..."
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  onClick={handleSubmitTestimonial}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {t("wallOfLove.submit")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div
        ref={gridRef}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 testimonial-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {filteredTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              layout
              variants={itemVariants}
              className={`h-full ${testimonial.type === "video" ? "sm:col-span-2 lg:col-span-1 video" : ""}`}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full overflow-hidden hover-lift card-highlight flex flex-col testimonial-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-lg flex-shrink-0">
                      <AvatarImage
                        src={`/blue-skinned-figure.png?height=40&width=40&query=avatar ${testimonial.name}`}
                      />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium line-clamp-1">{testimonial.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{testimonial.location}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {testimonial.type === "text" ? "Feedback" : "Video"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col pb-0">
                  {testimonial.title && (
                    <h4 className="text-lg font-semibold mb-3 gradient-text line-clamp-1">{testimonial.title}</h4>
                  )}

                  {testimonial.type === "video" ? (
                    <div
                      className="relative flex-1 bg-muted rounded-md overflow-hidden cursor-pointer group h-[200px]"
                      onClick={() => setActiveVideo(testimonial.content)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <motion.div
                          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/90 text-white"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-6 h-6 fill-current" />
                        </motion.div>
                      </div>
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300"></div>
                      <img
                        src={`/abstract-geometric-shapes.png?height=200&width=350&query=video thumbnail for ${testimonial.title || "testimonial"}`}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {testimonial.content && testimonial.content !== testimonial.link && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-sm text-white line-clamp-2">{testimonial.content}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-secondary/50 p-4 rounded-md flex-1 flex flex-col">
                      <Quote className="w-4 h-4 text-primary mb-2 shrink-0" />
                      <p className="text-sm flex-1 overflow-hidden testimonial-content break-words">
                        {testimonial.content.length > 150 && window.innerWidth < 768
                          ? `${testimonial.content.substring(0, 150)}...`
                          : testimonial.content}
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t bg-muted/20 p-3 mt-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(testimonial.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => handleLike(testimonial.id)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{testimonial.likes || 0}</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {activeVideo && (
        <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{t("wallOfLove.userTestimonial")}</DialogTitle>
            </DialogHeader>
            <div className="aspect-video">
              <iframe src={activeVideo} className="w-full h-full" allowFullScreen title="User testimonial video" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
