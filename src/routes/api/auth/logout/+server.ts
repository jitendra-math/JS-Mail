// src/routes/api/auth/logout/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { clearAuthCookie } from "$lib/server/auth";

export const POST: RequestHandler = async () => {
  try {
    clearAuthCookie();

    return json({
      success: true,
      message: "Logged out"
    });
  } catch (err) {
    console.error("Logout error:", err);
    return json({ error: "Logout failed" }, { status: 500 });
  }
};