// src/lib/utils/time.ts

// 🕒 Get current IST date object
export function nowIST(): Date {
  const now = new Date();
  const istOffset = 5.5 * 60; // IST = UTC +5:30
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + istOffset * 60000);
}

// 📅 Check if date is today (IST safe)
export function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const now = nowIST();

  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

// 📆 Check if date is yesterday (IST safe)
export function isYesterday(date: string | Date): boolean {
  const d = new Date(date);
  const now = nowIST();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  );
}

// ⏳ Minutes difference
export function diffMinutes(from: string | Date, to?: string | Date): number {
  const start = new Date(from).getTime();
  const end = to ? new Date(to).getTime() : Date.now();

  return Math.floor((end - start) / (1000 * 60));
}

// ⏰ Hours difference
export function diffHours(from: string | Date, to?: string | Date): number {
  return Math.floor(diffMinutes(from, to) / 60);
}

// 📆 Days difference
export function diffDays(from: string | Date, to?: string | Date): number {
  const start = new Date(from).getTime();
  const end = to ? new Date(to).getTime() : Date.now();

  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
}

// 🗓 Generate schedule timestamp (future send feature)
export function futureTimestamp(
  minutesFromNow: number
): Date {
  const now = Date.now();
  return new Date(now + minutesFromNow * 60000);
}

// 🕰 Convert to ISO string safe for DB
export function toISO(date: string | Date): string {
  return new Date(date).toISOString();
}