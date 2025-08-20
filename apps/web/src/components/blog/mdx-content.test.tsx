import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { MDXContent } from './mdx-content'

// Mock next-contentlayer2 hook to return a simple component that uses provided components mapping
type PreComponent = (props: {
  className?: string
  children?: React.ReactNode
}) => React.ReactElement

vi.mock('next-contentlayer2/hooks', () => ({
  useMDXComponent: () => (props: { components: { pre: PreComponent } }) => {
    const Pre = props.components.pre
    return (
      <div>
        <Pre className="language-tsx">let x = 1</Pre>
      </div>
    )
  },
}))

describe('MDXContent', () => {
  it('renders MDX using custom CodeBlock for pre elements', () => {
    render(<MDXContent code="dummy" />)

    // CodeBlock renders a language label derived from the className
    expect(screen.getByText('tsx')).toBeInTheDocument()
    expect(screen.getByText('let x = 1')).toBeInTheDocument()
  })
})
