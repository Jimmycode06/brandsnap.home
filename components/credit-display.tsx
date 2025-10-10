'use client'

import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCredits } from '@/contexts/credit-context'
import Link from 'next/link'

export function CreditDisplay() {
  const { credits } = useCredits()

  return (
    <div className="flex items-center gap-3">
      {/* Credits Display - Vert fluo */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-400 dark:bg-green-500 rounded-full border border-green-500 dark:border-green-400 shadow-lg">
        <Zap className="h-4 w-4 text-white" />
        <span className="text-xs text-white">
          {credits} crédits
        </span>
      </div>

      {/* Upgrade Button */}
      <Link href="/#pricing">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs"
        >
          <Zap className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      </Link>
    </div>
  )
}
