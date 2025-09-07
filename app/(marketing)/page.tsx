import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Zap, 
  Palette, 
  Crop, 
  Upload, 
  MessageSquare, 
  Download,
  ChevronDown 
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logoa.png" alt="Brandsnap" className="h-8 w-8" />
            <span className="text-lg font-semibold">Brandsnap</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Showcase
            </Link>
            <Button asChild className="bg-green-500 hover:bg-green-600">
              <Link href="/generator">Open Studio</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Generate stunning ad creatives in{' '}
                <span className="text-green-400">seconds</span> with AI.
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload your logo and screenshots. Describe your idea. Brandsnap turns it into a polished ad—instantly.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-green-500 hover:bg-green-600">
                <Link href="/generator">Open Studio</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#showcase">Watch demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why choose Brandsnap?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create professional ad creatives without design skills or expensive tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Fast</h3>
                <p className="text-muted-foreground">From idea to ad in seconds.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <Palette className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Brand-aware</h3>
                <p className="text-muted-foreground">Blend your logo, colors, and screenshots.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="w-12 h-12 bg-green-400/10 rounded-lg mx-auto flex items-center justify-center">
                  <Crop className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Multi-format</h3>
                <p className="text-muted-foreground">Instagram, Story, Facebook—ready to post.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to create your perfect ad creative.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-400 text-black rounded-full mx-auto flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-green-400 mx-auto" />
                <h3 className="text-xl font-semibold">Upload assets</h3>
                <p className="text-muted-foreground">Add your logo, screenshots, or any media files.</p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-400 text-black rounded-full mx-auto flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="space-y-2">
                <MessageSquare className="w-8 h-8 text-green-400 mx-auto" />
                <h3 className="text-xl font-semibold">Describe your visual</h3>
                <p className="text-muted-foreground">Tell us what kind of ad you want to create.</p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-400 text-black rounded-full mx-auto flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="space-y-2">
                <Download className="w-8 h-8 text-green-400 mx-auto" />
                <h3 className="text-xl font-semibold">Generate & download</h3>
                <p className="text-muted-foreground">Get your polished ad creative ready to post.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">See what&apos;s possible</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Examples of ad creatives generated with Brandsnap.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden rounded-xl aspect-[9/16]">
              <CardContent className="p-0 h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-end">
                <div className="p-4 w-full bg-black/20 backdrop-blur-sm">
                  <p className="text-sm text-white font-medium">App ad</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden rounded-xl aspect-square">
              <CardContent className="p-0 h-full bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-end">
                <div className="p-4 w-full bg-black/20 backdrop-blur-sm">
                  <p className="text-sm text-white font-medium">E-commerce promo</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden rounded-xl aspect-[9/16]">
              <CardContent className="p-0 h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-end">
                <div className="p-4 w-full bg-black/20 backdrop-blur-sm">
                  <p className="text-sm text-white font-medium">Story ad</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden rounded-xl aspect-square">
              <CardContent className="p-0 h-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-end">
                <div className="p-4 w-full bg-black/20 backdrop-blur-sm">
                  <p className="text-sm text-white font-medium">Social media</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden rounded-xl aspect-[9/16]">
              <CardContent className="p-0 h-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-end">
                <div className="p-4 w-full bg-black/20 backdrop-blur-sm">
                  <p className="text-sm text-white font-medium">Brand campaign</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden rounded-xl aspect-square">
              <CardContent className="p-0 h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-end">
                <div className="p-4 w-full bg-black/20 backdrop-blur-sm">
                  <p className="text-sm text-white font-medium">Product launch</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="border-green-400/40 bg-green-400/10">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to create your first ad?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of creators and businesses using Brandsnap to generate stunning ad creatives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-green-500 hover:bg-green-600">
                  <Link href="/generator">Open Studio</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#">View on GitHub</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently asked questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Do I need design skills?</h3>
                <p className="text-muted-foreground">No. Upload and describe—Brandsnap handles the rest.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Which formats are supported?</h3>
                <p className="text-muted-foreground">Instagram Post, Story/Reel, Facebook Ad (more soon).</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Is Gemini required?</h3>
                <p className="text-muted-foreground">Yes—image generation uses Gemini 2.5 Flash Image.</p>
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
                © {new Date().getFullYear()} Brandsnap.
              </p>
              <div className="text-xs text-muted-foreground text-center md:text-right">
                Powered by{' '}
                <Link 
                  href="https://deepmind.google" 
                  className="text-green-400 hover:text-green-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google DeepMind Gemini 2.5
                </Link>
                {' & '}
                <Link 
                  href="https://elevenlabs.io" 
                  className="text-green-400 hover:text-green-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ElevenLabs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
