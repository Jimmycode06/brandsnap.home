"use client"

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type Item = {
  title: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  isActive?: boolean
  items?: { title: string; url: string }[]
}

export function NavMain({ items }: { items: Item[] }) {
  const pathname = usePathname()
  return (
    <div>
      <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">Main</div>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = item.isActive ?? pathname === item.url
          return (
            <li key={item.title}>
              <a
                href={item.url}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted',
                  active ? 'bg-muted text-foreground' : 'text-muted-foreground',
                )}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{item.title}</span>
              </a>
              {item.items && item.items.length > 0 && (
                <ul className="mt-1 ml-6 space-y-1">
                  {item.items.map((sub) => (
                    <li key={sub.title}>
                      <a
                        href={sub.url}
                        className={cn('block rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted')}
                      >
                        {sub.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}


