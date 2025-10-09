"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  const handleHomeClick = () => {
    try {
      console.log('Navigating to home page...')
      router.push('/');
      // Fallback hard navigation if client routing is blocked
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location.pathname !== '/') {
          window.location.href = '/'
        }
      }, 50)
    } catch (e) {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex h-12 items-center gap-1.5 px-2">
          <img src="/logoa.png" alt="Brandsnap" className="h-8 w-8" />
          <span className="text-lg font-semibold">Brandsnap</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <button 
              onClick={handleHomeClick}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-muted rounded-md text-left"
            >
              <Home className="h-4 w-4" />
              Accueil
            </button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link href="/home-staging">Home Staging Virtuel</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-center p-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

