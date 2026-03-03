<!-- src/lib/components/layout/BottomNav.svelte -->

<script lang="ts">
  import { mails } from "$lib/stores/mails";
  import { ui } from "$lib/stores/ui";
  import { FOLDERS } from "$lib/config/constants";

  let $ui;
  let $mails;

  const unsubUI = ui.subscribe(v => $ui = v);
  const unsubMails = mails.subscribe(v => $mails = v);

  const tabs = [
    { id: FOLDERS.INBOX, label: "Inbox", icon: "📥" },
    { id: FOLDERS.SENT, label: "Sent", icon: "📤" },
    { id: FOLDERS.TRASH, label: "Trash", icon: "🗑" },
    { id: FOLDERS.VAULT, label: "Vault", icon: "🔒" }
  ];

  function change(folder: string) {
    mails.setFolder(folder);
  }

  function compose() {
    ui.openCompose();
  }
</script>

{#if $ui.mobile}
<nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#0b0c10]/95 backdrop-blur border-t border-white/5">
  <div class="flex items-center justify-around py-2">

    {#each tabs as tab}
      <button
        on:click={() => change(tab.id)}
        class="flex flex-col items-center justify-center text-xs px-2 py-1 transition"
      >
        <span class={`text-lg ${$mails.folder === tab.id ? "text-white" : "text-gray-500"}`}>
          {tab.icon}
        </span>
        <span class={`${$mails.folder === tab.id ? "text-white" : "text-gray-500"}`}>
          {tab.label}
        </span>
      </button>
    {/each}

    <!-- Floating compose -->
    <button
      on:click={compose}
      class="absolute -top-6 right-5 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl active:scale-95"
    >
      ✎
    </button>

  </div>
</nav>
{/if}