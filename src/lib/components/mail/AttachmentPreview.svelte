<!-- src/lib/components/mail/AttachmentPreview.svelte -->

<script lang="ts">
  import { formatBytes } from "$lib/utils/format";

  export let file: {
    filename: string;
    url: string;
    size?: number;
    contentType?: string;
  };

  const isImage = () => {
    if (!file?.contentType) return false;
    return file.contentType.startsWith("image");
  };

  const isPDF = () => {
    if (!file?.filename) return false;
    return file.filename.toLowerCase().endsWith(".pdf");
  };

  const ext = () => {
    if (!file?.filename) return "";
    const parts = file.filename.split(".");
    return parts.length > 1 ? parts.pop()?.toUpperCase() : "";
  };

  function download() {
    if (!file?.url) return;
    window.open(file.url, "_blank");
  }
</script>

<div
  class="flex items-center gap-3 bg-[#111318] border border-white/5 hover:border-white/10 transition rounded-xl px-3 py-2"
>
  <!-- Preview icon/image -->
  {#if isImage()}
    <img
      src={file.url}
      alt={file.filename}
      class="w-12 h-12 object-cover rounded-lg border border-white/10"
      loading="lazy"
    />
  {:else}
    <div
      class="w-12 h-12 rounded-lg flex items-center justify-center bg-[#1a1d24] border border-white/10 text-xs font-bold text-gray-300"
    >
      {#if isPDF()}
        PDF
      {:else}
        {ext() || "FILE"}
      {/if}
    </div>
  {/if}

  <!-- File info -->
  <div class="flex-1 min-w-0">
    <p class="text-sm text-gray-200 truncate">{file.filename}</p>

    {#if file.size}
      <p class="text-xs text-gray-500">{formatBytes(file.size)}</p>
    {/if}
  </div>

  <!-- Action -->
  <button
    class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold transition active:scale-95"
    on:click={download}
  >
    Open
  </button>
</div>