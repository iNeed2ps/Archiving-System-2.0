<script>
  import {
    Table,
    getModalStore,
    tableMapperValues
  } from '@skeletonlabs/skeleton'
  
  // Svelte props
  export let data
  
  // Get the archived thesis from the props
  let { archivedThesis } = data
  const modalStore = getModalStore()
  
  // The table data
  let table = {
    head: ['Title', 'Description', 'Authors', 'Published Date', 'Upload Date'],
    body: tableMapperValues(archivedThesis, ['title', 'description', 'authors', 'publishedDate', 'uploadDate']),
    meta: tableMapperValues(archivedThesis, ['id', 'email', 'title', 'description', 'authors', 'publishedDate', 'uploadDate', 'pdf'])
  }
  
  // Function to filter archived thesis based on search input
  function filterThesis(query) {
    if (!query) {
      table.body = tableMapperValues(archivedThesis, ['title', 'description', 'authors', 'publishedDate', 'uploadDate']);
    } else {
      query = query.toLowerCase();
      table.body = tableMapperValues(
        archivedThesis.filter(thesis =>
          Object.values(thesis)
            .join(' ')
            .toLowerCase()
            .includes(query)
        ),
        ['title', 'description', 'authors', 'publishedDate', 'uploadDate']
      );
    }
  }
  
  // Open up the thesis popup
  function seeThesisInfo(thesis) {
    modalStore.trigger({
      type: 'component',
      component: 'thesis',
      meta: { thesis: thesis.detail }
    })
  }
</script>

<div class="container px-8 py-16">
  <h1 class="h1 text-center underline decoration-tertiary-500 decoration-2">
    <span class="text-secondary-500 mr-4">
      <i class="fas fa-books"></i>
    </span>
    <span class="text-secondary-500">Archived</span>
    <span class="text-primary-500">Thesis</span>
    <span class="text-primary-500 ml-4">
      <i class="fas fa-books"></i>
    </span>
  </h1>

  <!-- Search box -->
  <div class="mt-4">
    <input
      type="text"
      placeholder="Search..."
      on:input={(e) => filterThesis(e.target.value)}
      class="p-2 border rounded-md w-full"
    />
  </div>

  {#if table.body.length <= 0}
    <h3 class="h3 text-center mt-8">No Archived Thesis Found</h3>
  {:else}
    <div class="mt-16">
      <Table on:selected={(thesis) => seeThesisInfo(thesis)} source={table} interactive />
    </div>
  {/if}
</div>
