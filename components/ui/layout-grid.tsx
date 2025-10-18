"use client"

import { ReactNode, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const LayoutGrid = ({ cards }: { cards: LayoutGridCard[] }) => {
  const [selected, setSelected] = useState<LayoutGridCard | null>(null)

  return (
    <div className="w-full h-full py-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "")}>
          <motion.div
            onClick={() => setSelected(card)}
            className={cn(
              "relative overflow-hidden",
              card.className
            )}
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 z-0">
              <img
                src={card.src}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            <div className="relative z-20 p-4 flex flex-col justify-end h-full">
              <div className="text-white">
                <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                {card.description && (
                  <p className="text-sm text-white/80">{card.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

export type LayoutGridCard = {
  id: number
  className?: string
  src: string
  title: string
  description?: string
}

