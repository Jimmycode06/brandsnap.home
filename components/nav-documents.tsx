"use client"

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Doc = { name: string; url: string; icon?: React.ComponentType<{ className?: string }> }

export function NavDocuments({ items }: { items: Doc[] }) {
  return (
    <div className="mt-2">
      <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">Documents</div>
      <ul className="space-y-1">
        {items.map((doc) => {
          const Icon = doc.icon
          return (
            <li key={doc.name}>
              <Link
                href={doc.url}
                className={cn('flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted text-muted-foreground')}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{doc.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


