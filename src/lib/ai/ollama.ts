const OLLAMA_BASE = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";
const OLLAMA_VISION_MODEL = process.env.OLLAMA_VISION_MODEL || "llava:7b";

export async function ollamaGenerate(
  parts: { text?: string; inlineData?: { mimeType: string; data: string } }[],
  systemPrompt?: string,
  responseMimeType?: string,
  model?: string
): Promise<string> {
  const textContent = parts.map((p) => p.text).filter(Boolean).join("\n");
  const images = parts.filter((p) => p.inlineData).map((p) => p.inlineData!.data);
  const usedModel = model || (images.length > 0 ? OLLAMA_VISION_MODEL : OLLAMA_MODEL);

  const userMsg: Record<string, unknown> = { role: "user", content: textContent };
  if (images.length > 0) userMsg.images = images;

  const messages: Record<string, unknown>[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push(userMsg);

  const body: Record<string, unknown> = { model: usedModel, messages, stream: false };
  if (responseMimeType === "application/json") body.format = "json";

  const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Ollama error ${res.status}: ${errText}`);
  }
  const result = await res.json();
  const text = result?.message?.content;
  if (!text) throw new Error("Ollama returned empty response");
  return text.trim();
}
