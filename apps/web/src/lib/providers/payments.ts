import 'server-only'
import { LemonSqueezyPayments } from '@repo/payments'

export type PaymentsProvider = 'lemonsqueezy'

export function getPayments() {
  const provider = (process.env.PAYMENTS_PROVIDER ||
    'lemonsqueezy') as PaymentsProvider
  if (provider === 'lemonsqueezy') {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY || ''
    return new LemonSqueezyPayments({ apiKey })
  }
  throw new Error(`Unsupported PAYMENTS_PROVIDER: ${provider}`)
}
