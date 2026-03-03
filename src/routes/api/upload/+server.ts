// src/routes/api/upload/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isAuthenticated } from "$lib/server/auth";
import { uploadToBlob } from "$lib/server/blob";

export const POST: RequestHandler = async ({ request }) => {
  try {
    if (!isAuthenticated()) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `attachments/${Date.now()}-${file.name}`;

    const result = await uploadToBlob(buffer, filename, file.type);

    if (!result.success) {
      return json({ error: result.error || "Upload failed" }, { status: 500 });
    }

    return json({
      success: true,
      url: result.url,
      name: file.name,
      size: file.size
    });
  } catch (err) {
    console.error("Upload error:", err);
    return json({ error: "Upload failed" }, { status: 500 });
  }
};