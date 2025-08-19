import React from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AppLayout from '@/app/app/layout'
import DashboardPage from '@/app/app/page'

vi.mock('@/lib/supabase/auth', () => ({
  getServerUser: vi.fn().mockResolvedValue({ email: 'user@example.com' }),
}))

describe('Dashboard UI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user email and logout control when authenticated', async () => {
    const ui = await AppLayout({
      children: React.createElement(DashboardPage),
    })
    render(ui as unknown as React.ReactElement)
    expect(await screen.findByLabelText(/user-email/i)).toHaveTextContent(
      'user@example.com'
    )
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument()
  })
})
