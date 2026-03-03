// src/lib/stores/auth.ts

import { writable } from "svelte/store";
import { apiGet, apiPost } from "$lib/utils/api";

export type User = {
  name?: string;
  role?: string;
};

type AuthState = {
  loading: boolean;
  authenticated: boolean;
  user: User | null;
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    loading: true,
    authenticated: false,
    user: null
  });

  return {
    subscribe,

    // 🔄 check login status (app start)
    async check() {
      try {
        update((s) => ({ ...s, loading: true }));

        const res = await apiGet<{
          authenticated: boolean;
          user?: User;
        }>("/api/auth/me");

        set({
          loading: false,
          authenticated: res.authenticated,
          user: res.user || null
        });

        return res.authenticated;
      } catch {
        set({
          loading: false,
          authenticated: false,
          user: null
        });
        return false;
      }
    },

    // 🔐 login
    async login(code: string) {
      if (!code) return false;

      try {
        update((s) => ({ ...s, loading: true }));

        const res = await apiPost<{ success: boolean }>(
          "/api/auth/login",
          { code }
        );

        if (res.success) {
          await this.check();
          return true;
        }

        update((s) => ({ ...s, loading: false }));
        return false;
      } catch (err: any) {
        update((s) => ({ ...s, loading: false }));
        throw new Error(err?.message || "Login failed");
      }
    },

    // 🚪 logout
    async logout() {
      try {
        await apiPost("/api/auth/logout");
      } catch {
        // ignore
      }

      set({
        loading: false,
        authenticated: false,
        user: null
      });

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },

    // manual set user
    setUser(user: User | null) {
      update((s) => ({ ...s, user }));
    }
  };
}

export const auth = createAuthStore();