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
  const [credits, setCredits] = useState(1000) // Default: 1000 credits
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Load credits from Supabase when user changes
  useEffect(() => {
    const loadUserCredits = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('credits')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error loading credits:', error)
          // Fallback to localStorage for demo
          const savedCredits = localStorage.getItem('brandsnap-credits')
          if (savedCredits) {
            setCredits(parseInt(savedCredits, 10))
          }
        } else {
          setCredits(data?.credits || 1000)
        }
      } catch (error) {
        console.error('Error loading credits:', error)
        // Fallback to localStorage for demo
        const savedCredits = localStorage.getItem('brandsnap-credits')
        if (savedCredits) {
          setCredits(parseInt(savedCredits, 10))
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUserCredits()
  }, [user])

  // Save credits to localStorage as backup (for demo purposes)
  useEffect(() => {
    if (!isLoading && user) {
      localStorage.setItem('brandsnap-credits', credits.toString())
    }
  }, [credits, isLoading, user])

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

