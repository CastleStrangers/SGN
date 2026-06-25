type AIMessage = { role: "system" | "user" | "assistant"; content: string };

type AIConfig = { provider: "ollama" } | { provider: "openai"; model: string } | { provider: "anthropic"; model: string };

function getConfig(): AIConfig {
  const configured = process.env.AI_PROVIDER || "auto";

  if (configured === "ollama") return { provider: "ollama" };
  if (configured === "openai") return { provider: "openai", model: process.env.OPENAI_MODEL || "gpt-4o-mini" };
  if (configured === "anthropic") return { provider: "anthropic", model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20240620" };

  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
  if (isProd) {
    if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_BASE_URL) {
      return { provider: "anthropic", model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20240620" };
    }
    return { provider: "openai", model: process.env.OPENAI_MODEL || "gpt-4o-mini" };
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

  if (config.provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const baseUrl = process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com/v1/messages";
    const customHeadersRaw = process.env.ANTHROPIC_CUSTOM_HEADERS || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    };

    if (apiKey) headers["x-api-key"] = apiKey;

    // Parse custom headers like "x-ai-gateway-api-key: Bearer ..."
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

  const { ollamaGenerate } = await import("./ollama");
  const text = messages.map((m) => `[${m.role}]\n${m.content}`).join("\n\n");
  return ollamaGenerate(
    [{ text }],
    systemPrompt,
    options?.responseFormat === "json" ? "application/json" : undefined,
    options?.model,
  );
}