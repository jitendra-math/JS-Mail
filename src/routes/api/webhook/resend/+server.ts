// src/routes/api/webhook/resend/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import mongoose from "mongoose";
import { connectDB } from "$lib/server/db";
import { uploadToBlob } from "$lib/server/blob";
import { sendPushNotification } from "$lib/server/push";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

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
    folder: { type: String, default: "inbox" },
    read: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    attachments: [
      {
        filename: String,
        url: String,
        size: Number,
        contentType: String
      }
    ],
    receivedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Email =
  mongoose.models.Email || mongoose.model("Email", emailSchema);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const eventData = body?.data;

    if (body?.type !== "email.received" || !eventData?.email_id) {
      return json({ ok: true });
    }

    const emailId = eventData.email_id;

    let html = "";
    let text = "";
    let uploadedAttachments: any[] = [];

    // 🔥 fetch full email from resend receiving API
    try {
      const apiRes = await fetch(
        `https://api.resend.com/emails/receiving/${emailId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (apiRes.ok) {
        const fullEmail = await apiRes.json();

        html = fullEmail.html || "";
        text = fullEmail.text || "";

        // 📎 attachments upload to blob
        if (Array.isArray(fullEmail.attachments)) {
          for (const att of fullEmail.attachments) {
            try {
              const buffer = Buffer.from(att.content, "base64");
              const unique = `attachments/${Date.now()}-${att.filename}`;

              const blob = await uploadToBlob(
                buffer,
                unique,
                att.content_type || "application/octet-stream"
              );

              if (blob.success) {
                uploadedAttachments.push({
                  filename: att.filename,
                  url: blob.url,
                  size: buffer.length,
                  contentType: att.content_type
                });
              }
            } catch (e) {
              console.error("Attachment upload fail:", e);
            }
          }
        }
      } else {
        text = eventData.subject || "";
      }
    } catch (err) {
      console.error("Resend fetch error:", err);
      text = eventData.subject || "";
    }

    // 💾 save in DB
    await connectDB();

    const doc = {
      messageId: eventData.message_id || emailId,
      from: eventData.from || "unknown",
      to: Array.isArray(eventData.to)
        ? eventData.to[0]
        : eventData.to || "unknown",
      subject: eventData.subject || "(no subject)",
      html,
      text,
      preview: (text || html).replace(/<[^>]*>?/gm, "").slice(0, 120),
      attachments: uploadedAttachments,
      folder: "inbox",
      read: false,
      receivedAt: new Date(eventData.created_at || Date.now())
    };

    await Email.create(doc);

    // 🔔 push notification
    try {
      await sendPushNotification({
        title: doc.from,
        body: doc.subject || "New email",
        url: "/dashboard"
      });
    } catch (e) {
      console.error("Push error:", e);
    }

    return json({ success: true });
  } catch (err) {
    console.error("Webhook fatal:", err);
    return json({ ok: true });
  }
};