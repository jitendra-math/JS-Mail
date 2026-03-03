<!-- src/lib/components/mail/ComposeModal.svelte -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { mails } from "$lib/stores/mails";
  import { ui } from "$lib/stores/ui";
  import { EMAIL_PROFILES } from "$lib/config/constants";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Loader from "$lib/components/ui/Loader.svelte";
  import { apiUpload } from "$lib/utils/api";

  export let open: boolean = false;

  const dispatch = createEventDispatcher();

  let from = EMAIL_PROFILES[0].value;
  let to = "";
  let subject = "";
  let message = "";
  let sending = false;

  let attachments: any[] = [];
  let uploading = false;

  function close() {
    ui.closeCompose();
    dispatch("close");
  }

  async function handleSend() {
    if (!to) return alert("Recipient required");

    try {
      sending = true;

      await mails.send({
        from,
        to,
        subject,
        html: message,
        text: message,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          path: a.url
        }))
      });

      // reset
      from = EMAIL_PROFILES[0].value;
      to = "";
      subject = "";
      message = "";
      attachments = [];

      sending = false;
      close();
      mails.refresh();
    } catch (err: any) {
      sending = false;
      alert(err?.message || "Send failed");
    }
  }

  async function handleFile(e: Event) {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      uploading = true;

      const fd = new FormData();
      fd.append("file", file);

      const res: any = await apiUpload("/api/upload", fd);

      attachments = [
        ...attachments,
        { filename: res.name, url: res.url, size: res.size }
      ];
    } catch (err: any) {
      alert(err?.message || "Upload failed");
    } finally {
      uploading = false;
      target.value = "";
    }
  }

  function removeAttachment(i: number) {
    attachments = attachments.filter((_, idx) => idx !== i);
  }
</script>

{#if open}
<div class="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">

  <div class="w-full sm:w-[600px] h-[95vh] sm:h-auto bg-[#0b0c10] border border-white/5 rounded-t-3xl sm:rounded-2xl flex flex-col">

    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-white/5">
      <h2 class="text-white font-semibold">New Message</h2>
      <button class="text-gray-400 hover:text-white" on:click={close}>✕</button>
    </div>

    <!-- Body -->
    <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">

      <!-- From -->
      <div>
        <label class="text-xs text-gray-400">From</label>
        <select
          bind:value={from}
          class="w-full bg-[#0f1115] border border-white/10 rounded-xl px-3 py-2 text-sm mt-1 text-gray-200"
        >
          {#each EMAIL_PROFILES as p}
            <option value={p.value}>{p.label}</option>
          {/each}
        </select>
      </div>

      <!-- To -->
      <Input label="To" bind:value={to} placeholder="recipient@email.com" required />

      <!-- Subject -->
      <Input label="Subject" bind:value={subject} placeholder="Subject" />

      <!-- Message -->
      <div>
        <label class="text-xs text-gray-400">Message</label>
        <textarea
          bind:value={message}
          rows="10"
          class="w-full mt-1 bg-[#0f1115] border border-white/10 rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-blue-500"
          placeholder="Write message..."
        />
      </div>

      <!-- Attachments -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-400">Attachments</span>

          <label class="text-xs text-blue-400 cursor-pointer">
            {uploading ? "Uploading..." : "Add file"}
            <input type="file" class="hidden" on:change={handleFile} />
          </label>
        </div>

        {#each attachments as file, i}
          <div class="flex items-center justify-between bg-[#0f1115] border border-white/5 px-3 py-2 rounded-lg text-xs">
            <span class="truncate">{file.filename}</span>
            <button
              class="text-red-400"
              on:click={() => removeAttachment(i)}
            >
              remove
            </button>
          </div>
        {/each}
      </div>

    </div>

    <!-- Footer -->
    <div class="px-5 py-4 border-t border-white/5 flex justify-end gap-3">
      <Button variant="ghost" on:click={close}>Cancel</Button>
      <Button variant="primary" on:click={handleSend} disabled={sending || uploading}>
        {#if sending}
          <Loader size={16} />
        {:else}
          Send
        {/if}
      </Button>
    </div>

  </div>
</div>
{/if}