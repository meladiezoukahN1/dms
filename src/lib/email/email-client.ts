export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export interface EmailClient {
  send: (payload: EmailPayload) => Promise<void>;
}

export const emailClient: EmailClient = {
  async send(payload) {
    // Development: log only
    if (process.env.NODE_ENV === "development") {
      console.info("Email client send (development logging)", {
        to: payload.to,
        subject: payload.subject,
      });
      return;
    }

    // Production: enforce provider configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error(
        "Email provider not configured: SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables are required in production."
      );
    }

    // Infrastructure stub: real provider integration can be added here
    // Example: await sendgridClient.send(payload);
    // Example: await nouvelleClient.send(payload);
    console.info("Email client send (production stub)", {
      to: payload.to,
      subject: payload.subject,
    });
  },
};
