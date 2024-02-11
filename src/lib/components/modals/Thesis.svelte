<script>
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton'
  import { page } from '$app/stores'

  const { supabase } = $page.data

  const modalStore = getModalStore()
  const toastStore = getToastStore()

  const [id, email, title, description, authors, publishedDate, uploadDate, pdf] = $modalStore[0].meta.thesis
  const { isArchived, isRequest } = $modalStore[0].meta

  async function downloadPdf() {
    const { error, data } = await supabase.storage
      .from('pdf_thesis')
      .download(pdf)

    if (error) {
      modalStore.close()
      return toastStore.trigger({
        message: 'Server error. Can\'t download the pdf',
        background: 'bg-error-500'
      })
    }

    if (data) {
      const url = window.URL.createObjectURL(data)
      window.open(url)
    }
  }

  function deleteThesis() {
    console.log(id)
    modalStore.close()
    modalStore.trigger({
      type: 'confirm',
      title: 'Please confirm',
      body: 'Are you sure you want to delete?',
      response: async (r) => {
        if (r) {
          const { error } = await supabase
            .from('archived_thesis')
            .delete()
            .eq('id', id)

          if (error) {
            return toastStore.trigger({
              message: 'Server error. Error deleting the thesis',
              background: 'bg-error-500'
            })
          }

          toastStore.trigger({
            message: 'Successfuly deleted requested thesis',
            background: 'bg-success-500'
          })

          location.reload()
        }
      }
    })
  }

  async function acceptThesis() {
    modalStore.close()

    const { error: requestErr } = await supabase
      .from('thesis_requests')
      .delete()
      .eq('id', id)

    if (requestErr) {
      return toastStore.trigger({
        message: 'Server error. Error deleting the thesis',
        background: 'bg-error-500'
      })
    }

    const { error, data } = await supabase
      .from('archived_thesis')
      .insert({
        email,
        title,
        description,
        authors,
        publishedDate,
        uploadDate,
        pdf
      })
      .select()
      .single()

    if (error) {
      console.log(error)
      return toastStore.trigger({
        message: 'Server error. Error accepting the thesis',
        background: 'bg-error-500'
      })
    }

    if (data) {
      toastStore.trigger({
        message: 'Successfuly accepted thesis',
        background: 'bg-success-500'
      })
    }

    setTimeout(() => {
      location.reload()
    }, 1000)
  }

  function declineThesis() {
    modalStore.close()
    modalStore.trigger({
      type: 'confirm',
      title: 'Please confirm',
      body: 'Are you sure you want to decline?',
      response: async (r) => {
        if (r) {
          const { error } = await supabase
            .from('thesis_requests')
            .delete()
            .eq('id', id)

          if (error) {
            return toastStore.trigger({
              message: 'Server error. Error deleting the thesis',
              background: 'bg-error-500'
            })
          }

          toastStore.trigger({
            message: 'Successfuly declined requested thesis',
            background: 'bg-success-500'
          })

          setTimeout(() => {
            location.reload()
          }, 1000)
        }
      }
    })
  }
</script>

<div class="card relative bg-surface-500 p-8 w-3/6">
  <!-- Work around for auto focus thing in navbar -->
  <button class="absolute top-[-999rem]"></button>

  <button on:click={() => modalStore.close()} class="absolute top-8 right-8 btn btn-icon-sm variant-filled-secondary">
    <i class="fas fa-times"></i>
  </button>

  <h2 class="h2 uppercase text-primary-500 max-w-2xl">
    <span>‣ {title}</span>
  </h2>

  <div class="mt-8">
    <h4 class="h4">- {description}</h4>
    {#if isArchived || isRequest}
      <h4 class="h4">
        <span class="font-bold">Email Submitter:</span>
        <span>{email}</span>
      </h4>
    {/if}
    <h4 class="h4">
      <span class="font-bold">Authors:</span>
      {#each authors as author}
        <span class="badge bg-tertiary-500 mr-1">{author}</span>
      {/each}
    </h4>

    <div class="mt-2">
      <span class="badge bg-success-500">Published: {publishedDate}</span>
      <span class="badge bg-success-500">Uploaded: {uploadDate}</span>
    </div>

    <div class="mt-8 space-x-2">
      <button on:click={downloadPdf} class="btn variant-filled-primary">Download PDF</button>
      {#if isArchived}
        <button on:click={deleteThesis} class="btn variant-filled-error">Delete</button>
      {/if}

      {#if isRequest}
        <button on:click={acceptThesis} class="btn variant-filled-success">Accept</button>
        <button on:click={declineThesis} class="btn variant-filled-error">Decline</button>
      {/if}
    </div>
  </div>
</div>
