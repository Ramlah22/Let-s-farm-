// Google Gemini API integration for LetsFarm

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export async function callGemini(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  // Primary model: gemini-3.5-flash-lite, fallback to gemini-3.8-flash
  const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const bodyPayload: any = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      if (systemInstruction) {
        bodyPayload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const data: GeminiResponse = await res.json();

      if (data.error) {
        console.warn(`Gemini model ${model} returned error:`, data.error.message);
        continue; // Try next model
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Error calling Gemini with ${model}:`, err.message);
    }
  }

  throw new Error("All Gemini models failed to generate response.");
}

/**
 * Generate practical, localized Nigerian treatment advice for crop diseases
 */
export async function generateDiseaseTreatment(
  diseaseName: string,
  scientificName?: string,
  cropName?: string
): Promise<string> {
  const prompt = `
You are an expert Nigerian agricultural extension officer advising a smallholder farmer in Plateau State, Nigeria.
A crop scan has identified:
- Detected Issue: ${diseaseName}
- Scientific Name: ${scientificName || "N/A"}
- Suspected Crop: ${cropName || "Field Crop"}

Provide a concise, practical, easy-to-follow treatment plan divided into 3 short sections:
1. Immediate Action (within 24 hours): pruning, isolation, water reduction.
2. Recommended Treatment: List both affordable organic/local remedies (e.g. neem extract, wood ash slurry) and standard fungicides/pesticides easily found in Nigerian agro-allied stores (e.g. Mancozeb, Ridomil Gold, Force 1.5).
3. Preventive Care: Soil hygiene, spacing, crop rotation advice for the next planting.

Keep tone professional, encouraging, and clear. Avoid overly dense scientific jargon. Format in clean bullet points without markdown headers (use bold prefixes like **Immediate Action:**).
`;

  return callGemini(
    prompt,
    "You are an agricultural extension officer specializing in Nigerian farming systems and local crop protection solutions."
  );
}

/**
 * Generate localized seasonal agricultural insights
 */
export async function generateSeasonalGuidance(params: {
  location: string;
  crops: string[];
  weatherSummary: string;
  currentMonth?: string;
}): Promise<{
  overview: string;
  plantingRecommendations: Array<{ crop: string; action: string; tip: string }>;
  pestAlerts: Array<{ pest: string; risk: "Low" | "Medium" | "High"; advice: string }>;
  soilIrrigationTip: string;
}> {
  const { location, crops, weatherSummary, currentMonth } = params;

  const prompt = `
Generate localized seasonal agronomic advice for a farmer in ${location}, Nigeria.
Month: ${currentMonth || "Current Season"}
Current Weather Context: ${weatherSummary}
Farmer Crops: ${crops.join(", ")}

Respond with a strictly valid JSON object matching this TypeScript interface without any backticks, markdown code blocks, or extra text:
{
  "overview": "A 2-sentence summary of the current agro-climatic conditions and what the farmer should prioritize right now.",
  "plantingRecommendations": [
    {
      "crop": "Crop Name",
      "action": "e.g. Sowing Window / Active Flowering / Pre-Harvest Curing",
      "tip": "Specific, practical action for this crop in this weather."
    }
  ],
  "pestAlerts": [
    {
      "pest": "e.g. Fall Armyworm / Late Blight / Tuta Absoluta",
      "risk": "High", // "Low" | "Medium" | "High"
      "advice": "Specific scouting and prevention tip."
    }
  ],
  "soilIrrigationTip": "Practical guidance on watering, mulching, or drainage given the current humidity and temperature."
}
`;

  try {
    const raw = await callGemini(
      prompt,
      "You are an expert Nigerian agronomy AI. Always output valid raw JSON without code blocks or formatting."
    );

    // Clean any stray markdown formatting
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse Gemini seasonal guidance as JSON, using structured fallback:", err);
    return {
      overview: `Plateau State's temperate climate during this period is ideal for horticultural and tuber crops. Monitor soil moisture closely as daytime temperatures peak.`,
      plantingRecommendations: crops.map((c) => ({
        crop: c,
        action: "Active Field Maintenance",
        tip: `Ensure adequate weeding and balanced nitrogen-phosphorus-potassium (NPK 15:15:15) application before the dry harmattan winds intensify.`,
      })),
      pestAlerts: [
        {
          pest: "Late Blight / Fungal Mildew",
          risk: "Medium",
          advice: "Inspect underside of lower foliage early morning for white spores. Apply protective copper fungicide if humidity exceeds 70%.",
        },
        {
          pest: "Stem Borers & Cutworms",
          risk: "Low",
          advice: "Examine seedlings at base; use pheromone traps or neem-based spray for early mitigation.",
        },
      ],
      soilIrrigationTip:
        "Water in early morning to prevent high evaporative loss. Mulch heavily around vegetable beds to conserve plateau soil moisture.",
    };
  }
}
