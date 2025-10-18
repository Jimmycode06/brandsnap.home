'use client'

import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCredits } from '@/contexts/credit-context'
import Link from 'next/link'

export function CreditDisplay() {
  const { credits, plan } = useCredits()
  const isTrial = plan === 'trial'

  return (
    <div className="flex items-center gap-3">
      {/* Credits Display - Bleu */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 dark:bg-blue-700 rounded-full border border-blue-700 dark:border-blue-600 shadow-lg">
        <Zap className="h-4 w-4 text-white" />
        <span className="text-xs text-white">
          {isTrial && '🎁 '}
          {credits} crédit{credits > 1 ? 's' : ''}
          {isTrial && ' gratuit' + (credits > 1 ? 's' : '')}
        </span>
      </div>

      {/* Upgrade Button - Affiché seulement si pas en trial OU si trial avec 0 crédits */}
      {(!isTrial || credits === 0) && (
        <Link href="/#pricing">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs"
          >
            <Zap className="h-3 w-3 mr-1" />
            {isTrial && credits === 0 ? 'Choisir un plan' : 'Upgrade'}
          </Button>
        </Link>
      )}
    </div>
  )
}
