<script>
  import {
    TabGroup,
    Tab,
    Table,
    tableMapperValues,
    getModalStore
  } from '@skeletonlabs/skeleton'

  export let data
  const { archivedThesis, thesisRequests } = data

  const modalStore = getModalStore()

  let currentTab = 'archived-thesis'

  const archivedThesisTable = {
    head: ['Title', 'Description', 'Authors', 'Published Date', 'Upload Date'],
    body: tableMapperValues(archivedThesis, ['title', 'description', 'authors', 'publishedDate', 'uploadDate']),
    meta: tableMapperValues(archivedThesis, ['id', 'email', 'title', 'description', 'authors', 'publishedDate', 'uploadDate', 'pdf'])
  }

  const thesisRequestsTable = {
    head: ['Title', 'Description', 'Authors', 'Published Date', 'Upload Date'],
    body: tableMapperValues(thesisRequests, ['title', 'description', 'authors', 'publishedDate', 'uploadDate']),
    meta: tableMapperValues(thesisRequests, ['id', 'email', 'title', 'description', 'authors', 'publishedDate', 'uploadDate', 'pdf'])
  }

  function manageArchivedThesis(thesis) {
    modalStore.trigger({
      type: 'component',
      component: 'thesis',
      meta: { thesis, isArchived: true }
    })
  }

  function manageThesisRequest(thesis) {
    modalStore.trigger({
      type: 'component',
      component: 'thesis',
      meta: { thesis, isRequest: true }
    })
  }
</script>

<div class="container p-8">
  <div class="flex items-center justify-between">
    <h1 class="h1">Dashboard</h1>
    <h1 class="h1">
      {currentTab === "archived-thesis" ?
        "Manage Archived Thesis" :
        "Thesis Upload Requests"}
    </h1>
  </div>

  <div class="mt-12">
    <TabGroup>
      <Tab bind:group={currentTab} value="archived-thesis">
        <svelte:fragment slot="lead">
          <i class="fas fa-books fa-2x"></i>
        </svelte:fragment>
        <span class="h4 font-bold">Manage Archived Thesis</span>
      </Tab>

      <Tab bind:group={currentTab} value="thesis-request">
        <svelte:fragment slot="lead">
          <i class="fas fa-tasks-alt fa-2x"></i>
        </svelte:fragment>
        <span class="h4 font-bold">Manage Upload Requests</span>
      </Tab>

      <svelte:fragment slot="panel">
        {#if currentTab === "archived-thesis"}
          {#if archivedThesis.length <= 0}
            <h3 class="h3 text-center mt-8">No Archived Thesis Found</h3>
          {:else}
            <Table on:selected={(event) => manageArchivedThesis(event.detail)} source={archivedThesisTable} interactive />
          {/if}
        {/if}

        {#if currentTab === "thesis-request"}
          {#if thesisRequests.length <= 0}
            <h3 class="h3 text-center mt-8">No Thesis Requests Found</h3>
          {:else}
            <Table on:selected={(event) => manageThesisRequest(event.detail)} source={thesisRequestsTable} interactive />
          {/if}
        {/if}
      </svelte:fragment>
    </TabGroup>
  </div>
</div>
