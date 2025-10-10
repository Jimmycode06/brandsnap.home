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

export default function Page() {
  const { user, loading: authLoading } = useAuth()
  const { credits, isLoading: creditsLoading, canAfford, plan, subscriptionStatus } = useCredits()
  const router = useRouter()
  const hasRedirectedHome = useRef(false)
  const hasRedirectedUpgrade = useRef(false)

  // Rediriger vers l'accueil si pas connecté OU vers tarifs si pas de plan/abonnement (avant tout return)
  useEffect(() => {
    if (!authLoading && !creditsLoading) {
      if (!user && !hasRedirectedHome.current) {
        hasRedirectedHome.current = true
        router.push('/')
        return
      }
      // Nouveaux utilisateurs: pas de plan ou abonnement inactif -> tarifs
      if (user && (!plan || subscriptionStatus !== 'active') && !hasRedirectedUpgrade.current) {
        hasRedirectedUpgrade.current = true
        router.push('/#pricing')
        return
      }
      // Utilisateur avec plan actif mais 0 crédits -> Upgrade
      if (user && plan && subscriptionStatus === 'active' && credits === 0 && !hasRedirectedUpgrade.current) {
        hasRedirectedUpgrade.current = true
        router.push('/upgrade')
      }
      // Finalize après succès Stripe (si session_id présent)
      const params = new URLSearchParams(window.location.search)
      const success = params.get('success')
      const sessionId = params.get('session_id')
      if (success && sessionId) {
        fetch('/api/stripe/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })
          .then(() => {
            // Recharger contexte crédits
            window.location.replace('/home-staging')
          })
          .catch(() => {})
      }
    }
  }, [user, credits, authLoading, creditsLoading, router, plan, subscriptionStatus])

  if (authLoading || creditsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
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
          <div className="ml-auto">
            <CreditDisplay />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Home Staging Virtuel</h2>
            <p className="text-sm text-muted-foreground">Transformez vos pièces vides en intérieurs meublés et décorés avec l&apos;IA.</p>
            <HomeStagingGenerator />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


