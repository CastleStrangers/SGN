import fs from "fs";
import path from "path";

type AIMessage = { role: "system" | "user" | "assistant"; content: string };

type AIConfig = 
  | { provider: "ollama" } 
  | { provider: "openai"; model: string } 
  | { provider: "anthropic"; model: string }
  | { provider: "gemini"; model: string }
  | { provider: "groq"; model: string };

function getEnvVar(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(new RegExp(`^${key}\\s*=\\s*["']?([^"'\r\n]+)["']?`, "m"));
      if (match) return match[1];
    }
  } catch (e) {
    console.error("Error reading .env directly:", e);
  }
  return undefined;
}

function getConfig(): AIConfig {
  const configured = getEnvVar("AI_PROVIDER") || "auto";

  if (configured === "ollama") return { provider: "ollama" };
  if (configured === "openai") return { provider: "openai", model: getEnvVar("OPENAI_MODEL") || "gpt-4o-mini" };
  if (configured === "anthropic") return { provider: "anthropic", model: getEnvVar("ANTHROPIC_MODEL") || "claude-3-5-sonnet-20240620" };
  if (configured === "gemini") return { provider: "gemini", model: getEnvVar("GEMINI_MODEL") || "gemini-2.5-flash" };
  if (configured === "groq") return { provider: "groq", model: getEnvVar("GROQ_MODEL") || "llama-3.3-70b-versatile" };

  const geminiKey = getEnvVar("GEMINI_API_KEY");
  if (geminiKey && (geminiKey.startsWith("AIzaSy") || geminiKey.startsWith("AQ."))) {
    return { provider: "gemini", model: getEnvVar("GEMINI_MODEL") || "gemini-2.5-flash" };
  }
  if (getEnvVar("OPENAI_API_KEY")) {
    return { provider: "openai", model: getEnvVar("OPENAI_MODEL") || "gpt-4o-mini" };
  }
  const anthropicKey = getEnvVar("ANTHROPIC_API_KEY") || getEnvVar("ANTHROPIC_BASE_URL");
  if (anthropicKey) {
    return { provider: "anthropic", model: getEnvVar("ANTHROPIC_MODEL") || "claude-3-5-sonnet-20240620" };
  }
  if (getEnvVar("GROQ_API_KEY")) {
    return { provider: "groq", model: getEnvVar("GROQ_MODEL") || "llama-3.3-70b-versatile" };
  }

  return { provider: "ollama" };
}

export async function generateText(
  content: string,
  systemPrompt?: string,
  options?: { model?: string; responseFormat?: "text" | "json" }
): Promise<string> {
  return generateChat(
    [{ role: "user", content }],
    systemPrompt,
    options,
  );
}

export async function generateChat(
  messages: AIMessage[],
  systemPrompt?: string,
  options?: { model?: string; responseFormat?: "text" | "json" }
): Promise<string> {
  const config = getConfig();

  if (config.provider === "groq") {
    const apiKey = getEnvVar("GROQ_API_KEY");
    if (!apiKey) throw new Error("GROQ_API_KEY is required for Groq provider");

    const msgs: any[] = [];
    if (systemPrompt) msgs.push({ role: "system", content: systemPrompt });
    msgs.push(...messages);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || config.model,
        messages: msgs,
        ...(options?.responseFormat === "json" ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Groq error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || "";
  }

  if (config.provider === "openai") {
    const apiKey = getEnvVar("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY is required for OpenAI provider");

    const msgs: any[] = [];
    if (systemPrompt) msgs.push({ role: "system", content: systemPrompt });
    msgs.push(...messages);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || config.model,
        messages: msgs,
        ...(options?.responseFormat === "json" ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`OpenAI error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.choices[0]?.message?.content || "";
  }

  if (config.provider === "anthropic") {
    const apiKey = getEnvVar("ANTHROPIC_API_KEY");
    const baseUrl = getEnvVar("ANTHROPIC_BASE_URL") || "https://api.anthropic.com/v1/messages";
    const customHeadersRaw = getEnvVar("ANTHROPIC_CUSTOM_HEADERS") || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    };

    if (apiKey) headers["x-api-key"] = apiKey;

    if (customHeadersRaw) {
      const parts = customHeadersRaw.split(":");
      if (parts.length >= 2) {
        headers[parts[0].trim()] = parts.slice(1).join(":").trim();
      }
    }

    const system = systemPrompt || "";
    const body = {
      model: options?.model || config.model,
      max_tokens: 1024,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      ...(system ? { system } : {}),
    };

    const res = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Anthropic error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.content[0]?.text || "";
  }

  if (config.provider === "gemini") {
    const apiKey = getEnvVar("GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY is required for Gemini provider");

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const body: any = {
      contents,
      ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
      generationConfig: {
        ...(options?.responseFormat === "json" ? { responseMimeType: "application/json" } : {}),
      },
    };

    const modelName = options?.model || config.model;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(`Gemini error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  const { ollamaGenerate } = await import("./ollama");
  const text = messages.map((m) => `[${m.role}]\n${m.content}`).join("\n\n");
  return ollamaGenerate(
    [{ text }],
    systemPrompt,
    options?.responseFormat === "json" ? "application/json" : undefined,
    options?.model,
  );
}