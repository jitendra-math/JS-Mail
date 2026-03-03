// src/routes/+layout.ts

import type { LayoutLoad } from "./$types";
import { browser } from "$app/environment";
import { auth } from "$lib/stores/auth";
import { ui } from "$lib/stores/ui";

export const load: LayoutLoad = async () => {
  // 🧠 Client-side bootstrap
  if (browser) {
    // Init UI (mobile detect, resize listener etc)
    ui.init();

    // Check auth on app start
    try {
      await auth.check();
    } catch (err) {
      console.error("Auth bootstrap error:", err);
    }
  }

  return {};
};