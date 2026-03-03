<!-- src/routes/dashboard/inbox/+page.svelte -->

<script lang="ts">
  import { onMount } from "svelte";
  import { mails } from "$lib/stores/mails";
  import MailList from "$lib/components/mail/MailList.svelte";
  import MailView from "$lib/components/mail/MailView.svelte";

  let $mails;
  const unsub = mails.subscribe(v => $mails = v);

  onMount(() => {
    mails.setFolder("inbox");
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
      <div class="h-full flex items-center justify-center text-gray-500 text-sm">
        Select a mail to read
      </div>
    {/if}
  </div>

</div>