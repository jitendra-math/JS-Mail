// src/routes/api/mail/delete/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isAuthenticated } from "$lib/server/auth";
import { connectDB } from "$lib/server/db";
import mongoose from "mongoose";

// 📦 Email schema
const emailSchema = new mongoose.Schema(
  {
    folder: String
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
    const { id, permanent = false } = body;

    if (!id) {
      return json({ error: "Mail id required" }, { status: 400 });
    }

    await connectDB();

    if (permanent) {
      await Email.findByIdAndDelete(id);
      return json({ success: true, message: "Permanently deleted" });
    }

    // move to trash
    await Email.findByIdAndUpdate(id, { folder: "trash" });

    return json({
      success: true,
      message: "Moved to trash"
    });
  } catch (err) {
    console.error("Delete mail error:", err);
    return json({ error: "Delete failed" }, { status: 500 });
  }
};