'use client'

import React, { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  children: ReactNode
  className?: string
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const language = className?.replace('language-', '') || 'text'

  return (
    <div className="relative">
      <div className="bg-muted flex items-center justify-between rounded-t-lg px-4 py-2 text-sm">
        <span className="text-muted-foreground">{language}</span>
      </div>
      <pre
        className={cn(
          'bg-muted overflow-x-auto rounded-b-lg p-4 text-sm',
          className
        )}
        {...props}
      >
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}
