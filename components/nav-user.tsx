"use client"

import * as React from 'react'
import Image from 'next/image'

export function NavUser({ user }: { user: { name: string; email: string; avatar?: string } }) {
  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-2">
      {user.avatar ? (
        <Image src={user.avatar} alt={user.name} width={28} height={28} className="rounded-full" />
      ) : (
        <div className="h-7 w-7 rounded-full bg-muted" />
      )}
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{user.name}</div>
        <div className="truncate text-xs text-muted-foreground">{user.email}</div>
      </div>
    </div>
  )
}


