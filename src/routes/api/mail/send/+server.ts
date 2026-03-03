// src/routes/api/mail/send/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isAuthenticated } from "$lib/server/auth";
import { connectDB } from "$lib/server/db";
import { sendEmail } from "$lib/server/resend";
import mongoose from "mongoose";

// 📦 Email schema
const emailSchema = new mongoose.Schema(
  {
    messageId: String,
    from: String,
    to: String,
    subject: String,
    html: String,
    text: String,
    preview: String,
    folder: { type: String, default: "sent" },
    read: { type: Boolean, default: true },
    starred: { type: Boolean, default: false },
    attachments: [
      {
        filename: String,
        url: String,
        size: Number,
        contentType: String
      }
    ],
    sentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Email =
  mongoose.models.Email || mongoose.model("Email", emailSchema);

export const POST: RequestHandler = async ({ request }) => {
  try {
    // 🔐 auth check
    if (!isAuthenticated()) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      from,
      to,
      subject = "",
      html = "",
      text = "",
      attachments = []
    } = body;

    if (!to) {
      return json({ error: "Recipient required" }, { status: 400 });
    }

    // 📤 Send email via Resend
    const result = await sendEmail({
      from,
      to,
      subject,
      html,
      text,
      attachments: attachments.map((a: any) => ({
        filename: a.filename,
        path: a.path
      }))
    });

    if (!result.success) {
      return json({ error: result.error || "Send failed" }, { status: 500 });
    }

    // 💾 Save in Mongo (sent folder)
    await connectDB();

    const preview = (text || html || "").replace(/<[^>]*>?/gm, "").slice(0, 120);

    await Email.create({
      messageId: result?.data?.id || new mongoose.Types.ObjectId().toString(),
      from,
      to,
      subject,
      html,
      text,
      preview,
      folder: "sent",
      read: true,
      attachments: attachments.map((a: any) => ({
        filename: a.filename,
        url: a.path
      }))
    });

    return json({
      success: true,
      message: "Email sent"
    });
  } catch (err) {
    console.error("Send mail error:", err);
    return json({ error: "Send failed" }, { status: 500 });
  }
};