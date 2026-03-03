<!-- src/lib/components/mail/MailView.svelte -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { mails } from "$lib/stores/mails";
  import AttachmentPreview from "./AttachmentPreview.svelte";
  import { formatDate, extractName } from "$lib/utils/format";

  export let mail: any = null;

  const dispatch = createEventDispatcher();

  function close() {
    mails.close();
    dispatch("close");
  }

  function deleteMail() {
    if (!mail) return;
    mails.delete(mail, mail.folder === "trash");
    dispatch("delete", mail);
  }

  function toggleStar() {
    if (!mail) return;
    mails.toggleStar(mail);
  }
</script>

{#if mail}
<div class="fixed inset-0 z-[70] bg-[#0b0c10] flex flex-col animate-in">
  
  <!-- Header -->
  <div class="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0b0c10]/90 backdrop-blur">
    <button
      on:click={close}
      class="text-gray-400 hover:text-white text-sm"
    >
      ← Back
    </button>

    <div class="flex items-center gap-4">
      <button
        on:click={toggleStar}
        class="text-yellow-400 text-lg"
      >
        {mail.starred ? "★" : "☆"}
      </button>

      <button
        on:click={deleteMail}
        class="text-red-400 hover:text-red-500 text-sm"
      >
        Delete
      </button>
    </div>
  </div>

  <!-- Content scroll -->
  <div class="flex-1 overflow-y-auto px-5 py-6 space-y-6">

    <!-- Subject -->
    <div>
      <h1 class="text-xl font-semibold text-white">
        {mail.subject || "(No subject)"}
      </h1>

      <div class="text-xs text-gray-400 mt-2 flex items-center gap-2">
        <span>From: {extractName(mail.from)}</span>
        <span>•</span>
        <span>{formatDate(mail.time)}</span>
      </div>
    </div>

    <!-- Attachments -->
    {#if mail.attachments && mail.attachments.length > 0}
      <div class="space-y-2">
        <p class="text-sm text-gray-400 mb-2">Attachments</p>

        {#each mail.attachments as file}
          <AttachmentPreview {file} />
        {/each}
      </div>
    {/if}

    <!-- Body -->
    <div class="bg-[#0f1115] border border-white/5 rounded-2xl p-4">
      {#if mail.html}
        <div
          class="prose prose-invert max-w-none text-sm"
          innerHTML={mail.html}
        />
      {:else}
        <pre class="whitespace-pre-wrap text-sm text-gray-200">
{mail.text}
        </pre>
      {/if}
    </div>

  </div>
</div>
{/if}

<style>
.animate-in {
  animation: slideIn .25s ease;
}
@keyframes slideIn {
  from { transform: translateX(40px); opacity:0; }
  to { transform: translateX(0); opacity:1; }
}
</style>