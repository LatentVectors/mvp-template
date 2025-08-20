import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { TableOfContents } from './table-of-contents'

describe('TableOfContents', () => {
  beforeEach(() => {
    // Mock DOM methods used by TableOfContents
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
      }))
    )

    // Mock document.querySelectorAll to return empty array by default
    vi.spyOn(document, 'querySelectorAll').mockReturnValue(
      [] as unknown as NodeListOf<Element>
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders nothing when no headings found', () => {
    const { container } = render(<TableOfContents />)
    expect(container.firstChild).toBeNull()
  })

  it('applies custom className when provided', () => {
    // Mock some headings for this test
    const mockHeadings = [
      { id: 'heading-1', textContent: 'Heading 1', tagName: 'H1' },
    ]
    vi.spyOn(document, 'querySelectorAll').mockReturnValue(
      mockHeadings as unknown as NodeListOf<Element>
    )

    render(<TableOfContents className="custom-class" />)

    expect(screen.getByRole('navigation')).toHaveClass('custom-class')
  })
})
