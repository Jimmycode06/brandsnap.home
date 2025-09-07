"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

type Team = { name: string; logo: React.ComponentType<{ className?: string }>; plan: string }

export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const [current, setCurrent] = React.useState(0)
  const ActiveLogo = teams[current]?.logo
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-2">
      {ActiveLogo ? <ActiveLogo className="h-5 w-5" /> : null}
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{teams[current]?.name}</div>
        <div className="truncate text-xs text-muted-foreground">{teams[current]?.plan}</div>
      </div>
      <div className="ml-auto flex gap-1">
        {teams.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Switch to team ${idx + 1}`}
            onClick={() => setCurrent(idx)}
            className={cn('h-2 w-2 rounded-full', idx === current ? 'bg-foreground' : 'bg-muted')}
          />
        ))}
      </div>
    </div>
  )
}


