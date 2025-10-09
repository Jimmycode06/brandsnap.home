'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Zap, TrendingUp, Clock } from 'lucide-react'
import { PricingButton } from '@/components/pricing-button'

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logoa.png" alt="Brandsnap Home Staging" className="h-8 w-8" />
            <span className="text-lg font-semibold">Brandsnap Home Staging</span>
          </Link>
          <Link href="/home-staging">
            <Button variant="outline" size="sm">
              Retour au générateur
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold">
              Upgrade vers le{' '}
              <span className="text-green-400">Professional</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Vous avez épuisé vos crédits Starter. Passez au plan Professional pour 
              <strong> 100 transformations par mois</strong> et continuez à créer des visuels exceptionnels.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Upgrade instantané • Pas d'interruption de service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Comparez les plans</h2>
            <p className="text-muted-foreground">
              Découvrez pourquoi le plan Professional est parfait pour vous
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Starter */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-500">Starter</h3>
                    <div className="text-3xl font-bold text-gray-500">29€<span className="text-lg text-muted-foreground">/mois</span></div>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500">30 transformations/mois</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500">Résolution 4K</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500">Support email</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 text-center">
                      Plan actuel
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Professional */}
            <Card className="border-green-400/40 bg-green-400/5 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-green-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommandé
                </span>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">Professional</h3>
                    <div className="text-3xl font-bold">49€<span className="text-lg text-muted-foreground">/mois</span></div>
                    <p className="text-sm text-green-600 font-medium">+20€ pour 3x plus de transformations</p>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm"><strong>100 transformations/mois</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Résolution 4K</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm"><strong>Support prioritaire</strong></span>
                    </li>
                  </ul>

                  <div className="pt-4">
                    <PricingButton 
                      priceId={process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID || 'price_1SGPWYDS5DrKB4SxqyQrEADN'}
                      label="Upgrade maintenant"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Pourquoi upgrade vers Professional ?</h2>
            <p className="text-muted-foreground">
              Plus de transformations, plus de possibilités
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">3x plus de transformations</h3>
                <p className="text-muted-foreground">
                  Passez de 30 à 100 transformations par mois pour répondre à tous vos besoins.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Support prioritaire</h3>
                <p className="text-muted-foreground">
                  Obtenez une assistance rapide et dédiée pour vos projets importants.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Upgrade instantané</h3>
                <p className="text-muted-foreground">
                  Accédez immédiatement à vos nouveaux crédits après le paiement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Prêt à passer au niveau supérieur ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Rejoignez des centaines d'agences qui utilisent le plan Professional 
              pour maximiser leur productivité et leurs ventes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PricingButton 
                priceId={process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID || 'price_1SGPWYDS5DrKB4SxqyQrEADN'}
                label="Upgrade vers Professional"
              />
              <Link href="/home-staging">
                <Button variant="outline" size="lg">
                  Retour au générateur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <img src="/logoa.png" alt="Brandsnap" className="h-6 w-6" />
            <span>Brandsnap Home Staging</span>
            <span>•</span>
            <span>Powered by <span className="text-green-400">Artificial Intelligence</span></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
