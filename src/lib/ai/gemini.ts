const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

function getKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

async function fetchWithRetry(url: string, body: object, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 429 && i < maxRetries - 1) {
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      continue;
    }
    return res;
  }
  throw new Error("Max retries exceeded");
}

export async function geminiGenerate(
  model: string,
  parts: { text?: string; inlineData?: { mimeType: string; data: string } }[],
  systemPrompt?: string,
  responseMimeType?: string
): Promise<string> {
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${getKey()}`;
  const body: Record<string, unknown> = {
    contents: [{ parts }],
  };
  if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };
  if (responseMimeType) body.generationConfig = { responseMimeType };

  const res = await fetchWithRetry(url, body);
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }
  const result = await res.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty response");
  return text.trim();
}
