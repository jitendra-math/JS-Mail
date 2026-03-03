// src/lib/stores/mails.ts

import { writable } from "svelte/store";
import { apiGet, apiPost } from "$lib/utils/api";

export type Mail = {
  id: string;
  from: string;
  to: string;
  subject: string;
  preview?: string;
  html?: string;
  text?: string;
  time?: string;
  read?: boolean;
  starred?: boolean;
  folder?: string;
  attachments?: {
    filename: string;
    url: string;
    size?: number;
    contentType?: string;
  }[];
};

type MailState = {
  loading: boolean;
  mails: Mail[];
  selected: Mail | null;
  folder: string;
  page: number;
  total: number;
};

function createMailStore() {
  const { subscribe, update, set } = writable<MailState>({
    loading: false,
    mails: [],
    selected: null,
    folder: "inbox",
    page: 1,
    total: 0
  });

  return {
    subscribe,

    // 📂 change folder
    setFolder(folder: string) {
      update((s) => ({
        ...s,
        folder,
        mails: [],
        selected: null,
        page: 1
      }));
      this.fetch(folder, 1);
    },

    // 📥 fetch mails
    async fetch(folder?: string, page = 1) {
      update((s) => ({ ...s, loading: true }));

      try {
        let currentFolder = folder;
        update((s) => {
          currentFolder = folder || s.folder;
          return s;
        });

        const res = await apiGet<{
          success: boolean;
          emails: Mail[];
          total: number;
          page: number;
        }>(`/api/mail/inbox?folder=${currentFolder}&page=${page}`);

        update((s) => ({
          ...s,
          loading: false,
          mails: res.emails || [],
          total: res.total || 0,
          page: res.page || 1,
          folder: currentFolder || s.folder
        }));
      } catch (err) {
        console.error("Fetch mails error:", err);
        update((s) => ({ ...s, loading: false }));
      }
    },

    // 📖 open mail
    open(mail: Mail) {
      update((s) => ({
        ...s,
        selected: mail
      }));

      if (!mail.read) {
        apiPost("/api/mail/read", { id: mail.id }).catch(() => {});
      }
    },

    // ❌ close mail
    close() {
      update((s) => ({
        ...s,
        selected: null
      }));
    },

    // 🗑 delete mail
    async delete(mail: Mail, permanent = false) {
      try {
        await apiPost("/api/mail/delete", {
          id: mail.id,
          permanent
        });

        update((s) => ({
          ...s,
          selected: null,
          mails: s.mails.filter((m) => m.id !== mail.id)
        }));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    },

    // ⭐ toggle star
    async toggleStar(mail: Mail) {
      try {
        await apiPost("/api/mail/star", {
          id: mail.id,
          starred: !mail.starred
        });

        update((s) => ({
          ...s,
          mails: s.mails.map((m) =>
            m.id === mail.id ? { ...m, starred: !m.starred } : m
          ),
          selected:
            s.selected?.id === mail.id
              ? { ...s.selected, starred: !s.selected.starred }
              : s.selected
        }));
      } catch (err) {
        console.error("Star toggle failed:", err);
      }
    },

    // ✉ send mail
    async send(data: {
      to: string;
      subject?: string;
      html?: string;
      text?: string;
      from?: string;
      attachments?: any[];
    }) {
      try {
        const res = await apiPost("/api/mail/send", data);
        return res;
      } catch (err: any) {
        throw new Error(err?.message || "Send failed");
      }
    },

    // 🔄 refresh
    refresh() {
      let folder = "inbox";
      update((s) => {
        folder = s.folder;
        return s;
      });

      this.fetch(folder, 1);
    },

    // 🧹 reset store
    reset() {
      set({
        loading: false,
        mails: [],
        selected: null,
        folder: "inbox",
        page: 1,
        total: 0
      });
    }
  };
}

export const mails = createMailStore();