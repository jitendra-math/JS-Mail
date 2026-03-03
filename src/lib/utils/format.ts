// src/lib/utils/format.ts

// 📅 Format time like premium mail apps (IST)
export function formatTime(date: string | Date): string {
  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 📆 Format date (Today / Yesterday / full date)
export function formatDate(date: string | Date): string {
  if (!date) return "";

  const d = new Date(date);
  const now = new Date();

  const options = { timeZone: "Asia/Kolkata" } as Intl.DateTimeFormatOptions;

  const dStr = d.toLocaleDateString("en-IN", options);
  const nowStr = now.toLocaleDateString("en-IN", options);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yStr = yesterday.toLocaleDateString("en-IN", options);

  if (dStr === nowStr) {
    return formatTime(d);
  }

  if (dStr === yStr) {
    return "Yesterday";
  }

  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ⏳ Relative time (2m ago, 1h ago, etc)
export function timeAgo(date: string | Date): string {
  const d = new Date(date).getTime();
  const now = Date.now();

  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;

  return formatDate(date);
}

// 💾 Format bytes (attachments)
export function formatBytes(bytes: number, decimals = 1): string {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${sizes[i]}`;
}

// ✂️ Trim long text
export function truncate(text: string, length = 80): string {
  if (!text) return "";
  if (text.length <= length) return text;

  return text.slice(0, length) + "...";
}

// 📛 Extract name from email string
export function extractName(email: string): string {
  if (!email) return "";

  const match = email.match(/^([^<]+)/);
  if (match) return match[1].trim();

  return email.split("@")[0];
}

// 🌐 Extract domain from email
export function extractDomain(email: string): string {
  if (!email || !email.includes("@")) return "";

  return email.split("@")[1].toLowerCase();
}