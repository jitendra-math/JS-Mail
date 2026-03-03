// src/routes/api/auth/me/+server.ts

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { isAuthenticated, getUser } from "$lib/server/auth";

export const GET: RequestHandler = async () => {
  try {
    const authenticated = isAuthenticated();

    if (!authenticated) {
      return json({
        authenticated: false
      });
    }

    const user = getUser();

    return json({
      authenticated: true,
      user
    });
  } catch (err) {
    console.error("Auth check error:", err);
    return json(
      { authenticated: false, error: "Auth check failed" },
      { status: 500 }
    );
  }
};