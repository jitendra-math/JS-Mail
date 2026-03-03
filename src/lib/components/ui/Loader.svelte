<!-- src/lib/components/ui/Loader.svelte -->

<script lang="ts">
  export let size: number = 28; // px
  export let color: string = "#3b82f6"; // blue
  export let text: string = "";
</script>

<div class="flex flex-col items-center justify-center gap-2">
  <!-- Spinner -->
  <svg
    class="animate-spin"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      stroke-width="3"
      opacity="0.2"
    />
    <path
      d="M22 12a10 10 0 00-10-10"
      stroke={color}
      stroke-width="3"
      stroke-linecap="round"
    />
  </svg>

  {#if text}
    <span class="text-sm text-gray-400">{text}</span>
  {/if}
</div>