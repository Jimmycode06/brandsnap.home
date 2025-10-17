"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"

interface AnimatedStatsProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
}

function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2 }: AnimatedStatsProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        
        setCount(Math.floor(progress * value))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

interface StatsProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  description?: string
}

export function AnimatedStats({ stats }: { stats: StatsProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="text-center"
        >
          <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
            />
          </div>
          <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
          {stat.description && (
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  )
}

