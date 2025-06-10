"use client"

import { useRef } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import socialLinks from "@/data/social-links.json"
import { ExternalLink, Users, MessageCircle, Video, Camera, Hash } from "lucide-react"
import { useLanguage } from "./language-provider"
import { MotionContainer, MotionItem, MotionDiv } from "./ui/motion"
import { useFirstVisit } from "@/lib/use-first-visit"
import { Button } from "./ui/button"

export default function SocialMediaPage() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirstVisit = useFirstVisit("socialPageAnimated")

  // Get platform icon based on platform ID
  const getPlatformIcon = (id: string) => {
    switch (id) {
      case "telegram":
        return <MessageCircle className="w-5 h-5" />
      case "instagram":
        return <Camera className="w-5 h-5" />
      case "youtube":
        return <Video className="w-5 h-5" />
      case "discord":
        return <Hash className="w-5 h-5" />
      case "twitter":
        return <MessageCircle className="w-5 h-5" />
      case "facebook":
        return <Users className="w-5 h-5" />
      default:
        return <Hash className="w-5 h-5" />
    }
  }

  // Get platform banner image
  const getPlatformBanner = (id: string) => {
    // Use a fallback image if the specific banner doesn't exist
    return `/platform-banners/${id}-banner.jpg`
  }

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto overflow-hidden">
      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight gradient-text">{t("social.title")}</h2>
        <p className="text-muted-foreground">{t("social.subtitle")}</p>
      </MotionDiv>

      <MotionContainer className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" animate={isFirstVisit}>
        {socialLinks.map((link, index) => {
          return (
            <MotionItem key={link.id} delay={index * 0.1} animate={isFirstVisit}>
              <Card className="overflow-hidden transition-all duration-500 hover-lift card-highlight h-full flex flex-col social-card">
                <div className="h-32 overflow-hidden">
                  <img
                    src={getPlatformBanner(link.id) || "/placeholder.svg"}
                    alt={`${link.platform} banner`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = `/abstract-geometric-shapes.png?height=150&width=300&query=${link.platform} banner`
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg flex-shrink-0">
                      <AvatarImage src={`/platform-icons/${link.id}.png`} alt={`${link.platform} logo`} />
                      <AvatarFallback className="bg-primary/10 text-primary">{getPlatformIcon(link.id)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold line-clamp-1">{link.platform}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{link.channelTitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 social-card-content">
                  <div className="bg-secondary/30 p-4 rounded-lg h-full">
                    <p className="text-sm line-clamp-3 social-card-description">{link.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="gradient" className="w-full gap-2" onClick={() => window.open(link.url, "_blank")}>
                    {t("social.joinButton", { platform: link.platform })}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </MotionItem>
          )
        })}
      </MotionContainer>

      <MotionDiv
        initial={isFirstVisit ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: isFirstVisit ? 0.5 : 0,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className="mt-12 card-gradient rounded-xl p-6 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4 gradient-text">Join the MPL Community</h3>
            <p className="text-muted-foreground mb-6 break-words">
              Connect with millions of players, participate in tournaments, and stay updated with the latest MPL news
              and events.
            </p>
            <Button variant="gradient">Download MPL App</Button>
          </div>
          <div className="md:w-1/2">
            <img
              src="/community-collage.jpg"
              alt="MPL Community"
              className="rounded-lg shadow-xl w-full object-cover h-full max-h-[250px]"
            />
          </div>
        </div>
      </MotionDiv>
    </div>
  )
}
