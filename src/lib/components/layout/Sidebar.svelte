<!-- src/lib/components/layout/Sidebar.svelte -->

<script lang="ts">
  import { ui } from "$lib/stores/ui";
  import { mails } from "$lib/stores/mails";
  import { FOLDERS } from "$lib/config/constants";

  let $ui;
  const unsub = ui.subscribe((v) => ($ui = v));

  const items = [
    { id: FOLDERS.INBOX, label: "Inbox", icon: "📥" },
    { id: FOLDERS.SENT, label: "Sent", icon: "📤" },
    { id: FOLDERS.TRASH, label: "Trash", icon: "🗑" },
    { id: FOLDERS.VAULT, label: "Vault", icon: "🔒" }
  ];

  function change(folder: string) {
    mails.setFolder(folder);
    if ($ui.mobile) ui.closeSidebar();
  }
</script>

{#if $ui.sidebarOpen}
<div class="fixed lg:static z-50 inset-y-0 left-0 w-[260px] bg-[#0b0c10] border-r border-white/5 flex flex-col">

  <!-- Logo -->
  <div class="px-6 py-5 border-b border-white/5">
    <h1 class="text-white font-bold text-lg tracking-wide">
      JSMail
    </h1>
    <p class="text-xs text-gray-500 mt-1">
      Private Mail OS
    </p>
  </div>

  <!-- Menu -->
  <div class="flex-1 px-3 py-4 space-y-1">
    {#each items as item}
      <button
        on:click={() => change(item.id)}
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
      >
        <span class="text-base">{item.icon}</span>
        {item.label}
      </button>
    {/each}
  </div>

  <!-- Bottom -->
  <div class="p-4 border-t border-white/5 text-xs text-gray-500">
    JSMail v2
  </div>

</div>

<!-- overlay mobile -->
{#if $ui.mobile}
<div
  class="fixed inset-0 bg-black/50 z-40"
  on:click={() => ui.closeSidebar()}
/>
{/if}

{/if}