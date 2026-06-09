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
    const { ai } = await import("./client");
    const msgs: any[] = [];
    if (systemPrompt) msgs.push({ role: "system", content: systemPrompt });
    msgs.push(...messages);

    const res = await ai.chat.completions.create({
      model: options?.model || config.model,
      messages: msgs,
      ...(options?.responseFormat === "json" ? { response_format: { type: "json_object" } } : {}),
    });
    return res.choices[0]?.message?.content || "";
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
