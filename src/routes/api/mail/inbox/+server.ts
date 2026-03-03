// src/routes/api/mail/inbox/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { connectDB } from "$lib/server/db";
import { isAuthenticated } from "$lib/server/auth";
import mongoose from "mongoose";

// 🧠 Email schema (safe reuse)
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

export const GET: RequestHandler = async ({ url }) => {
  try {
    if (!isAuthenticated()) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const folder = url.searchParams.get("folder") || "inbox";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 30;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (folder === "starred") {
      query.starred = true;
    } else {
      query.folder = folder;
    }

    const total = await Email.countDocuments(query);

    const emails = await Email.find(query)
      .sort({ receivedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formatted = emails.map((m: any) => ({
      id: m._id.toString(),
      from: m.from,
      to: m.to,
      subject: m.subject,
      preview: m.preview || (m.text || "").slice(0, 120),
      html: m.html,
      text: m.text,
      read: m.read,
      starred: m.starred,
      folder: m.folder,
      attachments: m.attachments || [],
      time: m.receivedAt
    }));

    return json({
      success: true,
      emails: formatted,
      total,
      page
    });
  } catch (err) {
    console.error("Inbox error:", err);
    return json({ error: "Failed to fetch inbox" }, { status: 500 });
  }
};