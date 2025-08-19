import React from 'react'
import { render, screen } from '@testing-library/react'
import { Navigation } from '@/components/navigation'

describe('Navigation', () => {
  test('has Sign in link to /auth', () => {
    render(<Navigation />)
    // Radix NavigationMenu renders menuitems with role="menuitem"
    const signIn = screen.getByRole('menuitem', { name: /sign in/i })
    expect(signIn).toBeInTheDocument()
    expect(signIn).toHaveAttribute('href', '/auth')
  })
})
