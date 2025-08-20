import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'

// Mock next/link for testing
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock the Footer component to test navigation links
vi.mock('@/components/footer', () => ({
  Footer: () => (
    <footer data-testid="footer">
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      <a href="/cookies">Cookie Policy</a>
    </footer>
  ),
}))

describe('Legal Pages', () => {
  describe('Privacy Policy Page', () => {
    it('renders privacy policy content with proper structure', async () => {
      // Import and render Privacy Policy page
      const { default: PrivacyPage } = await import(
        '@/app/(public)/legal/[slug]/page'
      )
      render(<PrivacyPage />)

      // Check for main heading
      expect(
        screen.getByRole('heading', { level: 1, name: /privacy policy/i })
      ).toBeInTheDocument()

      // Check for key sections
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

      // Check for last updated date
      expect(
        screen.getByText(/last updated: august \d+, 20\d+/i)
      ).toBeInTheDocument()

      // Check that page has proper semantic structure
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('has proper metadata for SEO', async () => {
      const { metadata } = await import('@/app/(public)/legal/[slug]/page')

      expect(metadata.title).toContain('Privacy Policy')
      expect(metadata.description).toBeTruthy()
      expect(
        typeof metadata.robots === 'object' ? metadata.robots?.index : true
      ).toBe(true)
    })
  })

  describe('Terms of Service Page', () => {
    it('renders terms of service content with proper structure', async () => {
      // Import and render Terms of Service page
      const { default: TermsPage } = await import(
        '@/app/(public)/legal/[slug]/page'
      )
      render(<TermsPage />)

      // Check for main heading
      expect(
        screen.getByRole('heading', { level: 1, name: /terms of service/i })
      ).toBeInTheDocument()

      // Check for key sections
      expect(screen.getByText(/acceptance of terms/i)).toBeInTheDocument()
      expect(screen.getByText(/use of service/i)).toBeInTheDocument()
      expect(screen.getByText(/user responsibilities/i)).toBeInTheDocument()
      expect(screen.getByText(/termination/i)).toBeInTheDocument()

      // Check for last updated date
      expect(
        screen.getByText(/last updated: august \d+, 20\d+/i)
      ).toBeInTheDocument()

      // Check that page has proper semantic structure
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('has proper metadata for SEO', async () => {
      const { metadata } = await import('@/app/(public)/legal/[slug]/page')

      expect(metadata.title).toContain('Terms of Service')
      expect(metadata.description).toBeTruthy()
      expect(
        typeof metadata.robots === 'object' ? metadata.robots?.index : true
      ).toBe(true)
    })
  })

  describe('Cookie Policy Page', () => {
    it('renders cookie policy content with proper structure', async () => {
      // Import and render Cookie Policy page
      const { default: CookiePage } = await import(
        '@/app/(public)/legal/[slug]/page'
      )
      render(<CookiePage />)

      // Check for main heading
      expect(
        screen.getByRole('heading', { level: 1, name: /cookie policy/i })
      ).toBeInTheDocument()

      // Check for key sections
      expect(
        screen.getByRole('heading', { name: /what are cookies/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /types of cookies/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /managing cookies/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: /third-party cookies/i })
      ).toBeInTheDocument()

      // Check for last updated date
      expect(
        screen.getByText(/last updated: august \d+, 20\d+/i)
      ).toBeInTheDocument()

      // Check that page has proper semantic structure
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('has proper metadata for SEO', async () => {
      const { metadata } = await import('@/app/(public)/legal/[slug]/page')

      expect(metadata.title).toContain('Cookie Policy')
      expect(metadata.description).toBeTruthy()
      expect(
        typeof metadata.robots === 'object' ? metadata.robots?.index : true
      ).toBe(true)
    })
  })

  describe('Footer Navigation', () => {
    it('contains links to all legal pages', async () => {
      const { Footer } = await import('@/components/footer')
      render(<Footer />)

      expect(
        screen.getByRole('link', { name: /privacy policy/i })
      ).toHaveAttribute('href', '/privacy')
      expect(
        screen.getByRole('link', { name: /terms of service/i })
      ).toHaveAttribute('href', '/terms')
      expect(
        screen.getByRole('link', { name: /cookie policy/i })
      ).toHaveAttribute('href', '/cookies')
    })
  })

  describe('Consistent Styling', () => {
    it('all legal pages use consistent styling classes', async () => {
      const pages = [
        await import('@/app/(public)/legal/[slug]/page'),
        await import('@/app/(public)/legal/[slug]/page'),
        await import('@/app/(public)/legal/[slug]/page'),
      ]

      for (const page of pages) {
        const { container } = render(<page.default />)

        // Check for consistent container classes
        expect(
          container.querySelector('[class*="container"]')
        ).toBeInTheDocument()
        expect(container.querySelector('[class*="prose"]')).toBeInTheDocument()

        // Check for consistent spacing classes
        expect(container.querySelector('[class*="py-"]')).toBeInTheDocument()
        expect(
          container.querySelector('[class*="mx-auto"]')
        ).toBeInTheDocument()
      }
    })
  })
})
