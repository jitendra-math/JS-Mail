// src/lib/server/blob.ts

import { put, del } from "@vercel/blob";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.warn("⚠️ BLOB_READ_WRITE_TOKEN missing. Uploads may fail.");
}

// 📤 Upload file to Vercel Blob
export async function uploadToBlob(
  file: File | Buffer,
  filename: string,
  contentType?: string
) {
  try {
    const blob = await put(filename, file, {
      access: "public",
      contentType: contentType || "application/octet-stream"
    });

    return {
      success: true,
      url: blob.url,
      pathname: blob.pathname
    };
  } catch (err: any) {
    console.error("Blob upload error:", err?.message || err);
    return {
      success: false,
      error: err?.message || "Upload failed"
    };
  }
}

// 🗑 delete file from blob
export async function deleteFromBlob(url: string) {
  if (!url) return;

  try {
    await del(url);
    return { success: true };
  } catch (err: any) {
    console.error("Blob delete error:", err?.message || err);
    return { success: false };
  }
}