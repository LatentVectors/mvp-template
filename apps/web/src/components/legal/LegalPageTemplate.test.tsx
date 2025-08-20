import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LegalPageTemplate from '@/components/legal/LegalPageTemplate'
import type { LegalPage } from '.contentlayer/generated'

// Mock date-fns format to keep output deterministic
vi.mock('date-fns', () => ({
  format: vi.fn(() => 'August 12, 2024'),
}))

describe('LegalPageTemplate', () => {
  const basePage: LegalPage = {
    _id: 'content/legal/privacy.md',
    _raw: {
      sourceFilePath: 'legal/privacy.md',
      sourceFileName: 'privacy.md',
      sourceFileDir: 'legal',
      contentType: 'markdown',
      flattenedPath: 'legal/privacy',
    },
    type: 'LegalPage',
    title: 'Privacy Policy',
    slug: 'privacy',
    lastUpdated: '2024-08-12',
    url: '/privacy',
    body: {
      html: '<h2>Information we collect</h2>',
      raw: '## Information we collect',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title, last updated, and body HTML', () => {
    render(<LegalPageTemplate page={basePage} />)

    expect(
      screen.getByRole('heading', { level: 1, name: /privacy policy/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/last updated:\s*august 12, 2024/i)
    ).toBeInTheDocument()

    // Body HTML rendered
    expect(
      screen.getByRole('heading', { level: 2, name: /information we collect/i })
    ).toBeInTheDocument()
  })

  it('applies consistent container and prose classes', () => {
    const { container } = render(<LegalPageTemplate page={basePage} />)
    expect(container.querySelector('[class*="container"]')).toBeInTheDocument()
    expect(container.querySelector('[class*="prose"]')).toBeInTheDocument()
    expect(container.querySelector('[class*="mx-auto"]')).toBeInTheDocument()
    expect(container.querySelector('[class*="py-"]')).toBeInTheDocument()
  })
})
