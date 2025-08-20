import { describe, it, expect } from 'vitest'
import type { PaymentPort } from './port'

describe('PaymentPort interface', () => {
  it('should define createCheckout and verifyWebhook', () => {
    const port: PaymentPort = {
      // @ts-expect-error - testing shape only
      async createCheckout() { return { url: 'https://example.com' } },
      async verifyWebhook() { return { valid: true } },
    }
    expect(typeof port.createCheckout).toBe('function')
    expect(typeof port.verifyWebhook).toBe('function')
  })
})

