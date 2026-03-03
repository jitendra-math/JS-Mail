<!-- src/routes/dashboard/+page.svelte -->

<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { auth } from "$lib/stores/auth";

  import Sidebar from "$lib/components/layout/Sidebar.svelte";
  import Header from "$lib/components/layout/Header.svelte";
  import BottomNav from "$lib/components/layout/BottomNav.svelte";
  import ComposeModal from "$lib/components/mail/ComposeModal.svelte";
  import DashboardStats from "$lib/components/stats/DashboardStats.svelte";

  import { ui } from "$lib/stores/ui";

  let $auth;
  let $ui;

  const unsubAuth = auth.subscribe(v => $auth = v);
  const unsubUI = ui.subscribe(v => $ui = v);

  onMount(async () => {
    const ok = await auth.check();
    if (!ok) goto("/login");
  });
</script>

<div class="h-screen flex bg-[#0b0c10] text-white overflow-hidden">

  <!-- Sidebar -->
  <Sidebar />

  <!-- Main -->
  <div class="flex-1 flex flex-col min-w-0">

    <Header />

    <!-- Stats -->
    <DashboardStats />

    <!-- Slot (inbox/sent etc pages render here) -->
    <div class="flex-1 overflow-hidden">
      <slot />
    </div>

  </div>

</div>

<!-- Compose Modal -->
<ComposeModal open={$ui.composeOpen} />

<!-- Mobile bottom nav -->
<BottomNav />