export async function load({ locals: { supabase, getSession } }) {
  const session = await getSession() // Get session
  if (!session) return // If there is none it means admin is not logged in

  // Get the archivedThesis in db
  const { data: archivedThesis } = await supabase
    .from('archived_thesis')
    .select()

  // Get the thesisRequests in db
  const { data: thesisRequests } = await supabase
    .from('thesis_requests')
    .select()

  // Return those
  return {
    archivedThesis: archivedThesis ?? [],
    thesisRequests: thesisRequests ?? []
  }
}
