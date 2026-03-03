// src/routes/api/auth/login/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { verifyMasterCode, setAuthCookie } from "$lib/server/auth";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const code = body?.code;

    if (!code) {
      return json({ error: "Code required" }, { status: 400 });
    }

    const valid = verifyMasterCode(code);

    if (!valid) {
      return json({ error: "Invalid code" }, { status: 401 });
    }

    setAuthCookie();

    return json({
      success: true,
      message: "Logged in"
    });
  } catch (err) {
    console.error("Login error:", err);
    return json({ error: "Login failed" }, { status: 500 });
  }
};