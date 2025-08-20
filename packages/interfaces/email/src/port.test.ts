import { describe, it, expect } from "vitest";
import type { EmailPort, SendEmailRequest } from "./port";

describe("EmailPort interface", () => {
  it("should define send(request) -> Promise<SendEmailResponse>", async () => {
    const impl: EmailPort = {
      async send(request: SendEmailRequest) {
        expect(request.to).toBeDefined();
        return { ok: true, id: "test-id", provider: "mock" };
      },
    };

    const result = await impl.send({ to: "test@example.com", subject: "Hello" });
    expect(result.ok).toBe(true);
  });
});


