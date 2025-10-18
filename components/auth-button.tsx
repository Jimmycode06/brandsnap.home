'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

export function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const router = useRouter()

  // Note: no auto-redirect on mount to avoid bouncing away from the homepage

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (!user) {
    return (
      <Button onClick={signInWithGoogle} size="lg" className="bg-blue-500 hover:bg-blue-600 px-8 py-4 text-base font-bold">
        Commencer
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          {user.email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push('/home-staging')}>
          <User className="h-4 w-4 mr-2" />
          Générateur
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
