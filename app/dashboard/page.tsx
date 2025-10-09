import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Wand2,
  Zap,
  Palette
} from 'lucide-react'

export default function DashboardPage() {
  const generators = [
    {
      title: "Generator Image AI",
      description: "Create stunning marketing images with AI",
      icon: <Wand2 className="h-6 w-6 text-green-500" />,
      href: "/home-staging",
      cost: "10 ⚡",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Image Dream",
      description: "Transform your ideas into dream-like images",
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      href: "/image-dream",
      cost: "10 ⚡",
      gradient: "from-purple-500 to-violet-500"
    },
    {
      title: "Video Kling v2.5 turbo",
      description: "Convert images to videos with Kling AI",
      icon: <Video className="h-6 w-6 text-blue-500" />,
      href: "/video-kling",
      cost: "50 ⚡",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Generator Video AI",
      description: "Create videos with Google's Veo 3 Fast",
      icon: <Video className="h-6 w-6 text-blue-500" />,
      href: "/home-staging",
      cost: "50 ⚡",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Video LTXV",
      description: "Generate cinematic videos from text",
      icon: <Video className="h-6 w-6 text-orange-500" />,
      href: "/video-ltxv",
      cost: "30 ⚡",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader title="Dashboard" />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Welcome to Brandsnap Studio</h2>
              <p className="text-muted-foreground">Choose a generator to start creating amazing content with AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generators.map((generator, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {generator.icon}
                        <div>
                          <CardTitle className="text-lg">{generator.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {generator.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                        {generator.cost}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className={`w-full bg-gradient-to-r ${generator.gradient} hover:opacity-90`}>
                      <Link href={generator.href}>
                        Start Creating
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-green-500" />
                <h3 className="text-xl font-semibold">Need more credits?</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Each generation costs credits. Make sure you have enough to create amazing content.
              </p>
              <Button className="bg-green-500 hover:bg-green-600">
                <Palette className="h-4 w-4 mr-2" />
                Get More Credits
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}