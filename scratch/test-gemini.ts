import "dotenv/config"
import { generateText } from "../src/lib/ai/provider"

async function main() {
  console.log("Testing generateText using current AI_PROVIDER...")
  try {
    const res = await generateText("Say hello in Arabic", "You are a helpful assistant")
    console.log("Response successful:")
    console.log(res)
  } catch (err) {
    console.error("Test failed with error:")
    console.error(err)
  }
}

main()
