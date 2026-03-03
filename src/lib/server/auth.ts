// src/lib/server/auth.ts

import { cookies } from "@sveltejs/kit";

const COOKIE_NAME = "jsmail-auth";

// 🔐 verify master code
export function verifyMasterCode(code: string | undefined | null): boolean {
  if (!code) return false;
  return code === process.env.MASTER_CODE;
}

// 🍪 set auth cookie
export function setAuthCookie() {
  cookies().set(COOKIE_NAME, "logged-in", {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
}

// ❌ clear cookie
export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME, { path: "/" });
}

// 🛡 check auth
export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const auth = cookieStore.get(COOKIE_NAME);
  return auth?.value === "logged-in";
}

// 👤 get current user
export function getUser() {
  if (!isAuthenticated()) return null;

  return {
    name: "Jitu",
    role: "admin"
  };
}