"use client"

import * as React from 'react'
import Link from 'next/link'

type Project = { name: string; url: string; icon?: React.ComponentType<{ className?: string }> }

export function NavProjects({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-3">
      <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">Projects</div>
      <ul className="space-y-1">
        {projects.map((p) => {
          const Icon = p.icon
          return (
            <li key={p.name}>
              <Link href={p.url} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted">
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{p.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


