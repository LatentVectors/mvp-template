'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract headings from the page
    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    )
      .filter(heading => heading.id)
      .map(heading => ({
        id: heading.id,
        title: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      }))

    setToc(headings)

    // Set up intersection observer to track active heading
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    )

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  if (toc.length === 0) {
    return null
  }

  return (
    <nav className={cn('space-y-2', className)}>
      <h3 className="text-foreground font-semibold">Table of Contents</h3>
      <ul className="space-y-2 text-sm">
        {toc.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'hover:text-foreground block py-1 transition-colors',
                {
                  'text-primary font-medium': activeId === item.id,
                  'text-muted-foreground': activeId !== item.id,
                },
                {
                  'pl-0': item.level === 1,
                  'pl-4': item.level === 2,
                  'pl-8': item.level === 3,
                  'pl-12': item.level >= 4,
                }
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
