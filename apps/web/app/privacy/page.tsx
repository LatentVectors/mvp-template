import type { Metadata } from 'next'
import React from 'react'
import { allLegalPages } from '.contentlayer/generated'
import LegalPageTemplate from '@/components/legal/LegalPageTemplate'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'Learn how MVP Template collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights.',
  keywords: [
    'privacy policy',
    'data protection',
    'GDPR',
    'privacy rights',
    'personal information',
  ],
  pathname: '/privacy',
  imageType: 'legal',
})

export default function PrivacyPage() {
  const page = allLegalPages.find(p => p.slug === 'privacy')

  if (!page) {
    return (
      <main className="container mx-auto max-w-4xl px-4 py-12">
        Page not found
      </main>
    )
  }

  return <LegalPageTemplate page={page} />
}
