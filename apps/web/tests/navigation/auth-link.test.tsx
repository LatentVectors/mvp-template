import { render, screen } from '@testing-library/react'
import { Navigation } from '@/components/navigation'

describe('Navigation auth link', () => {
  it('includes "Sign in" link to /auth', () => {
    render(<Navigation />)
    const link = screen.getByRole('menuitem', { name: /sign in/i })
    expect(link).toHaveAttribute('href', '/auth')
  })
})

import React from 'react'

describe('Navigation', () => {
  test('has Sign in link to /auth', () => {
    render(<Navigation />)
    // Radix NavigationMenu renders menuitems with role="menuitem"
    const signIn = screen.getByRole('menuitem', { name: /sign in/i })
    expect(signIn).toBeInTheDocument()
    expect(signIn).toHaveAttribute('href', '/auth')
  })
})
