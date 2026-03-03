// src/lib/stores/ui.ts

import { writable } from "svelte/store";

type Theme = "dark" | "light" | "system";

type UIState = {
  sidebarOpen: boolean;
  composeOpen: boolean;
  searchOpen: boolean;
  loading: boolean;
  theme: Theme;
  mobile: boolean;
};

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768;
}

function getSavedTheme(): Theme {
  if (typeof localStorage === "undefined") return "dark";
  return (localStorage.getItem("jsmail-theme") as Theme) || "dark";
}

function createUIStore() {
  const { subscribe, update, set } = writable<UIState>({
    sidebarOpen: true,
    composeOpen: false,
    searchOpen: false,
    loading: false,
    theme: getSavedTheme(),
    mobile: detectMobile()
  });

  return {
    subscribe,

    // 📱 detect mobile resize
    init() {
      if (typeof window === "undefined") return;

      const handleResize = () => {
        update((s) => ({
          ...s,
          mobile: window.innerWidth <= 768,
          sidebarOpen: window.innerWidth > 1024
        }));
      };

      handleResize();
      window.addEventListener("resize", handleResize);
    },

    // 📂 sidebar
    toggleSidebar() {
      update((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }));
    },

    openSidebar() {
      update((s) => ({ ...s, sidebarOpen: true }));
    },

    closeSidebar() {
      update((s) => ({ ...s, sidebarOpen: false }));
    },

    // ✉ compose modal
    openCompose() {
      update((s) => ({ ...s, composeOpen: true }));
    },

    closeCompose() {
      update((s) => ({ ...s, composeOpen: false }));
    },

    toggleCompose() {
      update((s) => ({ ...s, composeOpen: !s.composeOpen }));
    },

    // 🔍 search
    openSearch() {
      update((s) => ({ ...s, searchOpen: true }));
    },

    closeSearch() {
      update((s) => ({ ...s, searchOpen: false }));
    },

    toggleSearch() {
      update((s) => ({ ...s, searchOpen: !s.searchOpen }));
    },

    // ⏳ global loading
    setLoading(value: boolean) {
      update((s) => ({ ...s, loading: value }));
    },

    // 🌙 theme switch
    setTheme(theme: Theme) {
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme);
      }

      if (typeof localStorage !== "undefined") {
        localStorage.setItem("jsmail-theme", theme);
      }

      update((s) => ({ ...s, theme }));
    },

    // reset ui
    reset() {
      set({
        sidebarOpen: true,
        composeOpen: false,
        searchOpen: false,
        loading: false,
        theme: "dark",
        mobile: detectMobile()
      });
    }
  };
}

export const ui = createUIStore();