<script>
	import '../app.css'

  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'

  // Svelte props
  export let data

  // Get the supabase and session from data
  let { supabase, session } = data
  $: ({ supabase, session } = data)

  // Svelte hook for if the component is mounted
  onMount(() => {
    // Just a way for telling the website to invalidate the session if the user logouts or the session expires
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    // Unsubscribe
    return () => subscription.unsubscribe()
  })

  // Our Custom Components
  import AppBar from '$lib/components/AppBar.svelte'
  import Thesis from '$lib/components/modals/Thesis.svelte'

  import {
    AppShell,
    Modal,
    Toast,
    initializeStores
  } from '@skeletonlabs/skeleton'

  // Skeleton UI Specific stuff
  initializeStores()

  // Registry for modals
  const modalRegistry = {
    thesis: { ref: Thesis }
  }
</script>

<!-- Modal -->
<Modal components={modalRegistry} />

<!-- Toast -->
<Toast />

<!-- Our App -->
<AppShell>
	<svelte:fragment slot="header">
    <AppBar {data} />
	</svelte:fragment>

	<slot />
</AppShell>
