import { NextResponse } from "next/server";
import { parseSourcingPrompt } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { promptText } = body;

    if (!promptText || typeof promptText !== "string") {
      return NextResponse.json(
        { success: false, error: "promptText is required" },
        { status: 400 }
      );
    }

    const analysis = await parseSourcingPrompt(promptText);

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (err: any) {
    console.error("API /api/sourcing-ai error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to parse sourcing prompt" },
      { status: 500 }
    );
  }
}
