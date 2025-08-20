import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AppLoading from '@/app/dashboard/loading'

describe('Dashboard Loading', () => {
  it('renders loading skeletons with aria-busy and aria-live', () => {
    render(<AppLoading />)

    const root = document.querySelector(
      '[aria-busy="true"][aria-live="polite"]'
    ) as HTMLElement | null
    expect(root).not.toBeNull()

    const pulses = root?.querySelectorAll('.animate-pulse') ?? []
    expect(pulses.length).toBeGreaterThanOrEqual(2)
  })
})
