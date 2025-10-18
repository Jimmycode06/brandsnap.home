"use client"

import { ReactNode, useEffect, useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface StickyBannerProps {
  className?: string
  children: ReactNode
  hideOnScroll?: boolean
}

export function StickyBanner({
  className = "",
  children,
  hideOnScroll = false,
}: StickyBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!hideOnScroll) return

    const handleScroll = () => {
      const scrolled = window.scrollY > 40
      setIsScrolled(scrolled)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hideOnScroll])

  useEffect(() => {
    if (hideOnScroll && isScrolled) {
      setIsVisible(false)
    }
  }, [isScrolled, hideOnScroll])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-blue-600 text-white ${className}`}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-center relative">
            <div className="flex items-center gap-2 text-sm font-medium">
              {children}
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

