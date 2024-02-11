export async function load({ locals: { getSession } }) {
  // return the session in every page
  return {
    session: await getSession()
  }
}
