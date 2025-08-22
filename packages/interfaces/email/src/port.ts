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
  | { ok: true; id: string; provider: EmailProvider | "mock" }
  | { ok: false; error: string; recoverable?: boolean };

export enum EmailProvider {
  Resend = "resend",
}

export interface EmailPort {
  send(request: SendEmailRequest): Promise<SendEmailResponse>;
}


