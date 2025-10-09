'use client'

import { Coins, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCredits } from '@/contexts/credit-context'

export function CreditDisplay() {
  const { credits, addCredits } = useCredits()

  const handleUpgrade = async () => {
    // For demo purposes, add 100 credits
    // In a real app, this would open an upgrade modal
    await addCredits(100)
  }

  return (
    <div className="flex items-center gap-3">
      {/* Credits Display - Vert fluo */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-400 dark:bg-green-500 rounded-full border border-green-500 dark:border-green-400 shadow-lg">
        <Zap className="h-4 w-4 text-white" />
        <span className="text-sm font-bold text-white">
          {credits}
        </span>
      </div>

      {/* Upgrade Button */}
      <Button
        onClick={handleUpgrade}
        size="sm"
        variant="outline"
        className="h-8 px-3 text-xs"
      >
        <Zap className="h-3 w-3 mr-1" />
        Upgrade
      </Button>
    </div>
  )
}
