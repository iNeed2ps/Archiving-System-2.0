<script>
  import { AppBar } from '@skeletonlabs/skeleton'
  import { goto } from '$app/navigation'

  export let data
  let { supabase, session } = data
  $: ({ supabase, session } = data)

  async function logout() {
    await supabase.auth.signOut()
    goto('/')
  }
</script>

<AppBar
  background="bg-surface-200"
  shadow="shadow-lg"
  padding="p-8"
>
  <svelte:fragment slot="lead">
    <a href="/" class="text-3xl uppercase font-bold">
      <span class="text-primary-500 underline decoration-2 decoration-secondary-500">Thesis</span>
      <span class="text-secondary-500">Archiver</span>
    </a>
  </svelte:fragment>

  <svelte:fragment slot="trail">
    <a href="/archived-thesis" class="btn btn-lg variant-filled-primary">
      <span>Archives</span>
      <span>
        <i class="fas fa-books"></i>
      </span>
    </a>

    <a href="/upload-thesis" class="btn btn-lg variant-filled-primary">
      <span>Upload Thesis</span>
      <span>
        <i class="fas fa-upload"></i>
      </span>
    </a>

    {#if session}
      <button on:click={logout} class="btn btn-lg variant-filled-error">
        <span>Logout</span>
      </button>
    {/if}
  </svelte:fragment>
</AppBar>
