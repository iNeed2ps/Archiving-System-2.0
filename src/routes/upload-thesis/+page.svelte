<script>
  import { getToastStore } from '@skeletonlabs/skeleton'

  // Svelte props
  export let data

  // Get supabase from data
  const { supabase } = data

  // Get the toast store
  const toastStore = getToastStore()

  // Variables for the form
  let email, title, description,
      authors, publishedDate

  // Pdf file var
  let pdfFile = null

  // A function for uploading the file
  async function uploadFile() {
    const id = crypto.randomUUID()
    const file = pdfFile[0]
    const { error } = await supabase.storage
      .from('pdf_thesis')
      .upload(`${id}.pdf`, file, {
        upsert: true
      })

    if (error) return false
    return `${id}.pdf`
  }

  // Submit handler
  async function submit() {
    toastStore.trigger({
      message: 'Submitting...',
      background: 'bg-tertiary-500'
    })

    // Call uploadFile() to upload the pdf
    const pdfID = await uploadFile()

    // SOmething went wrong if there is no pdf id
    if (!pdfID) {
      return toastStore.trigger({
        message: 'Something went wrong in the pdf file',
        background: 'bg-error-500'
      })
    }

    // Insert the thesis into database
    const { error, data } = await supabase
      .from('thesis_requests')
      .insert({
        email,
        title,
        description,
        authors: authors.split(',').map(v => v.trim()),
        pdf: pdfID,
        publishedDate,
      })
      .select()
      .single()

    // If error show a error toast
    if (error) {
      toastStore.trigger({
        message: 'Server error. Something went wrong',
        background: 'bg-error-500'
      })
    }

    // If success show a success toast
    if (data) {
      toastStore.clear()
      toastStore.trigger({
        message: 'Successfuly submited!',
        background: 'bg-success-500'
      })

      // Reset the form variables
      email = ''
      title = ''
      description = ''
      authors = ''
      publishedDate = ''
      pdfFile = ''
    }
  }
</script>

<div class="container p-8 max-w-2xl">
  <h1 class="h1 text-center">Upload Thesis</h1>

  <form on:submit|preventDefault={submit} class="mt-12 space-y-8" method="POST">
    <label>
      <span>Email (Note: This will be your identifier)</span>
      <input bind:value={email} type="email" class="input" placeholder="example@gmail.com" required />
    </label>

    <label>
      <span>Title</span>
      <input bind:value={title} type="text" class="input" placeholder="The Impact of Renewable Energy on Climate Change Mitigation" required />
    </label>

    <label>
      <span>Description</span>
      <input bind:value={description} type="text" class="input" placeholder="This thesis explores the effectiveness of renewable energy sources in reducing carbon emissions and combating climate change." required />
    </label>

    <label>
      <span>Authors (Seperated by comma,)</span>
      <input bind:value={authors} type="text" class="input" placeholder="Michael Johnson, Emily Brown" required />
    </label>

    <label>
      <span>Published Date</span>
      <input bind:value={publishedDate} type="number" min="1900" max="2099" step="1" class="input" placeholder="2021" required />
    </label>

    <label>
      <span>Thesis PDF</span>
      <input bind:files={pdfFile} type="file" name="pdf" accept="application/pdf" class="input" required />
    </label>

    <button class="btn variant-filled-primary w-full" type="submit">Submit</button>
  </form>
</div>
