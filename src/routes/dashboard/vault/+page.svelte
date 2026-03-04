<!-- src/routes/dashboard/vault/+page.svelte -->

<script lang="ts">
  import { onMount } from "svelte";
  import { mails } from "$lib/stores/mails";
  import MailList from "$lib/components/mail/MailList.svelte";
  import MailView from "$lib/components/mail/MailView.svelte";

  onMount(() => {
    mails.setFolder("vault");
  });
</script>

<div class="flex h-full">

  <!-- Mail list -->
  <div class={`flex-1 md:max-w-md border-r border-white/5 ${$mails.selected ? "hidden md:block" : ""}`}>
    <MailList />
  </div>

  <!-- Mail view -->
  <div class="flex-1">
    {#if $mails.selected}
      <MailView mail={$mails.selected} />
    {:else}
      <div class="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
        <div class="text-3xl mb-2">🔒</div>
        Private Vault  
        <span class="text-xs text-gray-600 mt-1">Hidden secure mails</span>
      </div>
    {/if}
  </div>

</div>
