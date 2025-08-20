import { type PaymentPort, type CreateCheckoutInput, type CreateCheckoutResult } from './port'

// Using official lemonsqueezy.ts SDK
import { LemonSqueezy, isValidSignature, type WebhookEvent } from 'lemonsqueezy.ts'

export class LemonSqueezyPayments implements PaymentPort {
  private client: LemonSqueezy

  constructor(options: { apiKey: string }) {
    this.client = new LemonSqueezy(options.apiKey)
  }

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    const { storeId, variantId, email, custom, successUrl, cancelUrl } = input
    const response = await this.client.createCheckout({
      storeId,
      variantId,
      checkoutOptions: {
        successUrl,
        cancelUrl,
        email,
        custom
      }
    })

    if (!response?.data?.attributes?.url) {
      throw new Error('Failed to create checkout')
    }

    return { url: response.data.attributes.url }
  }

  async verifyWebhook(payload: { rawBody: string | Uint8Array; signature: string | undefined }): Promise<{ valid: boolean }> {
    const signature = payload.signature ?? ''
    try {
      const valid = await isValidSignature(payload.rawBody, signature)
      return { valid }
    } catch {
      return { valid: false }
    }
  }
}

