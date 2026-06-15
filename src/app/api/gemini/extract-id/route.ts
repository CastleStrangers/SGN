import { NextResponse } from "next/server";
import { ollamaGenerate } from "@/lib/ai/ollama";

export async function POST(req: Request) {
  try {
    const { image, mimeType } = await req.json();
    if (!image || !mimeType) {
      return NextResponse.json({ error: "image and mimeType are required" }, { status: 400 });
    }
    const systemPrompt =
      "You are a strict data extraction AI specialized in Dutch identity documents. Extract the person's full name in Arabic (if available, otherwise transliterate from Latin), full name in Latin letters (Dutch/English), and birth year from the provided identity document. Supported document types: Dutch passport (paspoort), Dutch ID card (identiteitskaart), Dutch driver's license (rijbewijs), Dutch residence permit (verblijfsvergunning), and Syrian passport. Return ONLY a valid JSON object without markdown formatting. Schema: {\"name_ar\": \"Arabic Name\", \"name_nl\": \"Latin Name\", \"birth_year\": \"YYYY\"}";
    const text = await ollamaGenerate(
      [
        { text: systemPrompt },
        { inlineData: { mimeType, data: image } },
      ],
      undefined,
      "application/json"
    );
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("AI extract-id error:", e);
    return NextResponse.json({ error: e.message || "Extraction failed" }, { status: 500 });
  }
}
