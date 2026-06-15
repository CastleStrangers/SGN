import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authorize, ALL_PERMISSIONS } from "@/lib/permissions";
import { ollamaGenerate } from "@/lib/ai/ollama";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !(await authorize(session.user.id, "roles.manage"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const systemPrompt = `You are a system security architect for SGN (Syrian community in the Netherlands).
Analyze the following role name and description, and select the appropriate permissions from the list of available system permissions.
You MUST output your response strictly as a JSON object of format:
{
  "permissions": ["permission1", "permission2"],
  "reasonAr": "تفسير بالعربية لسبب اختيار هذه الصلاحيات بناءً على الوصف المدخل"
}

Available system permissions are:
${JSON.stringify(ALL_PERMISSIONS, null, 2)}

Only select permissions that are directly relevant to the role's description to maintain security. Do not suggest administrative permissions (like "roles.manage" or "settings.edit") unless the role is clearly an administrator.`;

    const userPrompt = `Role Name: "${name}"
Description: "${description || 'No description provided.'}"`;

    const aiResponse = await ollamaGenerate(
      [{ text: userPrompt }],
      systemPrompt,
      "application/json"
    );

    // Parse the JSON returned from Ollama
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      // Fallback if parsing fails
      // Look for JSON block in the text
      const match = aiResponse.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Failed to parse JSON response from AI");
      }
    }

    return NextResponse.json(parsed);
  } catch (e: any) {
    console.error("AI Role suggestion error:", e);
    return NextResponse.json({ error: e.message || "Failed to suggest permissions" }, { status: 500 });
  }
}
