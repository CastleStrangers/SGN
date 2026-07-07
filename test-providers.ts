import { generateText, getEnvVar } from "./src/lib/ai/provider";

async function testProvider(name: string, envVar: string) {
  console.log(`\n--- Testing ${name} ---`);
  // Get API key using getEnvVar which reads from .env
  const key = getEnvVar(envVar);
  if (!key) {
    console.log(`Skipped: ${envVar} is not defined in environment variables.`);
    return;
  }

  // Set the key in process.env so the provider can read it if it relies on process.env
  process.env[envVar] = key;

  try {
    process.env.AI_PROVIDER = name.toLowerCase();
    console.log(`Calling generateText using ${name}...`);
    const response = await generateText("Hello! Tell me one short sentence about Damascus.", "You are a helpful assistant.");
    console.log(`Success! Response: ${response.trim()}`);
  } catch (error) {
    console.error(`Failed to call ${name}:`, error);
  }
}

async function main() {
  console.log("Starting Multi-Provider AI test...");
  
  await testProvider("Groq", "GROQ_API_KEY");
  await testProvider("DeepSeek", "DEEPSEEK_API_KEY");
  await testProvider("GitHub", "GITHUB_TOKEN");
  await testProvider("Cerebras", "CEREBRAS_API_KEY");
  await testProvider("SiliconFlow", "SILICONFLOW_API_KEY");
  
  console.log("\nAll tests completed!");
}

main();
