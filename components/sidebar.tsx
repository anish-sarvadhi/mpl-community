"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Heart, Bell, BarChart2, BookOpen, Hash, User, Trophy, Coins } from "lucide-react"
import { useMobileMenu } from "./mobile-menu-provider"
import { useEffect, useState } from "react"
import { useLanguage } from "./language-provider"
import ThemeToggle from "./theme-toggle"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useFirstVisit } from "@/lib/use-first-visit"
import { useRewards } from "./rewards-provider"

export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle, close } = useMobileMenu()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const isFirstVisit = useFirstVisit("sidebarAnimated")
  const { totalRewards } = useRewards()

  // Close mobile menu when path changes
  useEffect(() => {
    close()
  }, [pathname, close])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navItems = [
    { name: t("common.social"), href: "/", icon: Home },
    { name: t("common.wallOfLove"), href: "/wall-of-love", icon: Heart },
    { name: "Announcements", href: "/inbox", icon: Bell },
    { name: t("common.surveys"), href: "/surveys", icon: BarChart2 },
    { name: t("common.blog"), href: "/blog", icon: BookOpen },
    { name: "Rewards History", href: "/rewards", icon: Trophy },
  ]

  const socialLinks = [
    { name: "Telegram", href: "https://t.me/mplofficial", icon: Hash },
    { name: "Instagram", href: "https://instagram.com/mpl_official", icon: Hash },
    { name: "YouTube", href: "https://youtube.com/mplgaming", icon: Hash },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 flex items-center">
            <img src="/mpl_logo.webp" alt="MPL Logo" className="h-8" />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 sidebar-scroll-area">
        <div className="px-3 py-4">
          <div className="channel-category">{t("common.channels")}</div>
          <div className="space-y-1 mt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <Link key={item.name} href={item.href} className="block">
                  <div className={`sidebar-item ${isActive ? "active" : ""}`}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                        layoutId="sidebarIndicator"
                      ></motion.div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="channel-category mt-8">{t("common.socialLinks")}</div>
          <div className="space-y-1 mt-2">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="block">
                <div className="sidebar-item">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  <div className="ml-auto w-3 h-3 text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 px-3">
            <div className="card-gradient rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">MPL Rewards</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-amber-400">{totalRewards}</span>
                <span className="text-xs text-muted-foreground">tokens earned</span>
              </div>
              <Link href="/rewards">
                <Button
                  size="sm"
                  variant="gradient"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                >
                  Claim Rewards
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="text-sm font-medium">{t("common.user")}</div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-64 border-r h-screen z-40 bg-background"
        initial={isFirstVisit ? { x: -50, opacity: 0 } : { x: 0, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarContent />
      </motion.div>
    </>
  )
}
