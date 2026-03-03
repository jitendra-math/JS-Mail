// src/lib/utils/api.ts

const BASE = ""; // same origin (Vercel deploy pe auto work karega)

// Generic fetch wrapper
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(BASE + url, {
    credentials: "include", // auth cookie send karega
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    // ignore json parse error
  }

  if (!res.ok) {
    const message = data?.error || "API request failed";
    throw new Error(message);
  }

  return data as T;
}

// GET
export async function apiGet<T>(url: string): Promise<T> {
  return request<T>(url, { method: "GET" });
}

// POST
export async function apiPost<T>(
  url: string,
  body?: Record<string, any>
): Promise<T> {
  return request<T>(url, {
    method: "POST",
    body: JSON.stringify(body || {})
  });
}

// DELETE
export async function apiDelete<T>(
  url: string,
  body?: Record<string, any>
): Promise<T> {
  return request<T>(url, {
    method: "DELETE",
    body: JSON.stringify(body || {})
  });
}

// File upload (blob / attachments)
export async function apiUpload<T>(
  url: string,
  formData: FormData
): Promise<T> {
  const res = await fetch(BASE + url, {
    method: "POST",
    body: formData,
    credentials: "include"
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Upload failed");
  }

  return data as T;
}

// Auth check helper
export async function checkAuth() {
  try {
    return await apiGet<{ authenticated: boolean }>("/api/auth/me");
  } catch {
    return { authenticated: false };
  }
}