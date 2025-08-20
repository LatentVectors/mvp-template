import React from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DashboardLayout from '@/app/dashboard/layout'
import DashboardPage from '@/app/dashboard/page'

vi.mock('@/lib/supabase/auth', () => ({
  getServerUser: vi.fn().mockResolvedValue({ email: 'user@example.com' }),
}))

describe('Dashboard UI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user email and logout control when authenticated', async () => {
    const ui = await DashboardLayout({
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
