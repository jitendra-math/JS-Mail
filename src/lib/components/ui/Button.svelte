<!-- src/lib/components/ui/Button.svelte -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let variant: "primary" | "secondary" | "ghost" | "danger" = "primary";
  export let size: "sm" | "md" | "lg" = "md";
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let type: "button" | "submit" | "reset" = "button";

  const dispatch = createEventDispatcher();

  function handleClick(event: MouseEvent) {
    if (disabled || loading) return;
    dispatch("click", event);
  }

  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none active:scale-95";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20",
    secondary:
      "bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700",
    ghost:
      "bg-transparent text-gray-300 hover:bg-gray-800/60",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
</script>

<button
  class={`${base} ${variants[variant]} ${sizes[size]} ${
    disabled || loading ? "opacity-50 cursor-not-allowed" : ""
  }`}
  {type}
  on:click={handleClick}
  disabled={disabled || loading}
>
  {#if loading}
    <svg
      class="animate-spin h-4 w-4 mr-2"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  {/if}

  <slot />
</button>