import type { Metadata } from 'next'
import React from 'react'
import { allLegalPages } from '.contentlayer/generated'
import LegalPageTemplate from '@/components/legal/LegalPageTemplate'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'Read the terms and conditions for using MVP Template services. Understand your rights and responsibilities as a user.',
  keywords: [
    'terms of service',
    'user agreement',
    'terms and conditions',
    'legal terms',
    'service agreement',
  ],
  pathname: '/terms',
  imageType: 'legal',
})

export default function TermsPage() {
  const page = allLegalPages.find(p => p.slug === 'terms')

  if (!page) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-12">
        Page not found
      </main>
    )
  }

  return <LegalPageTemplate page={page} />
}
