import { Resend } from "resend";
import type { EmailPort, SendEmailRequest, SendEmailResponse } from "./port";
import { EmailProvider } from "./port";

export class ResendEmail implements EmailPort {
  private readonly client: Resend | null;
  private readonly defaultFrom: string | undefined;

  constructor(options?: { apiKey?: string; defaultFrom?: string }) {
    const apiKey = options?.apiKey ?? process.env.RESEND_API_KEY;
    this.defaultFrom = options?.defaultFrom ?? process.env.EMAIL_FROM;
    this.client = apiKey ? new Resend(apiKey) : null;
  }

  async send(request: SendEmailRequest): Promise<SendEmailResponse> {
    if (!this.client) {
      return {
        ok: false,
        error: "Resend not configured: missing RESEND_API_KEY",
        recoverable: true,
      };
    }

    const from = request.from ?? this.defaultFrom;
    if (!from) {
      return {
        ok: false,
        error: "Missing 'from' address",
        recoverable: true,
      };
    }

    try {
      const { data, error } = await this.client.emails.send({
        from,
        to: request.to,
        subject: request.subject,
        html: request.html,
        text: request.text,
        cc: request.cc,
        bcc: request.bcc,
        reply_to: request.replyTo,
      } as any);

      if (error) {
        return { ok: false, error: error.message ?? String(error) };
      }

      const id = (data as any)?.id ?? "";
      return { ok: true, id, provider: EmailProvider.Resend };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
}


