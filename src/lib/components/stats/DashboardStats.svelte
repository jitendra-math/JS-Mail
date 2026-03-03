<!-- src/lib/components/stats/DashboardStats.svelte -->

<script lang="ts">
  import { mails } from "$lib/stores/mails";

  let $mails;
  const unsub = mails.subscribe(v => $mails = v);

  $: total = $mails?.total || 0;
  $: unread = ($mails?.mails || []).filter(m => !m.read).length;
  $: starred = ($mails?.mails || []).filter(m => m.starred).length;
  $: attachments =
    ($mails?.mails || []).reduce((acc, m) => acc + (m.attachments?.length || 0), 0);

  const cards = [
    { label: "Total", value: total, color: "from-blue-500 to-indigo-600" },
    { label: "Unread", value: unread, color: "from-green-500 to-emerald-600" },
    { label: "Starred", value: starred, color: "from-yellow-500 to-orange-500" },
    { label: "Files", value: attachments, color: "from-purple-500 to-pink-600" }
  ];
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 py-3">
  {#each cards as c}
    <div class="rounded-2xl p-4 bg-[#0f1115] border border-white/5 relative overflow-hidden">

      <!-- glow bg -->
      <div class={`absolute inset-0 opacity-10 bg-gradient-to-br ${c.color}`}></div>

      <div class="relative">
        <p class="text-xs text-gray-400">{c.label}</p>
        <h3 class="text-xl font-semibold text-white mt-1">{c.value}</h3>
      </div>

    </div>
  {/each}
</div>