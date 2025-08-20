export type SendEmailRequest = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
};

export type SendEmailResponse =
  | { ok: true; id: string; provider: "resend" | "mock" }
  | { ok: false; error: string; recoverable?: boolean };

export interface EmailPort {
  send(request: SendEmailRequest): Promise<SendEmailResponse>;
}


