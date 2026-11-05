import { NextResponse } from "next/server";
import { assessPlantHealth } from "@/lib/plantId";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, cropHint } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: "Image data is required" },
        { status: 400 }
      );
    }

    // Call Plant.id health assessment (enriched with Gemini Nigerian treatment plan)
    const result = await assessPlantHealth(imageBase64, cropHint);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("API /api/scan error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze plant health" },
      { status: 500 }
    );
  }
}
