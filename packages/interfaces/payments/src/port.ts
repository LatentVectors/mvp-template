export type CreateCheckoutInput = {
  storeId: string
  variantId: string
  // optional fields to pass through to provider
  email?: string
  custom?: Record<string, unknown>
  // success/cancel URLs
  successUrl?: string
  cancelUrl?: string
}

export type CreateCheckoutResult = {
  url: string
}

export enum PaymentsProvider {
  LemonSqueezy = 'lemonsqueezy',
}

export interface PaymentPort {
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>
  verifyWebhook(payload: {
    rawBody: string | Uint8Array
    signature: string | undefined
  }): Promise<{ valid: boolean }>
}

