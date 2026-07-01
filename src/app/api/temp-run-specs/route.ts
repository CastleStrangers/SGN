import { NextResponse } from "next/server";
import { generateChat } from "@/lib/ai/provider";

export async function GET() {
  const diagnostics: any = {};
  
  // 1. Check Env
  diagnostics.env = {
    AI_PROVIDER: process.env.AI_PROVIDER,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    OPENAI_API_KEY_exists: !!process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY_exists: !!process.env.ANTHROPIC_API_KEY,
  };

  // 2. Check Ollama server local connection
  try {
    const res = await fetch("http://127.0.0.1:11434/api/tags");
    if (res.ok) {
      diagnostics.ollama_tags = await res.json();
    } else {
      diagnostics.ollama_tags_error = `Status: ${res.status}`;
    }
  } catch (e: any) {
    diagnostics.ollama_connection_error = e.message;
  }

  // 3. Try to call generateChat directly
  try {
    const reply = await generateChat([{ role: "user", content: "Test hello" }], "You are a test helper");
    diagnostics.generate_chat_success = reply;
  } catch (e: any) {
    diagnostics.generate_chat_error = e.message;
  }

  return NextResponse.json(diagnostics);
}
