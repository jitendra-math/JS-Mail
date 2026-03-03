<!-- src/routes/+layout.svelte -->

<script lang="ts">
  import { onMount } from "svelte";
  import { auth } from "$lib/stores/auth";
  import { ui } from "$lib/stores/ui";
  import Loader from "$lib/components/ui/Loader.svelte";
  import "../styles/globals.css";

  let $auth;
  let $ui;

  const unsubAuth = auth.subscribe(v => $auth = v);
  const unsubUI = ui.subscribe(v => $ui = v);

  onMount(() => {
    ui.init();
    auth.check();
  });
</script>

{#if $auth?.loading}
<div class="h-screen flex items-center justify-center bg-[#0b0c10]">
  <Loader text="Loading JSMail..." />
</div>

{:else}
<slot />
{/if}