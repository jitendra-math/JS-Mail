<!-- src/lib/components/ui/Modal.svelte -->

<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  export let open: boolean = false;
  export let closeOnOutside: boolean = true;
  export let closeOnEsc: boolean = true;
  export let width: string = "500px";

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }

  function handleBackdrop(e: MouseEvent) {
    if (!closeOnOutside) return;
    if (e.target === e.currentTarget) close();
  }

  function handleKey(e: KeyboardEvent) {
    if (!closeOnEsc) return;
    if (e.key === "Escape") close();
  }

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  });
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade"
    on:click={handleBackdrop}
  >
    <!-- Modal -->
    <div
      class="bg-[#0f1115] text-gray-100 rounded-2xl shadow-2xl border border-white/5 w-full animate-scale"
      style="max-width:{width}"
    >
      <!-- Header slot -->
      <div class="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <slot name="header" />
        <button
          class="text-gray-400 hover:text-white text-xl leading-none"
          on:click={close}
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-5">
        <slot />
      </div>

      <!-- Footer slot -->
      <div class="px-5 py-4 border-t border-white/5">
        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}

<style>
  .animate-fade {
    animation: fadeIn 0.18s ease;
  }

  .animate-scale {
    animation: scaleIn 0.18s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>