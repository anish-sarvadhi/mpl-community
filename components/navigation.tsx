"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, Bell, BarChart2, BookOpen, Trophy,User } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "./language-provider"
import { useFirstVisit } from "@/lib/use-first-visit"
import { useMobileMenu } from "./mobile-menu-provider"

export default function Navigation() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const isFirstVisit = useFirstVisit("navAnimated")
  const { close } = useMobileMenu()

  const navItems = [
    
    { name: t("common.social"), href: "/", icon: Home },
    { name: t("common.wallOfLove"), href: "/wall-of-love", icon: Heart },
    { name: "Announcements", href: "/inbox", icon: Bell },
    { name: t("common.surveys"), href: "/surveys", icon: BarChart2 },
    { name: t("common.blog"), href: "/blog", icon: BookOpen },
    { name: "Rewards", href: "/rewards", icon: Trophy },
    { name: "Profile", href: "/profile", icon: User },
    
  ]

  return (
    <motion.nav
      className="fixed bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      initial={isFirstVisit ? { y: 100 } : { y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="flex items-center justify-between h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={close}
            >
              <div className="flex flex-col items-center">
                <item.icon className="w-6 h-6 mx-auto" />
                {isActive && (
                  <motion.div
                    className="h-1 w-4 bg-primary rounded-full mx-auto mt-1"
                    layoutId="navIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
