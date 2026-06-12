type AIMessage = { role: "system" | "user" | "assistant"; content: string };

type AIConfig = { provider: "ollama" } | { provider: "openai"; model: string };

function getConfig(): AIConfig {
  const configured = process.env.AI_PROVIDER || "auto";

  if (configured === "ollama") return { provider: "ollama" };
  if (configured === "openai") return { provider: "openai", model: process.env.OPENAI_MODEL || "gpt-4o-mini" };

  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
  if (isProd) return { provider: "openai", model: process.env.OPENAI_MODEL || "gpt-4o-mini" };

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

  if (config.provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
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

  const { ollamaGenerate } = await import("./ollama");
  const text = messages.map((m) => `[${m.role}]\n${m.content}`).join("\n\n");
  return ollamaGenerate(
    [{ text }],
    systemPrompt,
    options?.responseFormat === "json" ? "application/json" : undefined,
    options?.model,
  );
}