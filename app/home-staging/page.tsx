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
  const { credits, isLoading: creditsLoading, canAfford } = useCredits()
  const router = useRouter()
  const hasRedirectedHome = useRef(false)
  const hasRedirectedUpgrade = useRef(false)

  // Rediriger vers l'accueil si pas connecté OU vers upgrade si pas assez de crédits (avant tout return)
  useEffect(() => {
    if (!authLoading && !creditsLoading) {
      if (!user && !hasRedirectedHome.current) {
        hasRedirectedHome.current = true
        router.push('/')
        return
      }
      if (user && credits === 0 && !hasRedirectedUpgrade.current) {
        hasRedirectedUpgrade.current = true
        router.push('/upgrade')
      }
    }
  }, [user, credits, authLoading, creditsLoading, router])

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

  // Si pas assez de crédits, afficher un loader pendant la redirection
  if (!canAfford(1)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
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


