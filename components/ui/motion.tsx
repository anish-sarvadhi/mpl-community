"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

// Reusable motion components
export const MotionDiv = motion.div
export const MotionButton = motion.button
export const MotionLink = motion.a

// Animated container with staggered children
interface MotionContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  viewport?: boolean
  animate?: boolean
}

export function MotionContainer({
  children,
  className,
  delay = 0,
  viewport = false,
  animate = true,
}: MotionContainerProps) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      exit="exit"
      transition={{ delay }}
      viewport={viewport ? { once: true, amount: 0.25 } : undefined}
    >
      {children}
    </motion.div>
  )
}

// Animated item for use inside MotionContainer
export function MotionItem({ children, className, delay = 0, animate = true }: MotionContainerProps) {
  return (
    <motion.div
      className={className}
      variants={fadeIn}
      transition={{ delay }}
      initial={animate ? undefined : { opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}

// Animated card component
export function MotionCard({ children, className, delay = 0, animate = true }: MotionContainerProps) {
  return (
    <motion.div
      className={className}
      variants={scaleIn}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      transition={{ delay }}
      initial={animate ? undefined : { opacity: 1, scale: 1 }}
    >
      {children}
    </motion.div>
  )
}

// Animated list with items that appear when in view
export function MotionList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  )
}

// Animated presence wrapper for page transitions
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
