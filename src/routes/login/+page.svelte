<!-- src/routes/login/+page.svelte -->

<script lang="ts">
  import { auth } from "$lib/stores/auth";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Loader from "$lib/components/ui/Loader.svelte";
  import { goto } from "$app/navigation";

  let code = "";
  let error = "";
  let loading = false;

  async function login() {
    if (!code) {
      error = "Enter access code";
      return;
    }

    try {
      loading = true;
      error = "";

      const ok = await auth.login(code);

      if (ok) {
        goto("/dashboard/inbox");
      } else {
        error = "Invalid code";
      }
    } catch (e: any) {
      error = e?.message || "Login failed";
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-[#0b0c10] px-4">

  <div class="w-full max-w-md bg-[#0f1115] border border-white/5 rounded-3xl p-8 shadow-2xl">

    <!-- Logo -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-white tracking-wide">JSMail</h1>
      <p class="text-gray-500 text-sm mt-2">Private Mail System</p>
    </div>

    <!-- Input -->
    <div class="space-y-4">
      <Input
        label="Access Code"
        type="password"
        bind:value={code}
        placeholder="Enter master code"
        required
        on:keydown={(e) => e.key === "Enter" && login()}
      />

      {#if error}
        <p class="text-red-500 text-sm">{error}</p>
      {/if}

      <Button
        variant="primary"
        size="lg"
        on:click={login}
        disabled={loading}
      >
        {#if loading}
          <Loader size={18} />
        {:else}
          Enter Mail
        {/if}
      </Button>
    </div>

    <!-- Footer -->
    <p class="text-center text-xs text-gray-600 mt-6">
      Secure private system
    </p>

  </div>

</div>