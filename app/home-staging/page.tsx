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

export default function Page() {
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


