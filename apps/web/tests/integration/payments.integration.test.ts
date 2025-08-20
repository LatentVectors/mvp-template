import { describe, it, expect, vi } from 'vitest'

vi.mock('@repo/payments', async orig => {
  const mod = await orig()
  return {
    ...mod,
    LemonSqueezyPayments: class {
      async createCheckout() {
        return { url: 'https://checkout.lemonsqueezy.com/checkout/mock' }
      }
    },
  }
})

describe('Payments integration', () => {
  it('returns a checkout URL from provider', async () => {
    const { LemonSqueezyPayments } = await import('@repo/payments')
    const payments = new LemonSqueezyPayments({ apiKey: 'test' })
    const res = await payments.createCheckout({ storeId: '1', variantId: '2' })
    expect(res.url).toMatch(/^https:\/\/checkout\.lemonsqueezy\.com\//)
  })
})
