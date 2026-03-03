<!-- src/routes/+page.svelte -->

<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { auth } from "$lib/stores/auth";
  import Loader from "$lib/components/ui/Loader.svelte";

  let $auth;
  const unsub = auth.subscribe(v => $auth = v);

  onMount(async () => {
    const ok = await auth.check();

    if (ok) {
      goto("/dashboard/inbox");
    } else {
      goto("/login");
    }
  });
</script>

<div class="h-screen flex items-center justify-center bg-[#0b0c10]">
  <Loader text="Opening JSMail..." />
</div>