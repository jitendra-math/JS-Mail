// src/routes/api/mail/read/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isAuthenticated } from "$lib/server/auth";
import { connectDB } from "$lib/server/db";
import mongoose from "mongoose";

// 📦 Email schema
const emailSchema = new mongoose.Schema(
  {
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Email =
  mongoose.models.Email || mongoose.model("Email", emailSchema);

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!isAuthenticated()) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return json({ error: "Mail id required" }, { status: 400 });
    }

    await connectDB();

    await Email.findByIdAndUpdate(id, { read: true });

    return json({
      success: true,
      message: "Marked as read"
    });
  } catch (err) {
    console.error("Read mail error:", err);
    return json({ error: "Failed to mark read" }, { status: 500 });
  }
};