<!-- src/lib/components/layout/Header.svelte -->

<script lang="ts">
  import { ui } from "$lib/stores/ui";
  import { auth } from "$lib/stores/auth";
  import { mails } from "$lib/stores/mails";
  import Button from "$lib/components/ui/Button.svelte";

  let search = "";

  function toggleSidebar() {
    ui.toggleSidebar();
  }

  function openCompose() {
    ui.openCompose();
  }

  function doSearch() {
    if (!search) return;
    // future smart search hook
    console.log("search:", search);
  }

  function logout() {
    auth.logout();
  }

  function refresh() {
    mails.refresh();
  }
</script>

<header class="h-14 border-b border-white/5 bg-[#0b0c10]/90 backdrop-blur flex items-center justify-between px-4">

  <!-- Left -->
  <div class="flex items-center gap-3">
    <button
      on:click={toggleSidebar}
      class="text-gray-400 hover:text-white text-lg"
    >
      ☰
    </button>

    <div class="hidden sm:block">
      <h2 class="text-sm text-gray-400">JSMail</h2>
    </div>
  </div>

  <!-- Center search -->
  <div class="flex-1 max-w-xl mx-4 hidden md:flex">
    <input
      bind:value={search}
      on:keydown={(e) => e.key === "Enter" && doSearch()}
      placeholder="Search mails..."
      class="w-full bg-[#0f1115] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200 outline-none focus:border-blue-500"
    />
  </div>

  <!-- Right actions -->
  <div class="flex items-center gap-2">

    <button
      on:click={refresh}
      class="text-gray-400 hover:text-white text-sm px-2"
      title="Refresh"
    >
      ⟳
    </button>

    <Button size="sm" variant="primary" on:click={openCompose}>
      Compose
    </Button>

    <button
      on:click={logout}
      class="text-gray-400 hover:text-red-400 text-sm px-2"
      title="Logout"
    >
      Logout
    </button>
  </div>

</header>