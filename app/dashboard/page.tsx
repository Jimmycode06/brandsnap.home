'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { CreditDisplay } from '@/components/credit-display'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Download, Trash2, Image as ImageIcon, Home } from 'lucide-react'
import Link from 'next/link'

interface Generation {
  id: string
  type: 'home-staging' | 'marketing' | 'video'
  prompt: string
  image_url: string
  created_at: string
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Rediriger si pas connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  // Charger les générations
  useEffect(() => {
    const loadGenerations = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Error loading generations:', error)
        } else {
          setGenerations(data || [])
        }
      } catch (error) {
        console.error('Error loading generations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGenerations()
  }, [user])

  const handleDownload = async (imageUrl: string, id: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generation-${id}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      window.open(imageUrl, '_blank')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette génération ?')) return

    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting generation:', error)
      } else {
        setGenerations(prev => prev.filter(g => g.id !== id))
      }
    } catch (error) {
      console.error('Error deleting generation:', error)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-400" />
      </div>
    )
  }

  if (!user) {
    return null
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
                  <BreadcrumbPage>Transformations</BreadcrumbPage>
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
            <div className="flex items-center justify-between mt-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Mes Transformations</h2>
                <p className="text-sm text-muted-foreground">Historique de vos générations</p>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/home-staging">
                    <Home className="mr-2 h-4 w-4" />
                    Nouvelle transformation
                  </Link>
                </Button>
              </div>
            </div>

            {generations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune transformation</h3>
                  <p className="text-muted-foreground mb-6">
                    Commencez à créer vos premières transformations avec l'IA
                  </p>
                  <Button asChild>
                    <Link href="/home-staging">Créer une transformation</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generations.map((gen) => (
                  <Card key={gen.id} className="overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                      <img
                        src={gen.image_url}
                        alt={gen.prompt}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="bg-green-400/90 text-black px-2 py-1 rounded text-xs font-medium">
                          {gen.type === 'home-staging' ? 'Home Staging' : 'Marketing'}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {gen.prompt}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {new Date(gen.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDownload(gen.image_url, gen.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(gen.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

