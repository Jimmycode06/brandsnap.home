"use client"

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Item = { title: string; url: string; icon?: React.ComponentType<{ className?: string }> }

export function NavSecondary({ items, className }: { items: Item[]; className?: string }) {
  return (
    <div className={cn('mt-2', className)}>
      <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">More</div>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.title}>
              <Link
                href={item.url}
                className={cn('flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted text-muted-foreground')}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{item.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


