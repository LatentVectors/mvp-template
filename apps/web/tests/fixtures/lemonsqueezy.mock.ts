export class LemonSqueezy {
  apiKey: string
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }
  async createCheckout(_: any) {
    return {
      data: {
        attributes: { url: 'https://checkout.lemonsqueezy.com/checkout/mock' },
      },
    }
  }
}

export async function isValidSignature() {
  return true
}
export type WebhookEvent = unknown
