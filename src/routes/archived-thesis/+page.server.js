export async function load({ locals: { supabase } }) {
  // Get the archived thesis from db
  const { data: archivedThesis } = await supabase
    .from('archived_thesis')
    .select()

  // Return it to the page
  return {
    archivedThesis: archivedThesis ?? [],
  }
}
