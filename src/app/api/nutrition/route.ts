import { NextResponse } from "next/server";
import { generateNutritionalGuidance } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { success: false, error: "query is required" },
        { status: 400 }
      );
    }

    const data = await generateNutritionalGuidance(query);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    console.error("API /api/nutrition error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate nutritional guidance" },
      { status: 500 }
    );
  }
}
