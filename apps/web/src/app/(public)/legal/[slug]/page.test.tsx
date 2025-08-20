// import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LegalPage, {
  generateMetadata,
  generateStaticParams,
} from '@/app/(public)/legal/[slug]/page'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

// Provide a minimal contentlayer dataset for tests
vi.mock('.contentlayer/generated', () => ({
  allLegalPages: [
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      description: 'Our privacy policy',
      lastUpdated: '2024-08-01',
      body: {
        html: `
          <h2>Information we collect</h2>
          <h2>How we use information</h2>
          <h2>Data protection</h2>
          <h2>Contact us</h2>
        `,
      },
    },
    {
      slug: 'terms',
      title: 'Terms of Service',
      description: 'Our terms of service',
      lastUpdated: '2024-08-02',
      body: {
        html: `
          <h2>Acceptance of terms</h2>
          <h2>Use of service</h2>
          <h2>User responsibilities</h2>
          <h2>Termination</h2>
        `,
      },
    },
    {
      slug: 'cookies',
      title: 'Cookie Policy',
      description: 'Our cookie policy',
      lastUpdated: '2024-08-03',
      body: {
        html: `
          <h2>What are cookies</h2>
          <h2>Types of cookies</h2>
          <h2>Managing cookies</h2>
          <h2>Third-party cookies</h2>
        `,
      },
    },
  ],
}))

describe('Legal dynamic page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the privacy policy page with expected sections', async () => {
    const params = Promise.resolve({ slug: 'privacy' })
    render(await LegalPage({ params }))

    expect(
      screen.getByRole('heading', { level: 1, name: /privacy policy/i })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /information we collect/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /how we use information/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /data protection/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /contact us/i })
    ).toBeInTheDocument()
  })

  it('calls notFound for a missing page', async () => {
    const { notFound } = await import('next/navigation')
    // Calling with a slug that is not in our mocked dataset
    try {
      await LegalPage({ params: Promise.resolve({ slug: 'missing' }) })
    } catch (_error) {}
    expect(notFound).toHaveBeenCalled()
  })

  it('generateMetadata builds correct metadata for a legal page', async () => {
    const md = await generateMetadata({
      params: Promise.resolve({ slug: 'terms' }),
    } as unknown as { params: Promise<{ slug: string }> })

    expect(md.title).toContain('Terms of Service')
    expect(md.description).toBeTruthy()
    // Basic OpenGraph/Twitter presence is handled in pageMetadata
    expect(md.openGraph).toBeDefined()
    expect(md.twitter).toBeDefined()
  })

  it('generateStaticParams exposes all slugs', async () => {
    const params = await generateStaticParams()
    expect(params).toEqual(
      expect.arrayContaining([
        { slug: 'privacy' },
        { slug: 'terms' },
        { slug: 'cookies' },
      ])
    )
  })
})
