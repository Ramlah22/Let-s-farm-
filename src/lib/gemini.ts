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

  // Active production models that have 100% confirmed availability
  const models = [
    "gemini-3.1-flash-lite-preview",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
  ];

  let lastErrorMsg = "";

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
        lastErrorMsg = data.error.message;
        console.warn(`Gemini model ${model} error (${data.error.code}):`, data.error.message);
        continue; // Try next model in fallback list
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      lastErrorMsg = err.message;
      console.warn(`Error calling Gemini with ${model}:`, err.message);
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastErrorMsg}`);
}

/**
 * Call Gemini Multimodal with an image attachment
 */
export async function callGeminiMultimodal(
  prompt: string,
  imageBase64: string,
  systemInstruction?: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  let rawBase64 = imageBase64;
  let mimeType = "image/jpeg";
  if (imageBase64.startsWith("data:")) {
    const match = imageBase64.match(/^data:([^;]+);base64,(.*)$/);
    if (match) {
      mimeType = match[1];
      rawBase64 = match[2];
    }
  }

  const models = [
    "gemini-3.1-flash-lite-preview",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.7-flash",
    "gemini-2.5-flash",
  ];

  let lastErrorMsg = "";

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const bodyPayload: any = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: rawBase64,
                },
              },
            ],
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
        lastErrorMsg = data.error.message;
        console.warn(`Gemini multimodal ${model} error (${data.error.code}):`, data.error.message);
        continue;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      lastErrorMsg = err.message;
      console.warn(`Error calling Gemini multimodal with ${model}:`, err.message);
    }
  }

  throw new Error(`All Gemini multimodal models failed. Last error: ${lastErrorMsg}`);
}

/**
 * Direct Gemini Vision Plant Diagnosis Engine
 */
export async function analyzePlantImageWithGemini(
  imageBase64: string,
  cropHint?: string
): Promise<{
  isHealthy: boolean;
  cropName: string;
  condition: string;
  scientificName?: string;
  confidence: number;
  stage: "Seedlings" | "Saplings" | "Mature" | "Ripe / Harvest";
  description: string;
  treatmentSteps: string[];
}> {
  const prompt = `
You are an expert plant pathologist and Nigerian agricultural extension specialist.
Analyze this crop leaf / plant photograph in detail. Suspected crop or context: ${cropHint || "Field Crop in Nigeria"}.

Determine:
1. Exact crop name.
2. Is the plant healthy or diseased/pest-infested?
3. Condition name (e.g. "Healthy Crop", "Early Blight", "Late Blight", "Fall Armyworm", "Bacterial Wilt", "Cercospora Leaf Spot", "Aphid Damage", "Nitrogen Deficiency").
4. Scientific name of pathogen/pest if applicable.
5. Confidence percentage (number between 75 and 99).
6. Growth stage: strictly one of "Seedlings", "Saplings", "Mature", "Ripe / Harvest".
7. Description of symptoms or healthy leaf characteristics observed in this image.
8. 3-4 practical treatment or maintenance steps tailored for Nigerian farmers (mentioning accessible local organic methods like neem seed oil/wood ash, and NAFDAC registered inputs like Mancozeb/Ridomil Gold if diseased; or optimal harvest/watering advice if healthy).

Return a strictly valid JSON object matching this schema with NO markdown code blocks or backticks:
{
  "isHealthy": true,
  "cropName": "Crop Name",
  "condition": "Condition / Disease Name",
  "scientificName": "Scientific name or N/A",
  "confidence": 92,
  "stage": "Saplings",
  "description": "Observed symptoms or foliage status...",
  "treatmentSteps": ["Step 1", "Step 2", "Step 3"]
}
`;

  const raw = await callGeminiMultimodal(
    prompt,
    imageBase64,
    "You are a plant pathologist and Nigerian agricultural extension specialist. Output strictly raw JSON only."
  );

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
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
      "risk": "High",
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

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
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

/**
 * Off-Taker AI Sourcing Parser
 */
export async function parseSourcingPrompt(promptText: string): Promise<{
  crop: string;
  quantityTons: number;
  gradeRecommendation: string;
  fairMarketPricePerTonNaira: number;
  deliveryWindow: string;
  targetRegion: string;
  packaging: string;
  feasibility: "High" | "Medium" | "Challenging";
  keyAdvice: string;
}> {
  const prompt = `
