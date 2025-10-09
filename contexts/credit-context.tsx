'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { supabase } from '@/lib/supabase'

interface CreditContextType {
  credits: number
  setCredits: (credits: number) => void
  deductCredits: (amount: number) => Promise<boolean>
  addCredits: (amount: number) => Promise<void>
  canAfford: (amount: number) => boolean
  isLoading: boolean
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(0) // Default: 0 credits
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load credits from Supabase when user changes
  useEffect(() => {
    const loadUserCredits = async () => {
      if (!user) {
        setCredits(0)
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('credits, plan, subscription_status')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error loading credits:', error)
          // Clear localStorage and set to 0 for users without profile
          localStorage.removeItem('brandsnap-credits')
          setCredits(0)
        } else {
          // Si l'utilisateur a un plan actif mais pas de crédits, on les remet selon le plan
          if (data?.subscription_status === 'active' && data?.credits === 0) {
            const planCredits = {
              starter: 30,
              professional: 100,
              enterprise: 999999
            }
            const defaultCredits = planCredits[data.plan as keyof typeof planCredits] || 0
            setCredits(defaultCredits)
            
            // Mettre à jour Supabase avec les bons crédits
            await supabase
              .from('user_profiles')
              .update({ credits: defaultCredits })
              .eq('id', user.id)
          } else {
            setCredits(data?.credits || 0)
          }
        }
      } catch (error) {
        console.error('Error loading credits:', error)
        // Clear localStorage and set to 0 for users without profile
        localStorage.removeItem('brandsnap-credits')
        setCredits(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserCredits()
  }, [user])

  // No longer saving to localStorage to avoid conflicts with Supabase data

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user) return false
    
    if (credits < amount) return false

    try {
      const newCredits = credits - amount
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ credits: newCredits })
        .eq('id', user.id)

      if (error) {
        console.error('Error deducting credits:', error)
        return false
      }

      setCredits(newCredits)
      return true
    } catch (error) {
      console.error('Error deducting credits:', error)
      return false
    }
  }

  const addCredits = async (amount: number) => {
    if (!user) return

    try {
      const newCredits = credits + amount
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ credits: newCredits })
        .eq('id', user.id)

      if (error) {
        console.error('Error adding credits:', error)
        return
      }

      setCredits(newCredits)
    } catch (error) {
      console.error('Error adding credits:', error)
    }
  }

  const canAfford = (amount: number): boolean => {
    return credits >= amount
  }

  return (
    <CreditContext.Provider value={{
      credits,
      setCredits,
      deductCredits,
      addCredits,
      canAfford,
      isLoading
    }}>
      {children}
    </CreditContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditContext)
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider')
  }
  return context
}

// Credit costs for each generator
export const CREDIT_COSTS = {
  'image-dream': 10,
  'marketing-generator': 10,
  'video-kling': 50,
  'video-generator': 50,
  'video-ltxv': 30
} as const

