import 'server-only'
import { ResendEmail, EmailProvider } from '@repo/email'

export function getEmail() {
  const provider =
    (process.env.EMAIL_PROVIDER as EmailProvider) || EmailProvider.Resend
  if (provider === EmailProvider.Resend) {
    const apiKey = process.env.RESEND_API_KEY
    const defaultFrom = process.env.EMAIL_FROM
    const options: { apiKey?: string; defaultFrom?: string } = {}
    if (apiKey) options.apiKey = apiKey
    if (defaultFrom) options.defaultFrom = defaultFrom
    return new ResendEmail(options)
  }
  throw new Error(`Unsupported EMAIL_PROVIDER: ${provider}`)
}
