import { beforeEach, describe, expect, it, vi } from "vitest";
import { ResendEmail } from "./resend";

vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn(async () => ({ data: { id: "email_123" }, error: null })),
      },
    })),
  };
});

describe("ResendEmail", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
  });

  it("returns not-configured response when no API key", async () => {
    const email = new ResendEmail();
    const res = await email.send({ to: "a@b.com", subject: "Hi" });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.recoverable).toBe(true);
    }
  });

  it("sends email when configured and returns id", async () => {
    process.env.RESEND_API_KEY = "test_123";
    process.env.EMAIL_FROM = "noreply@example.com";
    const email = new ResendEmail();
    const res = await email.send({ to: "a@b.com", subject: "Hi" });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.id).toBe("email_123");
      expect(res.provider).toBe("resend");
    }
  });

  it("requires from when not provided and no default", async () => {
    process.env.RESEND_API_KEY = "test_123";
    const email = new ResendEmail();
    const res = await email.send({ to: "a@b.com", subject: "Hi" });
    expect(res.ok).toBe(false);
  });
});


