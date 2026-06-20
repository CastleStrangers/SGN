import "dotenv/config"

const GRAPH_API = "https://graph.facebook.com/v19.0"

async function main() {
  const pageId = process.env.FACEBOOK_PAGE_ID
  const token = process.env.FACEBOOK_PAGE_TOKEN

  if (!pageId || !token) {
    console.error("Missing FACEBOOK_PAGE_ID or FACEBOOK_PAGE_TOKEN in .env")
    return
  }

  const params = new URLSearchParams({
    fields: "id,message,story,full_picture,created_time,permalink_url,attachments",
    limit: "25",
    access_token: token,
  })

  const url = `${GRAPH_API}/${pageId}/posts?${params.toString()}`
  console.log("Fetching from Facebook Graph API...")
  const res = await fetch(url)
  const json = await res.json()

  if (json.error) {
    console.error("Facebook API Error:", json.error)
    return
  }

  const posts = json.data || []
  console.log(`Retrieved ${posts.length} posts from Facebook page.`)

  posts.forEach((post: any, i: number) => {
    console.log(`\n[Post ${i+1}] ID: ${post.id}`)
    console.log(`Title/Msg: ${post.message ? post.message.substring(0, 80).replace(/\n/g, ' ') : '(no message)'}`)
    console.log(`Full Picture: ${post.full_picture || 'None'}`)
    
    const atts = post.attachments?.data || []
    console.log(`Attachments count: ${atts.length}`)
    atts.forEach((att: any, attIdx: number) => {
      console.log(`  Attachment ${attIdx+1} Type: ${att.type}`)
      console.log(`  Attachment Media: ${att.media ? JSON.stringify(att.media) : 'None'}`)
      if (att.subattachments?.data) {
        console.log(`  Subattachments count: ${att.subattachments.data.length}`)
        att.subattachments.data.forEach((sub: any, subIdx: number) => {
          console.log(`    Sub ${subIdx+1} Type: ${sub.type}`)
          console.log(`    Sub Media: ${sub.media ? JSON.stringify(sub.media) : 'None'}`)
        })
      }
    })
  })
}

main().catch(console.error)
