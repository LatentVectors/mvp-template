import 'server-only'
import { LemonSqueezyPayments, PaymentsProvider } from '@repo/payments'

export function getPayments() {
  const provider =
    (process.env.PAYMENTS_PROVIDER as PaymentsProvider) ||
    PaymentsProvider.LemonSqueezy
  if (provider === PaymentsProvider.LemonSqueezy) {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY || ''
    return new LemonSqueezyPayments({ apiKey })
  }
  throw new Error(`Unsupported PAYMENTS_PROVIDER: ${provider}`)
}
