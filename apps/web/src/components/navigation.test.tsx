import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Navigation } from './navigation'

describe('Navigation', () => {
  it('includes "Sign in" link to /auth', () => {
    render(<Navigation />)
    const link = screen.getByRole('menuitem', { name: /sign in/i })
    expect(link).toHaveAttribute('href', '/auth')
  })
})
