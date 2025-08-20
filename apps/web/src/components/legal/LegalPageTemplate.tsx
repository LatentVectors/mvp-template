import React from 'react'
import type { LegalPage } from '.contentlayer/generated'
import { format } from 'date-fns'

interface LegalPageTemplateProps {
  page: LegalPage
}

export default function LegalPageTemplate({ page }: LegalPageTemplateProps) {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          {page.title}
        </h1>

        <p className="text-muted-foreground mb-8 text-lg">
          Last updated: {format(new Date(page.lastUpdated), 'MMMM d, yyyy')}
        </p>

        <div
          className="space-y-8"
          dangerouslySetInnerHTML={{ __html: page.body.html }}
        />
      </div>
    </main>
  )
}
