import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DashboardPage from '@/app/dashboard/page'

describe('DashboardPage', () => {
  it('renders welcome text and getting started section', () => {
    render(<DashboardPage />)

    expect(screen.getByText(/welcome to your dashboard\./i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /getting started/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/recent activity and key metrics/i)
    ).toBeInTheDocument()
  })
})
