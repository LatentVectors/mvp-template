import { describe, it, expect, vi } from 'vitest'

vi.mock('@repo/payments', () => ({
  LemonSqueezyPayments: class {},
}))

describe('payments provider binding', () => {
  it('defaults to lemonsqueezy', async () => {
    delete process.env.PAYMENTS_PROVIDER
    const mod = await import('./payments')
    const client = mod.getPayments()
    expect(client).toBeTruthy()
  })

  it('throws on unsupported provider', async () => {
    process.env.PAYMENTS_PROVIDER = 'unknown'
    const mod = await import('./payments')
    expect(() => mod.getPayments()).toThrow(/Unsupported PAYMENTS_PROVIDER/)
  })
})
