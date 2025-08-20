import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LemonSqueezyPayments } from './lemonsqueezy'

vi.mock('lemonsqueezy.ts', () => {
  class MockLS {
    apiKey: string
    constructor(apiKey: string) { this.apiKey = apiKey }
    async createCheckout(args: any) {
      return { data: { attributes: { url: 'https://checkout.lemonsqueezy.com/checkout/abc123' } } }
    }
  }
  return {
    LemonSqueezy: MockLS,
    isValidSignature: vi.fn(async () => true)
  }
})

describe('LemonSqueezyPayments', () => {
  const apiKey = 'test-key'
  let adapter: LemonSqueezyPayments

  beforeEach(() => {
    adapter = new LemonSqueezyPayments({ apiKey })
  })

  it('createCheckout returns a URL', async () => {
    const result = await adapter.createCheckout({ storeId: '1', variantId: '2' })
    expect(result.url).toMatch(/^https:\/\/checkout\.lemonsqueezy\.com\//)
  })

  it('verifyWebhook returns valid true on success', async () => {
    const res = await adapter.verifyWebhook({ rawBody: '{}', signature: 'sig' })
    expect(res.valid).toBe(true)
  })
})

