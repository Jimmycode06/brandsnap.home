'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

interface PricingButtonProps {
  priceId: string
  label?: string
  variant?: 'default' | 'outline'
  className?: string
}

export function PricingButton({ 
  priceId, 
  label = 'Commencer',
  variant = 'default',
  className = ''
}: PricingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubscribe = async () => {
    // Si pas connecté, rediriger vers auth
    if (!user) {
      router.push('/home-staging')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Erreur lors de la création de l\'abonnement. Veuillez réessayer.')
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      variant={variant}
      className={`w-full ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Chargement...
        </>
      ) : (
        label
      )}
    </Button>
  )
}

