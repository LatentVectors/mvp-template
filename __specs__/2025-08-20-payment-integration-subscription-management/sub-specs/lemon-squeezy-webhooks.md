This document provides a comprehensive overview of implementing webhooks in Lemon Squeezy, designed to be used as a reference for an LLM implementing these webhooks in a TypeScript environment.

### 1. Introduction to Webhooks

Webhooks in Lemon Squeezy are a way for your application to receive real-time notifications about events in your store. When an event occurs, such as a new order or a subscription renewal, Lemon Squeezy sends an HTTP POST request to a URL you specify. This allows you to automate workflows, synchronize data with your application, and react to events as they happen.

### 2. Creating and Managing Webhooks

You can create and manage webhooks in two primary ways:

- **Dashboard:** Set up and manage webhooks from the "Settings > Webhooks" page in your Lemon Squeezy dashboard.
- **API:** Create and manage webhooks programmatically using the Lemon Squeezy API.

To create a webhook, you must provide:

- **Callback URL:** The endpoint in your application that will receive the webhook POST requests.
- **Signing Secret:** A random string (between 6 and 40 characters) used to secure your webhooks and verify that requests originate from Lemon Squeezy.
- **Events:** The specific events for which you want to receive notifications.

### 3. Webhook Requests

When a subscribed event is triggered, Lemon Squeezy sends a `POST` request to your callback URL. The request body will contain a JSON:API resource object with data relevant to the event.

**Request Headers:**

The request will include the following important headers:

- `Content-Type`: `application/json`
- `X-Event-Name`: The name of the event that triggered the webhook (e.g., `order_created`).
- `X-Signature`: A cryptographic signature used to verify the authenticity of the request.

**Responding to Webhook Requests:**

Your application must return a `200` HTTP status code to acknowledge the successful receipt of the webhook. If Lemon Squeezy receives any other status code, it will attempt to resend the webhook up to three more times with an exponential backoff (5 seconds, 25 seconds, 125 seconds). After the final attempt, the request is marked as failed.

### 4. Signing and Verifying Requests

To ensure the security of your webhooks, you must verify the signature of every incoming request. This confirms that the request was sent by Lemon Squeezy and not a malicious third party.

The `X-Signature` header contains a hash generated using an HMAC hex digest with the `sha256` algorithm. To verify the signature, you must:

1.  Generate a hash of the raw request body using the `sha256` algorithm and your unique signing secret.
2.  Compare your generated hash with the value of the `X-Signature` header.

It is critical to use a timing-safe comparison method to prevent timing attacks.

Here is an example of how to verify the signature in a Next.js App Router route handler (Node runtime) using the raw request body and a timing-safe comparison:

```typescript
import crypto from 'node:crypto'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
  if (!secret) return new Response('Secret not configured', { status: 500 })

  const rawBody = await req.text()
  const signatureHeader = req.headers.get('X-Signature') || ''

  const hmac = crypto.createHmac('sha256', secret)
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
  const signature = Buffer.from(signatureHeader, 'utf8')

  try {
    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response('Invalid signature', { status: 401 })
    }
  } catch {
    return new Response('Invalid signature', { status: 401 })
  }

  // Signature is valid, proceed with processing the webhook
  return new Response('ok')
}
```

### 5. Event Types

You can subscribe to a variety of event types. Here is a complete list:

| Event Name | Data Sent | Description |
| --- | --- | --- |
| `order_created` | Order object | Occurs when a new order is successfully placed. |
| `order_refunded` | Order object | Occurs when a full or partial refund is made on an order. |
| `subscription_created` | Subscription object | Occurs when a new subscription is successfully created. |
| `subscription_updated` | Subscription object | Occurs when a subscription's data is changed or updated. |
| `subscription_cancelled` | Subscription object | Occurs when a subscription is cancelled. |
| `subscription_resumed` | Subscription object | Occurs when a subscription is resumed after being cancelled. |
| `subscription_expired` | Subscription object | Occurs when a subscription has ended. |
| `subscription_paused` | Subscription object | Occurs when a subscription's payment collection is paused. |
| `subscription_unpaused` | Subscription object | Occurs when a subscription's payment collection is resumed. |
| `subscription_payment_success` | Subscription invoice object | Occurs when a subscription payment is successful. |
| `subscription_payment_failed` | Subscription invoice object | Occurs when a subscription renewal payment fails. |
| `subscription_payment_recovered` | Subscription invoice object | Occurs when a subscription has a successful payment after a failed payment. |
| `subscription_payment_refunded` | Subscription invoice object | Occurs when a subscription payment is refunded. |
| `license_key_created` | License key object | Occurs when a license key is created from a new order. |
| `license_key_updated` | License key object | Occurs when a license key is updated. |
| `affiliate_activated` | Affiliate object | Occurs when an affiliate is activated. |

### 6. Example Payloads

The webhook payload is a JSON:API resource object. For `order_created`, the payload will contain an `Order` object with customer details, items, and totals. For `subscription_created`, it will contain a `Subscription` object with plan details, customer information, and trial status. You can find detailed JSON payload examples for all events in the Lemon Squeezy documentation.

### 7. Simulating and Testing Webhooks

You can test your webhook integration without affecting live data by using Lemon Squeezy's **test mode**. In test mode, you can simulate webhook events for any test mode order or subscription directly from the Lemon Squeezy admin dashboard.

The following events can be simulated:

**Subscription Events**

- `subscription_created`
- `subscription_updated`
- `subscription_cancelled`
- `subscription_resumed`
- `subscription_expired`
- `subscription_paused`
- `subscription_unpaused`

**Order Events**

- `order_created`
- `order_refunded`

Test mode webhooks are separate from live mode webhooks and will only be triggered for test mode data.

### 8. Best Practices

- **Always Verify Signatures:** This is a critical security step to ensure the integrity and authenticity of the data.
- **Respond Quickly:** Return a `200` status code as soon as possible to avoid timeouts and retries from Lemon Squeezy. Offload any long-running processes to a background job queue.
- **Handle Duplicate Events:** Your endpoint might receive the same event more than once. Design your event processing logic to be idempotent to prevent duplicate processing.
- **Use Test Mode:** Thoroughly test your integration in test mode before deploying to production.
- **Monitor Your Webhooks:** Regularly check the webhook logs in your Lemon Squeezy dashboard to ensure they are being delivered successfully and to debug any issues.
