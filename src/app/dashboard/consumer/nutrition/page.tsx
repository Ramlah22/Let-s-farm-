"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Sparkles,
  ChefHat,
  Search,
  CheckCircle2,
  Clock,
  Utensils,
  ShoppingBag,
  Flame,
  ShieldCheck,
  Scale,
  Apple,
} from "lucide-react";

interface NutritionData {
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
}

const POPULAR_CROPS = [
  "Fonio (Acha)",
  "Plateau Irish Potatoes",
  "Fresh Highland Cabbage",
  "Yellow Bio-fortified Cassava",
  "Plateau Soybeans",
  "Sweet Yellow Maize",
];

export default function ConsumerNutritionPage() {
  const [query, setQuery] = useState("Fonio (Acha)");
  const [loading, setLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchNutrition = async (cropQuery: string) => {
    if (!cropQuery.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: cropQuery }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setNutritionData(json.data);
      } else {
        setErrorMsg(json.error || "Failed to fetch nutrition data");
      }
    } catch (err: any) {
      console.error("Nutrition guide error:", err);
      setErrorMsg("Network error contacting nutrition engine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrition("Fonio (Acha)");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNutrition(query);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              AI Nutritional Guide &amp; Meal Planner
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Gemini Powered
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore the clinical nutritional profile, health benefits, and healthy recipes for indigenous Plateau and Nigerian crops.
          </p>
        </div>

        <Link
          href="/dashboard/consumer/marketplace"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Fresh Farm Staples</span>
        </Link>
      </div>

      {/* Search & Popular Pill Strip */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any Nigerian crop, e.g. Fonio, Cabbage, Garden Egg, Cassava..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200/90 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-slate-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="py-3 px-6 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 shrink-0"
          >
            {loading ? "Analyzing..." : "Analyze Nutrition"}
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0">Popular Staples:</span>
          {POPULAR_CROPS.map((crop) => (
            <button
              key={crop}
              onClick={() => {
                setQuery(crop);
                fetchNutrition(crop);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all ${
                query === crop
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Main Nutrition Profile Body */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-200">
          <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-pulse" />
          <span>Consulting Gemini Clinical Nutrition Engine...</span>
        </div>
      ) : nutritionData ? (
        <div className="space-y-6">
          {/* Top Macro Breakdown Strip */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  {nutritionData.localName || "Plateau Crop"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {nutritionData.cropName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Glycemic Index:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    nutritionData.glycemicIndex === "Low"
                      ? "bg-emerald-100 text-emerald-800"
                      : nutritionData.glycemicIndex === "Medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {nutritionData.glycemicIndex} GI
                </span>
              </div>
            </div>

            {/* 4 Macro Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Energy</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {nutritionData.caloriesPer100g}{" "}
                  <span className="text-xs font-medium text-slate-500">kcal/100g</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Protein</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {nutritionData.proteinGrams}{" "}
                  <span className="text-xs font-medium text-slate-500">grams</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                  <Apple className="w-3.5 h-3.5 text-blue-500" />
                  <span>Carbohydrates</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {nutritionData.carbsGrams}{" "}
                  <span className="text-xs font-medium text-slate-500">grams</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                  <span>Dietary Fiber</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {nutritionData.fiberGrams}{" "}
                  <span className="text-xs font-medium text-slate-500">grams</span>
                </div>
              </div>
            </div>

            {/* Micronutrients Pill Row */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-600 block mb-2">
                Essential Micronutrients &amp; Minerals:
              </span>
              <div className="flex flex-wrap gap-2">
                {nutritionData.keyNutrients?.map((n) => (
                  <span
                    key={n}
                    className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Health Benefits & Clinical Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Targeted Health &amp; Wellness Benefits
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                {nutritionData.healthBenefits?.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      {i + 1}
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Clinical Dietary Advice
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {nutritionData.clinicalNotes}
              </p>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 block mb-1.5">
                  Recommended Companion Produce:
                </span>
                <div className="flex flex-wrap gap-2">
                  {nutritionData.recommendedPairings?.map((pairing) => (
                    <Link
                      key={pairing}
                      href={`/dashboard/consumer/marketplace?crop=${encodeURIComponent(pairing)}`}
                      className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                    >
                      + {pairing} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Traditional Authentic Nigerian Recipe */}
          {nutritionData.traditionalRecipe && (
            <div className="bg-gradient-to-br from-[#072412] to-[#14532d] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Healthy Farm Kitchen
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {nutritionData.traditionalRecipe.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Prep Time: {nutritionData.traditionalRecipe.prepTime}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Ingredients (5 cols) */}
                <div className="md:col-span-5 space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Ingredients Required</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-100/90">
                    {nutritionData.traditionalRecipe.ingredients?.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions (7 cols) */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Step-by-Step Cooking Guide
                  </h4>
                  <div className="space-y-3 text-xs text-emerald-100/90 leading-relaxed">
                    {nutritionData.traditionalRecipe.instructions?.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center font-bold text-emerald-300 shrink-0 text-xs">
                          {idx + 1}
                        </span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/dashboard/consumer/marketplace?crop=${encodeURIComponent(nutritionData.cropName)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-700" />
                      <span>Order {nutritionData.cropName} from Plateau Farmers</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
