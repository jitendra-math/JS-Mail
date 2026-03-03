// src/routes/api/mail/star/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isAuthenticated } from "$lib/server/auth";
import { connectDB } from "$lib/server/db";
import mongoose from "mongoose";

// 📦 Email schema
const emailSchema = new mongoose.Schema(
  {
    starred: { type: Boolean, default: false }
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
    const { id, starred } = body;

    if (!id) {
      return json({ error: "Mail id required" }, { status: 400 });
    }

    await connectDB();

    await Email.findByIdAndUpdate(id, {
      starred: Boolean(starred)
    });

    return json({
      success: true,
      message: "Star updated"
    });
  } catch (err) {
    console.error("Star error:", err);
    return json({ error: "Failed to update star" }, { status: 500 });
  }
};