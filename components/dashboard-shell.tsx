"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Menu, 
  Search, 
  Wand2, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react'

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BaoraHome</span>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-2">
              <h3 className="px-2 text-sm font-semibold text-muted-foreground">
                Générateur
              </h3>
              <nav className="space-y-1">
                <Button
                  variant="secondary"
                  className="w-full justify-start gap-2"
                  size="sm"
                >
                  <Wand2 className="h-4 w-4" />
                  Générateur Marketing
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex-1" />

            {/* Search bar (decorative) */}
            <div className="flex items-center space-x-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Rechercher..."
                  className="w-64 rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
