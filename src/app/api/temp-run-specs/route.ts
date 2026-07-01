import { NextResponse } from "next/server";
import { generateChat } from "@/lib/ai/provider";

export async function GET() {
  try {
    const reply = await generateChat(
      [{ role: "user", content: "مرحبا، هل تعمل بشكل صحيح؟ أجب بكلمة واحدة: نعم" }], 
      "You are a test helper"
    );
    return NextResponse.json({ success: true, reply });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
