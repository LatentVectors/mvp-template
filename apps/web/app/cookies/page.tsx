import type { Metadata } from 'next'
import React from 'react'
import { allLegalPages } from '.contentlayer/generated'
import LegalPageTemplate from '@/components/legal/LegalPageTemplate'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Cookie Policy',
  description:
    'Learn about how MVP Template uses cookies and similar technologies to enhance your browsing experience and analyze website usage.',
  keywords: [
    'cookie policy',
    'cookies',
    'tracking',
    'privacy',
    'web analytics',
    'GDPR compliance',
  ],
  pathname: '/cookies',
  imageType: 'legal',
})

export default function CookiePage() {
  const page = allLegalPages.find(p => p.slug === 'cookies')

  if (!page) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-12">
        Page not found
      </main>
    )
  }

  return <LegalPageTemplate page={page} />
}
