import { NextResponse } from "next/server";
import { getWeatherData } from "@/lib/weather";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "Jos,NG";

    const weather = await getWeatherData(city);
    return NextResponse.json({ success: true, data: weather });
  } catch (error: any) {
    console.error("API /api/weather error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
