"use client"
import Link from "next/link"
import { ArrowLeft, Share2, Calendar, User, Clock, Heart, MessageSquare } from "lucide-react"
import { useLanguage } from "./language-provider"
import { MotionContainer, MotionItem, MotionDiv } from "./ui/motion"
import { motion } from "framer-motion"
import { useFirstVisit } from "@/lib/use-first-visit"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useState } from "react"

// Mock blogs data for related articles
const blogs = [
  {
    id: "1",
    title: "Blog 1",
    category: "tips",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Blog 2",
    category: "stories",
    date: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Blog 3",
    category: "promotions",
    date: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Blog 4",
    category: "tips",
    date: new Date().toISOString(),
  },
]

export default function BlogDetail({ blog }: { blog: any }) {
  const { t } = useLanguage()
  const isFirstVisit = useFirstVisit(`blogDetail-${blog.id}`)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10)

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1)
    } else {
      setLikeCount((prev) => prev + 1)
    }
    setLiked(!liked)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" />
              <span>{t("blog.back")}</span>
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight gradient-text sr-only">Blog Detail</h2>
        </div>
        <p className="text-muted-foreground sr-only">Read the full article</p>
      </MotionDiv>

      <MotionContainer className="space-y-6" animate={isFirstVisit}>
        <MotionItem animate={isFirstVisit}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary/90 hover:bg-primary text-white border-none">
                  {blog.category === "tips"
                    ? t("blog.gameTips")
                    : blog.category === "stories"
                      ? t("blog.userStories")
                      : t("blog.promotions")}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(blog.date).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{blog.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={`gap-1 ${liked ? "text-red-500 border-red-200" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
                <span>{likeCount}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{Math.floor(Math.random() * 20)}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="w-4 h-4" />
                <span>{t("blog.share")}</span>
              </Button>
            </div>
          </div>
        </MotionItem>

        <MotionItem delay={0.1} animate={isFirstVisit}>
          <div className="flex items-center gap-3 border-y py-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src="/blue-skinned-figure.png" />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">MPL Editorial Team</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>Author</span>
                <span className="mx-1">•</span>
                <Clock className="w-3 h-3" />
                <span>{Math.floor(Math.random() * 10) + 2} min read</span>
              </div>
            </div>
          </div>
        </MotionItem>

        <MotionItem delay={0.2} animate={isFirstVisit}>
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={`/abstract-geometric-shapes.png?height=400&width=800&query=${blog.title}`}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </MotionItem>

        <MotionDiv
          className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none"
          initial={isFirstVisit ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {blog.content.map((section: any, index: number) => {
            if (section.type === "paragraph") {
              return (
                <motion.p
                  key={index}
                  initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: isFirstVisit ? 0.3 + index * 0.1 : 0 }}
                >
                  {section.content}
                </motion.p>
              )
            } else if (section.type === "heading") {
              return (
                <motion.h2
                  key={index}
                  className="text-xl font-bold mt-6"
                  initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: isFirstVisit ? 0.3 + index * 0.1 : 0 }}
                >
                  {section.content}
                </motion.h2>
              )
            } else if (section.type === "image") {
              return (
                <motion.div
                  key={index}
                  className="my-6"
                  initial={isFirstVisit ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: isFirstVisit ? 0.3 + index * 0.1 : 0 }}
                >
                  <img
                    src={`/abstract-geometric-shapes.png?height=300&width=600&query=${section.alt || "blog image"}`}
                    alt={section.alt || "Blog image"}
                    className="w-full rounded-lg"
                  />
                  {section.caption && (
                    <p className="text-sm text-center text-muted-foreground mt-2">{section.caption}</p>
                  )}
                </motion.div>
              )
            } else if (section.type === "video") {
              return (
                <motion.div
                  key={index}
                  className="my-6 aspect-video"
                  initial={isFirstVisit ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: isFirstVisit ? 0.3 + index * 0.1 : 0 }}
                >
                  <iframe
                    src={section.url}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={section.title || "Embedded video"}
                  />
                </motion.div>
              )
            }
            return null
          })}
        </MotionDiv>

        <MotionItem delay={0.4} animate={isFirstVisit}>
          <div className="border-t pt-6 mt-8">
            <h3 className="text-lg font-bold mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {blogs
                .filter((relatedBlog) => relatedBlog.id !== blog.id && relatedBlog.category === blog.category)
                .slice(0, 3)
                .map((relatedBlog, index) => (
                  <Link key={relatedBlog.id} href={`/blog/${relatedBlog.id}`}>
                    <motion.div className="group" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                      <div className="aspect-video overflow-hidden rounded-lg mb-2">
                        <img
                          src={`/abstract-geometric-shapes.png?height=150&width=300&query=${relatedBlog.title}`}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        />
                      </div>
                      <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(relatedBlog.date).toLocaleDateString()}
                      </p>
                    </motion.div>
                  </Link>
                ))}
            </div>
          </div>
        </MotionItem>
      </MotionContainer>
    </div>
  )
}