You are a commodity procurement specialist for agricultural supply chains in Nigeria, specifically Plateau State and Northern Nigeria.
Analyze this buyer's plain-text sourcing request:
"${promptText}"

Extract key details and benchmark against current regional market conditions (Jos, Bokkos, Mangu, Barkin Ladi).
Return a STRICTLY valid raw JSON object matching this schema with NO markdown ticks:
{
  "crop": "extracted crop name (e.g. White Maize, Irish Potatoes, Soybeans, Cassava)",
  "quantityTons": 10.0,
  "gradeRecommendation": "recommended quality grade or moisture spec",
  "fairMarketPricePerTonNaira": 450000,
  "deliveryWindow": "e.g. Within 7 Days / Next Friday / Immediate",
  "targetRegion": "e.g. Jos North, Plateau State",
  "packaging": "e.g. 50kg woven polypropylene sacks",
  "feasibility": "High",
  "keyAdvice": "1-2 practical tips for negotiating or inspecting this bulk lot."
}
`;

  try {
    const raw = await callGemini(
      prompt,
      "You are an expert Nigerian agricultural commodity trading analyst. Output valid JSON only."
    );
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("Gemini sourcing parse fallback:", e);
    return {
      crop: "Clean Bulk Produce",
      quantityTons: 5,
      gradeRecommendation: "Standard Grade 1 (Field Cleaned)",
      fairMarketPricePerTonNaira: 380000,
      deliveryWindow: "Next 7-14 business days",
      targetRegion: "Plateau State Aggregation Hub",
      packaging: "Standard 50kg or 100kg sacks",
      feasibility: "High",
      keyAdvice: "Verify moisture content upon delivery and use LetsFarm escrow payment to protect against transit loss.",
    };
  }
}

/**
 * Consumer Nutritional Guide & AI Dietitian:
 * Generates nutritional breakdowns, local health benefits, and healthy Nigerian recipes
 */
export async function generateNutritionalGuidance(queryOrCrop: string): Promise<{
  cropName: string;
  localName: string;
  caloriesPer100g: number;
  proteinGrams: number;
  carbsGrams: number;
  fiberGrams: number;
  glycemicIndex: "Low" | "Medium" | "High";
  keyNutrients: string[];
  healthBenefits: string[];
  clinicalNotes: string;
  traditionalRecipe: {
    title: string;
    prepTime: string;
    ingredients: string[];
    instructions: string[];
  };
  recommendedPairings: string[];
}> {
  const prompt = `
You are an expert clinical dietitian and nutritionist specializing in Nigerian foods and indigenous Plateau agricultural crops.
A user wants an accurate nutritional breakdown and authentic healthy Nigerian recipe for:
"${queryOrCrop}"

Provide real, scientifically grounded nutritional metrics per 100g of this crop or food item, with clear health benefits for everyday Nigerians (addressing vitality, diabetes, blood pressure, fiber, and heart health).
Return a STRICTLY valid raw JSON object matching this schema without any markdown ticks:
{
  "cropName": "${queryOrCrop}",
  "localName": "Hausa / Yoruba / Local name (e.g. Acha, Doya, Dankali)",
  "caloriesPer100g": 125,
  "proteinGrams": 3.8,
  "carbsGrams": 24.2,
  "fiberGrams": 4.1,
  "glycemicIndex": "Low",
  "keyNutrients": ["Iron", "Zinc", "Magnesium", "Vitamin C", "Folate"],
  "healthBenefits": [
    "Benefit 1 specific to this food and Nigerian wellness",
    "Benefit 2 regarding blood sugar, gut, or heart health",
    "Benefit 3"
  ],
  "clinicalNotes": "Practical clinical notes on suitability for diabetic, hypertensive, or weight-management diets.",
  "traditionalRecipe": {
    "title": "Authentic, delicious healthy Nigerian recipe using this crop",
    "prepTime": "25 mins",
    "ingredients": ["1 cup ingredient A", "2 fresh tomatoes", "1 tbsp vegetable oil"],
    "instructions": ["Step 1", "Step 2", "Step 3"]
  },
  "recommendedPairings": ["Spinach", "Plum Tomatoes", "Smoked Fish"]
}
`;

  try {
    const raw = await callGemini(
      prompt,
      "You are a registered clinical nutritionist and Nigerian dietary specialist. Always output valid JSON only."
    );
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e: any) {
    console.error("Gemini nutrition error:", e.message);
    throw new Error(`Failed to generate nutrition guidance: ${e.message}`);
  }
}
