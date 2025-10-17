"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

type Props = {
  leftImage: string
  rightImage: string
  leftImageLabel?: string
  rightImageLabel?: string
  containerClassName?: string
}

export const Compare = ({
  leftImage,
  rightImage,
  leftImageLabel = "Avant",
  rightImageLabel = "Après",
  containerClassName = "",
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchend", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("mouseup", handleMouseUp)
        window.removeEventListener("touchend", handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden cursor-col-resize ${containerClassName}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <img
          src={leftImage}
          alt={leftImageLabel}
          className={`object-cover w-full h-full transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
          {leftImageLabel}
        </div>
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={rightImage}
          alt={rightImageLabel}
          className={`object-cover w-full h-full transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute top-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-lg">
          {rightImageLabel}
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

