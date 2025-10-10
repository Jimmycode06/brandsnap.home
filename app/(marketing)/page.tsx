'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AuthButton } from '@/components/auth-button'
import { PricingButton } from '@/components/pricing-button'
import { useAuth } from '@/contexts/auth-context'
import { useCredits } from '@/contexts/credit-context'
import { ArrowRight, CheckCircle, Clock, TrendingUp, Zap, ChevronLeft, ChevronRight, Upload, MessageSquare, Download, Home } from 'lucide-react'

export default function HomeStagingLandingPage() {
  const [beforeAfterSlider, setBeforeAfterSlider] = useState(50)
  const [renovationSlider, setRenovationSlider] = useState(50)
  const { user, loading: authLoading } = useAuth()
  const { credits, isLoading: creditsLoading } = useCredits()
  const router = useRouter()
  const hasRedirected = useRef(false)

  // Redirection automatique pour les utilisateurs connectés avec des crédits
  useEffect(() => {
    if (!authLoading && !creditsLoading && user && credits > 0 && !hasRedirected.current) {
      hasRedirected.current = true
      router.push('/home-staging')
    }
  }, [authLoading, creditsLoading, user, credits, router])

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logoa.png" alt="Brandsnap Home Staging" className="h-8 w-8" />
            <span className="text-lg font-semibold">Brandsnap Home Staging</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Démo
            </Link>
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Avantages
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tarifs
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Transformez vos biens avec l&apos;IA :{' '}
                <span className="text-green-400">Home Staging & Rénovation</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Meublez virtuellement vos pièces vides ou visualisez vos projets de rénovation. Uploadez vos photos, décrivez vos idées, et obtenez des visuels professionnels en quelques secondes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AuthButton />
              <Button size="lg" variant="outline" asChild>
                <Link href="#demo">Voir la démo</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              ⚡ Commencez dès 29€/mois • 30 transformations incluses
            </p>
          </div>
        </div>
      </section>

      {/* Before/After Demo Section - Home Staging */}
      <section id="demo" className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Home Staging Virtuel</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transformez une pièce vide en un intérieur meublé et décoré
            </p>
          </div>

          <Card className="overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="relative w-full h-[400px] bg-gray-100">
                {/* Image de fond */}
                <img 
                  src="/after-furnished-room.jpg" 
                  alt="Pièce vide"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Image superposée avec clip */}
                <div 
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - beforeAfterSlider}% 0 0)` }}
                >
                  <img 
                    src="/before-empty-room.jpg" 
                    alt="Pièce meublée"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Curseur */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                  style={{ left: `${beforeAfterSlider}%` }}
                  onMouseDown={(e) => {
                    const container = e.currentTarget.parentElement
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      if (!container) return
                      const rect = container.getBoundingClientRect()
                      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width))
                      setBeforeAfterSlider((x / rect.width) * 100)
                    }
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove)
                      document.removeEventListener('mouseup', handleMouseUp)
                    }
                    document.addEventListener('mousemove', handleMouseMove)
                    document.addEventListener('mouseup', handleMouseUp)
                  }}
                  onTouchStart={(e) => {
                    const container = e.currentTarget.parentElement
                    const handleTouchMove = (moveEvent: TouchEvent) => {
                      if (!container) return
                      const rect = container.getBoundingClientRect()
                      const x = Math.max(0, Math.min(moveEvent.touches[0].clientX - rect.left, rect.width))
                      setBeforeAfterSlider((x / rect.width) * 100)
                    }
                    const handleTouchEnd = () => {
                      document.removeEventListener('touchmove', handleTouchMove)
                      document.removeEventListener('touchend', handleTouchEnd)
                    }
                    document.addEventListener('touchmove', handleTouchMove)
                    document.addEventListener('touchend', handleTouchEnd)
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
                    <div className="flex gap-1">
                      <ChevronLeft className="h-4 w-4 text-gray-700" />
                      <ChevronRight className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                  Avant
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                  Après
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
              <Link href="#pricing">
              <Button size="lg">
                Essayer le Home Staging
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Before/After Demo Section - Rénovation */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Visualisation de Rénovation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Projetez-vous dans votre bien rénové avant même de commencer les travaux
            </p>
          </div>

          <Card className="overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="relative w-full h-[400px] bg-gray-100">
                {/* Image de fond */}
                <img 
                  src="/renove-after.jpg" 
                  alt="Pièce rénovée"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Image superposée avec clip */}
                <div 
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - renovationSlider}% 0 0)` }}
                >
                  <img 
                    src="/renove.jpg" 
                    alt="Pièce avant rénovation"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Curseur */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-xl z-[20]"
                  style={{ left: `${renovationSlider}%` }}
                  onMouseDown={(e) => {
                    const container = e.currentTarget.parentElement
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      if (!container) return
                      const rect = container.getBoundingClientRect()
                      const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width))
                      setRenovationSlider((x / rect.width) * 100)
                    }
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove)
                      document.removeEventListener('mouseup', handleMouseUp)
                    }
                    document.addEventListener('mousemove', handleMouseMove)
                    document.addEventListener('mouseup', handleMouseUp)
                  }}
                  onTouchStart={(e) => {
                    const container = e.currentTarget.parentElement
                    const handleTouchMove = (moveEvent: TouchEvent) => {
                      if (!container) return
                      const rect = container.getBoundingClientRect()
                      const x = Math.max(0, Math.min(moveEvent.touches[0].clientX - rect.left, rect.width))
                      setRenovationSlider((x / rect.width) * 100)
                    }
                    const handleTouchEnd = () => {
                      document.removeEventListener('touchmove', handleTouchMove)
                      document.removeEventListener('touchend', handleTouchEnd)
                    }
                    document.addEventListener('touchmove', handleTouchMove)
                    document.addEventListener('touchend', handleTouchEnd)
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
                    <div className="flex gap-1">
                      <ChevronLeft className="h-4 w-4 text-gray-700" />
                      <ChevronRight className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium z-[10]">
                  Avant
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium z-[10]">
                  Après
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
              <Link href="#pricing">
              <Button size="lg" variant="outline">
                Visualiser ma rénovation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Pourquoi choisir Brandsnap ?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
              La solution complète pour valoriser vos biens immobiliers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Gagnez du temps</h3>
                <p className="text-muted-foreground">
                  Transformez vos photos en quelques secondes au lieu de faire appel à un décorateur.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Augmentez vos ventes</h3>
                <p className="text-muted-foreground">
                  Des visuels attractifs = plus de visites. Jusqu'à 40% de visites en plus.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Simple et rapide</h3>
                <p className="text-muted-foreground">
                  Aucune compétence technique requise. Uploadez, décrivez, c'est prêt !
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Comment ça marche ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trois étapes simples pour transformer vos photos.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-400 text-black rounded-full mx-auto flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-green-400 mx-auto" />
                  <h3 className="text-xl font-semibold">Uploadez vos photos</h3>
                  <p className="text-muted-foreground">Glissez-déposez les photos de vos pièces vides.</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-400 text-black rounded-full mx-auto flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="space-y-2">
                  <MessageSquare className="w-8 h-8 text-green-400 mx-auto" />
                  <h3 className="text-xl font-semibold">Décrivez le style</h3>
                  <p className="text-muted-foreground">Ex: &quot;Salon moderne avec canapé gris et plantes&quot;</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-400 text-black rounded-full mx-auto flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="space-y-2">
                  <Download className="w-8 h-8 text-green-400 mx-auto" />
                  <h3 className="text-xl font-semibold">Téléchargez</h3>
                  <p className="text-muted-foreground">Votre photo transformée est prête à publier.</p>
                </div>
              </div>
            </div>
            
            {/* Home Icon - Centered below steps */}
            <div className="text-center py-8">
              <Home className="w-32 h-32 text-green-400 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Home Staging Virtuel IA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Tarifs transparents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Plans flexibles adaptés à vos besoins, de l'indépendant aux grands réseaux.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-green-400/40">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Starter</h3>
                  <span className="bg-green-400/10 text-green-400 px-2 py-1 rounded text-xs font-medium">
                    Populaire
                  </span>
                </div>
                <div className="text-4xl font-bold">29€<span className="text-lg text-muted-foreground">/mois</span></div>
                <p className="text-muted-foreground">Pour débuter</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">30 transformations/mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Résolution 4K</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Support email</span>
                  </li>
                </ul>
                <PricingButton 
                  priceId={process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_1SGNchDS5DrKB4SxrahLyTQb'}
                  label="Commencer"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">Professional</h3>
                <div className="text-4xl font-bold">49€<span className="text-lg text-muted-foreground">/mois</span></div>
                <p className="text-muted-foreground">Pour les agences</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">100 transformations/mois</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Résolution 4K</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Support prioritaire</span>
                  </li>
                </ul>
                <PricingButton 
                  priceId={process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID || 'price_1SGPWYDS5DrKB4SxqyQrEADN'}
                  label="Commencer"
                  variant="outline"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <div className="text-4xl font-bold">Sur mesure</div>
                <p className="text-muted-foreground">Pour les grands réseaux</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Transformations illimitées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Formation personnalisée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Support dédié 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Intégration personnalisée</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Nous contacter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="border-green-400/40 bg-green-400/10">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Prêt à transformer vos annonces ?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Rejoignez des centaines d&apos;agences immobilières qui utilisent Brandsnap pour valoriser leurs biens.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AuthButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Questions fréquentes</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Ai-je besoin de compétences en design ?</h3>
                <p className="text-muted-foreground">Non. Uploadez vos photos et décrivez le style souhaité—Brandsnap s'occupe du reste.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Quels types de pièces puis-je transformer ?</h3>
                <p className="text-muted-foreground">Toutes les pièces : salon, chambre, cuisine, salle de bain, bureau, etc.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Combien de temps prend une transformation ?</h3>
                <p className="text-muted-foreground">En moyenne 10-30 secondes pour obtenir votre photo transformée.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Puis-je utiliser les images pour mes annonces ?</h3>
                <p className="text-muted-foreground">Oui, toutes les images générées sont libres de droits pour un usage commercial.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <Separator className="mb-8" />
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-8">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center gap-4">
              <img src="/logoa.png" alt="Brandsnap" className="h-16 w-16" />
              <span className="text-4xl font-bold">Brandsnap</span>
            </div>
            
            {/* Footer Info */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Brandsnap. Home Staging Virtuel pour Agences Immobilières.
              </p>
              <div className="text-xs text-muted-foreground text-center md:text-right">
                Powered by <span className="text-green-400">Artificial Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
