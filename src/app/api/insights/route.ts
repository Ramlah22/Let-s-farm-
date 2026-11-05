import { NextResponse } from "next/server";
import { generateSeasonalGuidance } from "@/lib/gemini";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      location = "Jos South, Plateau State",
      crops = ["Irish Potato", "Maize", "Cabbage", "Tomatoes"],
      weatherSummary = "Daytime 28-30°C, low humidity 20-30%, harmattan dry breeze.",
    } = body;

    const currentMonth = new Date().toLocaleString("en-US", { month: "long" });

    const guidance = await generateSeasonalGuidance({
      location,
      crops: Array.isArray(crops) && crops.length > 0 ? crops : ["Irish Potato", "Maize"],
      weatherSummary,
      currentMonth,
    });

    return NextResponse.json({ success: true, data: guidance });
  } catch (error: any) {
    console.error("API /api/insights error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate seasonal insights" },
      { status: 500 }
    );
  }
}
