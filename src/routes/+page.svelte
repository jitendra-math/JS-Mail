<!-- src/routes/dashboard/+page.svelte -->

<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import Header from "$lib/components/layout/Header.svelte";
  import Sidebar from "$lib/components/layout/Sidebar.svelte";
  import BottomNav from "$lib/components/layout/BottomNav.svelte";

  import DashboardStats from "$lib/components/stats/DashboardStats.svelte";
  import ComposeModal from "$lib/components/mail/ComposeModal.svelte";

  import { auth } from "$lib/stores/auth";
  import { ui } from "$lib/stores/ui";

  onMount(async () => {
    const ok = await auth.check();
    if (!ok) {
      goto("/login");
    }
  });
</script>

<div class="flex h-screen bg-[#0b0c10] text-white overflow-hidden">

  <Sidebar />

  <div class="flex-1 flex flex-col">

    <Header />

    <main class="flex-1 overflow-y-auto">
      <DashboardStats />
      <slot />
    </main>

  </div>

</div>

<BottomNav />
<ComposeModal open={$ui.composeOpen} />
