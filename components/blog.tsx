"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, Filter, Calendar, BookOpen, TrendingUp, Clock } from "lucide-react"
import blogs from "@/data/blogs.json"
import { useLanguage } from "./language-provider"
import { MotionDiv } from "./ui/motion"
import { AnimatePresence, motion } from "framer-motion"
import { useFirstVisit } from "@/lib/use-first-visit"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useInView } from "react-intersection-observer"

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest")
  const { t } = useLanguage()
  const isFirstVisit = useFirstVisit("blogPageAnimated")
  const gridRef = useRef<HTMLDivElement>(null)
  const [visibleBlogs, setVisibleBlogs] = useState(6)
  const [hasMore, setHasMore] = useState(true)

  // Add a view count to each blog for sorting by popularity
  const blogsWithViews = blogs.map((blog) => ({
    ...blog,
    views: Math.floor(Math.random() * 1000) + 100, // Random view count for demo
  }))

  const filteredBlogs = blogsWithViews
    .filter((blog) => {
      // Filter by category
      if (activeFilter !== "all" && blog.category !== activeFilter) {
        return false
      }

      // Filter by search term
      if (
        searchTerm &&
        !blog.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.views - a.views
      }
    })
    .slice(0, visibleBlogs)

  // Load more blogs when the user scrolls to the bottom
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView && hasMore) {
      setTimeout(() => {
        setVisibleBlogs((prev) => {
          const newValue = prev + 3
          if (newValue >= blogs.length) {
            setHasMore(false)
          }
          return newValue
        })
      }, 500)
    }
  }, [inView, hasMore])

  // Get a size class for each blog to create a varied grid
  const getBlogSizeClass = (index: number) => {
    // Create a pattern of different sized blog cards
    const pattern = index % 6

    switch (pattern) {
      case 0: // Featured (large)
        return "md:col-span-2 md:row-span-2"
      case 3: // Medium
        return "md:col-span-2 md:row-span-1"
      default: // Regular
        return "md:col-span-1 md:row-span-1"
    }
  }

  // Get a random offset for hover animation
  const getRandomOffset = () => {
    const offsets = [5, 7, 10]
    return offsets[Math.floor(Math.random() * offsets.length)]
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight gradient-text">{t("blog.title")}</h2>
        <p className="text-muted-foreground">{t("blog.subtitle")}</p>
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
            placeholder="Search blogs..."
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
                    ? "All Categories"
                    : activeFilter === "tips"
                      ? t("blog.gameTips")
                      : activeFilter === "stories"
                        ? t("blog.userStories")
                        : t("blog.promotions")}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveFilter("all")}>All Categories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("tips")}>{t("blog.gameTips")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("stories")}>{t("blog.userStories")}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("promotions")}>{t("blog.promotions")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="w-4 h-4" />
                <span>{sortBy === "latest" ? "Latest First" : "Most Popular"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("latest")}>
                <Clock className="w-4 h-4 mr-2" />
                Latest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("popular")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Most Popular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MotionDiv>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter + sortBy + searchTerm}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No blogs found</h3>
              <p className="text-muted-foreground">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
              {filteredBlogs.map((blog, index) => {
                const sizeClass = getBlogSizeClass(index)
                const isFeatured = sizeClass.includes("col-span-2") && sizeClass.includes("row-span-2")
                const isMedium = sizeClass.includes("col-span-2") && !sizeClass.includes("row-span-2")

                return (
                  <motion.div
                    key={blog.id}
                    className={`${sizeClass}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }}
                    whileHover={{
                      y: -getRandomOffset(),
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Link href={`/blog/${blog.id}`} className="block h-full">
                      <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                        <div className={`relative overflow-hidden ${isFeatured ? "aspect-[16/9]" : "aspect-video"}`}>
                          <img
                            src={`/abstract-geometric-shapes.png?height=${isFeatured ? 400 : 200}&width=${isFeatured ? 800 : 400}&query=${blog.title}`}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 left-3 flex gap-2">
                            <Badge className="bg-primary/90 hover:bg-primary text-white border-none">
                              {blog.category === "tips"
                                ? t("blog.gameTips")
                                : blog.category === "stories"
                                  ? t("blog.userStories")
                                  : t("blog.promotions")}
                            </Badge>
                            {sortBy === "popular" && (
                              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                                <TrendingUp className="w-3 h-3 mr-1" /> {blog.views} views
                              </Badge>
                            )}
                          </div>
                        </div>

                        <CardHeader className={`pb-2 ${isFeatured ? "pt-5" : "pt-4"}`}>
                          <CardTitle className={`line-clamp-2 ${isFeatured ? "text-2xl" : "text-lg"}`}>
                            {blog.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(blog.date).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1">
                          <p
                            className={`text-sm text-muted-foreground ${isFeatured ? "line-clamp-3" : "line-clamp-2"}`}
                          >
                            {blog.excerpt}
                          </p>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <motion.div
                            className="flex items-center text-primary font-medium text-sm"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <span>{t("blog.readMore")}</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </motion.div>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* Load more indicator */}
          {hasMore && filteredBlogs.length > 0 && (
            <div ref={ref} className="flex justify-center items-center py-8 mt-6">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-muted-foreground">Loading more blogs...</p>
              </div>
            </div>
          )}

          {!hasMore && filteredBlogs.length > 0 && (
            <div className="text-center py-8 mt-6">
              <p className="text-muted-foreground">You've reached the end of the blogs</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setVisibleBlogs(6)
                  setHasMore(true)
                  if (gridRef.current) {
                    gridRef.current.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Back to top
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
