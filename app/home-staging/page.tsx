'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar-home-staging'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { HomeStagingGenerator } from '@/components/home-staging-generator'
import { useAuth } from '@/contexts/auth-context'
import { useCredits } from '@/contexts/credit-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { CreditDisplay } from '@/components/credit-display'
import { AuthButton } from '@/components/auth-button'

export default function Page() {
  const { user, loading: authLoading } = useAuth()
  const { credits, isLoading: creditsLoading, canAfford, plan, subscriptionStatus } = useCredits()
  const router = useRouter()
  const hasRedirectedHome = useRef(false)
  const hasRedirectedUpgrade = useRef(false)
  const hasFinalized = useRef(false)

  // D'abord: finalize Stripe si retour de checkout, puis redirections
  useEffect(() => {
    if (!authLoading && !creditsLoading) {
      // 1) Finalize en priorité si retour de Stripe
      const params = new URLSearchParams(window.location.search)
      const success = params.get('success')
      const sessionId = params.get('session_id')
      if (success && sessionId && !hasFinalized.current) {
        hasFinalized.current = true
        fetch('/api/stripe/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })
          .finally(() => {
            // Nettoyer l'URL et recharger le contexte
            window.history.replaceState({}, '', '/home-staging')
            window.location.reload()
          })
        return
      }

      // 2) Redirections selon statut
      if (!user && !hasRedirectedHome.current) {
        hasRedirectedHome.current = true
        router.push('/')
        return
      }
      // Utilisateur avec 0 crédits -> Upgrade (peu importe le statut)
      if (user && credits === 0 && !hasRedirectedUpgrade.current) {
        hasRedirectedUpgrade.current = true
        router.push('/upgrade')
        return
      }
    }
  }, [user, credits, authLoading, creditsLoading, router, plan, subscriptionStatus])

  if (authLoading || creditsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Si pas assez de crédits, afficher CTA vers tarifs au lieu d'un loader
  if (!canAfford(1)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Vous n'avez pas encore de crédits.</p>
          <Button asChild>
            <Link href="/#pricing">Choisir un plan</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Home Staging Virtuel</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <CreditDisplay />
            <AuthButton />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground">Transformez vos pièces vides en intérieurs meublés et décorés avec l&apos;IA.</p>
            <HomeStagingGenerator />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


