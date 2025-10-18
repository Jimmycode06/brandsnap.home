"use client"

import { useEffect, useRef, useState } from "react"

interface LogosCarouselProps {
  logos: Array<{
    name: string
    url: string
    width?: number
    height?: number
  }>
  speed?: number
  direction?: "left" | "right"
  pauseOnHover?: boolean
}

export function LogosCarousel({
  logos,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
}: LogosCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!scrollerRef.current) return

    const scroller = scrollerRef.current
    const scrollerContent = Array.from(scroller.children)

    // Dupliquer le contenu pour un défilement infini
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true) as HTMLElement
      duplicatedItem.setAttribute("aria-hidden", "true")
      scroller.appendChild(duplicatedItem)
    })
  }, [])

  return (
    <div className="w-full overflow-hidden py-12">
      <div
        className="flex gap-16 animate-scroll"
        style={{
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationDuration: `${speed}s`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        {logos.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center min-w-[180px] h-14"
          >
            <img
              src={logo.url}
              alt={logo.name}
              width={logo.width || 180}
              height={logo.height || 56}
              className="max-h-14 w-auto object-contain"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          to {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }

        .animate-scroll {
          animation: scroll linear infinite;
        }
      `}</style>
    </div>
  )
}

