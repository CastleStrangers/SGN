import { generateText } from "./src/lib/ai/provider";

async function main() {
  console.log("Starting Groq connection test...");
  try {
    // We override process.env.AI_PROVIDER to "groq" for testing
    process.env.AI_PROVIDER = "groq";

    // Call generateText
    const response = await generateText("Hello! Tell me one short sentence about Damascus.", "You are a helpful assistant.");
    console.log("Groq responded successfully!");
    console.log("Response:", response);
  } catch (error) {
    console.error("Failed to call Groq:", error);
  }
}

main();
