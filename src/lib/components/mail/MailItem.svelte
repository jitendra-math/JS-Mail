<!-- src/lib/components/mail/MailItem.svelte -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { formatDate, truncate, extractName } from "$lib/utils/format";

  export let mail: any;

  const dispatch = createEventDispatcher();

  function openMail() {
    dispatch("open", mail);
  }

  function toggleStar(e: MouseEvent) {
    e.stopPropagation();
    dispatch("star", mail);
  }

  function getInitial(name: string) {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  }
</script>

<div
  class="group flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
  hover:bg-white/5 border border-transparent hover:border-white/5"
  on:click={openMail}
>
  <!-- Avatar -->
  <div
    class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
    bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
  >
    {getInitial(extractName(mail.from))}
  </div>

  <!-- Content -->
  <div class="flex-1 min-w-0">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <p
          class={`text-sm truncate ${
            mail.read ? "text-gray-400" : "text-white font-semibold"
          }`}
        >
          {extractName(mail.from)}
        </p>

        {#if mail.starred}
          <span class="text-yellow-400 text-xs">★</span>
        {/if}
      </div>

      <span class="text-xs text-gray-500 whitespace-nowrap">
        {formatDate(mail.time)}
      </span>
    </div>

    <p
      class={`text-sm truncate ${
        mail.read ? "text-gray-500" : "text-gray-200 font-medium"
      }`}
    >
      {mail.subject || "(No subject)"}
    </p>

    {#if mail.preview}
      <p class="text-xs text-gray-500 truncate mt-0.5">
        {truncate(mail.preview, 90)}
      </p>
    {/if}
  </div>

  <!-- Star button -->
  <button
    class="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-yellow-400"
    on:click={toggleStar}
  >
    {mail.starred ? "★" : "☆"}
  </button>
</div>