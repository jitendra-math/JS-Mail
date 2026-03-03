// src/lib/server/resend.ts

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("❌ RESEND_API_KEY missing in env");
}

export const resend = new Resend(RESEND_API_KEY);

// 📤 Send email via Resend
export async function sendEmail({
  from,
  to,
  subject,
  html,
  text,
  attachments = []
}: {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: {
    filename: string;
    path?: string; // public url (blob)
    content?: Buffer | string;
  }[];
}) {
  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      attachments
    });

    return {
      success: true,
      data: result
    };
  } catch (err: any) {
    console.error("Resend error:", err?.message || err);

    return {
      success: false,
      error: err?.message || "Failed to send email"
    };
  }
}