import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not found in env" });
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: "مرحبا، هل تعمل بشكل صحيح؟ أجب بكلمة واحدة: نعم" }] }
        ]
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Gemini API returned status ${res.status}`, details: err });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, reply: data.candidates?.[0]?.content?.parts?.[0]?.text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}
