<!-- src/lib/components/ui/Input.svelte -->

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: string = "";
  export let placeholder: string = "";
  export let type: string = "text";
  export let disabled: boolean = false;
  export let error: string = "";
  export let label: string = "";
  export let required: boolean = false;

  const dispatch = createEventDispatcher();

  function onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    value = target.value;
    dispatch("input", value);
  }

  function onFocus(e: FocusEvent) {
    dispatch("focus", e);
  }

  function onBlur(e: FocusEvent) {
    dispatch("blur", e);
  }
</script>

<div class="w-full">
  {#if label}
    <label class="block text-sm text-gray-400 mb-1">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <input
    class={`w-full px-4 py-2.5 rounded-xl bg-[#0f1115] border text-gray-100 placeholder-gray-500 outline-none transition-all
    ${
      error
        ? "border-red-500 focus:border-red-500"
        : "border-white/10 focus:border-blue-500"
    }
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    bind:value
    {placeholder}
    {type}
    {disabled}
    on:input={onInput}
    on:focus={onFocus}
    on:blur={onBlur}
  />

  {#if error}
    <p class="text-red-500 text-xs mt-1">{error}</p>
  {/if}
</div>