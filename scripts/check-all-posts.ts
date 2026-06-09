import "dotenv/config"

async function main() {
  const token = process.env.FACEBOOK_PAGE_TOKEN
  
  if (!token) {
    console.error("Token is missing in .env")
    return
  }
  
  console.log("Querying debug_token info...")
  try {
    const debugUrl = `https://graph.facebook.com/v19.0/debug_token?input_token=${token}&access_token=${token}`
    const res1 = await fetch(debugUrl)
    const json1 = await res1.json()
    console.log("Debug Token Output:")
    console.log(JSON.stringify(json1, null, 2))
  } catch (e) {
    console.error(e)
  }

  console.log("Querying me/accounts...")
  try {
    const url = `https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`
    const res = await fetch(url)
    const json = await res.json()
    console.log("Accounts Output:")
    console.log(JSON.stringify(json, null, 2))
  } catch (err) {
    console.error("Error fetching accounts:", err)
  }
}

main()
