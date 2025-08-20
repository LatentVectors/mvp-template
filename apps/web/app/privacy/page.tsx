import type { Metadata } from 'next'
import React from 'react'
import { allLegalPages } from '.contentlayer/generated'
import LegalPageTemplate from '@/components/legal/LegalPageTemplate'

export const metadata: Metadata = {
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
  authors: [{ name: 'MVP Template Team' }],
  creator: 'MVP Template',
  publisher: 'MVP Template',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy - MVP Template',
    description:
      'Learn how MVP Template collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights.',
    type: 'website',
    url: '/privacy',
    siteName: 'MVP Template',
    images: [
      {
        url: '/api/og?title=Privacy Policy&type=legal',
        width: 1200,
        height: 630,
        alt: 'MVP Template Privacy Policy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - MVP Template',
    description:
      'Learn how MVP Template collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights.',
    images: ['/api/og?title=Privacy Policy&type=legal'],
    creator: '@mvptemplate',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

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
