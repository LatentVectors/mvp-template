import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CodeBlock } from './code-block'

describe('CodeBlock', () => {
  it('renders code with language label', () => {
    render(
      <CodeBlock className="language-javascript">
        console.log('Hello, world!');
      </CodeBlock>
    )

    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(
      screen.getByText("console.log('Hello, world!');")
    ).toBeInTheDocument()
  })

  it('defaults to text language when no className provided', () => {
    render(<CodeBlock>Plain text content</CodeBlock>)

    expect(screen.getByText('text')).toBeInTheDocument()
    expect(screen.getByText('Plain text content')).toBeInTheDocument()
  })
})
