import * as React from "react"
import Link from "next/link"
import { LayoutDashboard, Home as HomeIcon } from "lucide-react"

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex h-12 items-center gap-1.5 px-2">
          <img src="/logob.png" alt="BaoraHome" className="h-8 w-8" />
          <span className="text-lg font-semibold">BaoraHome</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link href="/home-staging">
                <HomeIcon className="mr-2 h-4 w-4" />
                Home Staging
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Transformations
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
