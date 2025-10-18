"use client"

import { ReactNode } from "react"
import Link from "next/link"

interface Button3DProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary"
}

export function Button3D({ 
  children, 
  href, 
  onClick, 
  className = "",
  variant = "primary"
}: Button3DProps) {
  const baseClasses = "group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95 rounded-lg"
  
  const variantClasses = variant === "primary"
    ? "bg-blue-600 hover:bg-blue-700 shadow-[0_4px_0_0_rgba(37,99,235,0.8)] hover:shadow-[0_2px_0_0_rgba(37,99,235,0.8)] active:shadow-[0_1px_0_0_rgba(37,99,235,0.8)]"
    : "bg-gray-800 hover:bg-gray-900 shadow-[0_4px_0_0_rgba(31,41,55,0.8)] hover:shadow-[0_2px_0_0_rgba(31,41,55,0.8)] active:shadow-[0_1px_0_0_rgba(31,41,55,0.8)]"

  const content = (
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  )

  if (href) {
    return (
      <Link href={href as any} className={`${baseClasses} ${variantClasses} ${className}`}>
        {content}
      </Link>
    )
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {content}
    </button>
  )
}

