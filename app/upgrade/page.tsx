'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Zap, TrendingUp, Clock, Sparkles, Crown } from 'lucide-react'
import { PricingButton } from '@/components/pricing-button'

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
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
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-blue-400/10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
        
        <div className="container max-w-6xl mx-auto px-4 text-center relative">
          <div className="space-y-8">
            {/* Icon with glow effect */}
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-green-400/25">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400/30 to-blue-500/30 rounded-2xl blur-xl"></div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-blue-600 bg-clip-text text-transparent">
                Upgrade vers le{' '}
                <span className="relative">
                  Professional
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400" />
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Vous avez épuisé vos crédits Starter. Passez au plan Professional pour 
                <span className="font-semibold text-green-600 dark:text-green-400"> 100 transformations par mois</span> 
                {' '}et continuez à créer des visuels exceptionnels.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-full px-6 py-3 border border-green-200 dark:border-green-800">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Upgrade instantané • Pas d'interruption de service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Comparez les plans
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez pourquoi le plan Professional est parfait pour vous
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plan Starter */}
            <Card className="border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400">Starter</h3>
                    <div className="text-4xl font-bold text-gray-500 dark:text-gray-400 mt-2">
                      29€<span className="text-lg text-muted-foreground">/mois</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">30 transformations/mois</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Résolution 4K</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Support email</span>
                    </li>
                  </ul>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Plan actuel
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Professional */}
            <Card className="border-2 border-green-400/60 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-lg blur-sm"></div>
              
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                  <Crown className="h-4 w-4 inline mr-1" />
                  Recommandé
                </div>
              </div>
              
              <CardContent className="p-8 relative">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">Professional</h3>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">
                      49€<span className="text-lg text-muted-foreground">/mois</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2 bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1 inline-block">
                      +20€ pour 3x plus de transformations
                    </p>
                  </div>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                        100 transformations/mois
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">Résolution 4K</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Support prioritaire
                      </span>
                    </li>
                  </ul>

                  <div className="pt-6">
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
      <section className="py-20 bg-gradient-to-br from-green-50/50 via-white to-blue-50/50 dark:from-green-950/10 dark:via-background dark:to-blue-950/10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Pourquoi upgrade vers Professional ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plus de transformations, plus de possibilités
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-green-200/50 dark:border-green-800/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300">3x plus de transformations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Passez de 30 à 100 transformations par mois pour répondre à tous vos besoins.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">Support prioritaire</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Obtenez une assistance rapide et dédiée pour vos projets importants.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">Upgrade instantané</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Accédez immédiatement à vos nouveaux crédits après le paiement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
        
        <div className="container max-w-5xl mx-auto px-4 text-center relative">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Prêt à passer au niveau supérieur ?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Rejoignez des centaines d'agences qui utilisent le plan Professional 
                pour maximiser leur productivité et leurs ventes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <PricingButton 
                  priceId={process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID || 'price_1SGPWYDS5DrKB4SxqyQrEADN'}
                  label="Upgrade vers Professional"
                />
              </div>
              <Link href="/home-staging">
                <Button variant="outline" size="lg" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-700">
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
