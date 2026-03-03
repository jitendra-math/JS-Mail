// src/lib/config/constants.ts

// 🌐 App Info
export const APP_NAME = "JSMail";
export const APP_DESCRIPTION = "Private Mail System";
export const APP_VERSION = "2.0.0";

// 🏠 Default Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  INBOX: "/dashboard/inbox",
  SENT: "/dashboard/sent",
  TRASH: "/dashboard/trash",
  VAULT: "/dashboard/vault"
};

// 📂 Mail Folders
export const FOLDERS = {
  INBOX: "inbox",
  SENT: "sent",
  TRASH: "trash",
  STARRED: "starred",
  VAULT: "vault"
};

// 📧 Email Profiles (sender list)
export const EMAIL_PROFILES = [
  {
    id: "main",
    label: "Jitendra Singh <you@jitendrasingh.online>",
    value: "Jitendra Singh <you@jitendrasingh.online>"
  },
  {
    id: "admin",
    label: "Admin <admin@jitendrasingh.online>",
    value: "Admin <admin@jitendrasingh.online>"
  },
  {
    id: "private",
    label: "Private <private@jitendrasingh.online>",
    value: "Private <private@jitendrasingh.online>"
  }
];

// 📎 Attachment Limits
export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
export const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "application/zip",
  "text/plain"
];

// 🔔 Notification Defaults
export const NOTIFICATION_SETTINGS = {
  enabled: true,
  sound: true,
  vibration: true
};

// 🌙 Theme
export const DEFAULT_THEME = "dark";

// ⏱ Undo send time (seconds)
export const UNDO_SEND_SECONDS = 10;

// 💀 Self destruct timing options
export const SELF_DESTRUCT_OPTIONS = [
  { label: "5 seconds", value: 5 },
  { label: "10 seconds", value: 10 },
  { label: "30 seconds", value: 30 },
  { label: "1 minute", value: 60 },
  { label: "5 minutes", value: 300 }
];