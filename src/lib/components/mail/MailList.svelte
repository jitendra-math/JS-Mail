<!-- src/lib/components/mail/MailList.svelte -->

<script lang="ts">
  import { onMount } from "svelte";
  import { mails } from "$lib/stores/mails";
  import { ui } from "$lib/stores/ui";
  import MailItem from "./MailItem.svelte";
  import Loader from "$lib/components/ui/Loader.svelte";

  let $mails;
  let $ui;

  const unsubscribeMails = mails.subscribe((v) => ($mails = v));
  const unsubscribeUI = ui.subscribe((v) => ($ui = v));

  onMount(() => {
    if ($mails.mails.length === 0) {
      mails.fetch();
    }

    return () => {
      unsubscribeMails();
      unsubscribeUI();
    };
  });

  function handleOpen(e: CustomEvent) {
    mails.open(e.detail);
  }

  function handleStar(e: CustomEvent) {
    mails.toggleStar(e.detail);
  }

  function refresh() {
    mails.refresh();
  }
</script>

<div class="flex flex-col h-full">
  <!-- Top bar -->
  <div class="flex items-center justify-between px-4 py-3 border-b border-white/5">
    <h2 class="text-sm font-semibold text-gray-300 uppercase tracking-wide">
      {$mails.folder}
    </h2>

    <button
      on:click={refresh}
      class="text-xs text-gray-400 hover:text-white transition"
    >
      Refresh
    </button>
  </div>

  <!-- List -->
  <div class="flex-1 overflow-y-auto px-2 py-2 space-y-1">
    {#if $mails.loading}
      <div class="flex items-center justify-center h-40">
        <Loader text="Loading mails..." />
      </div>
    {:else if $mails.mails.length === 0}
      <div class="flex items-center justify-center h-40 text-gray-500 text-sm">
        No mails found.
      </div>
    {:else}
      {#each $mails.mails as mail (mail.id)}
        <MailItem
          {mail}
          on:open={handleOpen}
          on:star={handleStar}
        />
      {/each}
    {/if}
  </div>
</div>