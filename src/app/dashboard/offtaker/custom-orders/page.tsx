"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquarePlus,
  Sparkles,
  Send,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  Building2,
  Filter,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getCustomOrders,
  createCustomOrder,
  CustomOrder,
} from "@/lib/firestore";

interface RegionalFarmer {
  id: string;
  name: string;
  location: string;
  primaryCrop: string;
}

const REGIONAL_FARMERS: RegionalFarmer[] = [
  { id: "farmer_bisi_akande", name: "Bisi Akande", location: "Jos South", primaryCrop: "Maize & Sorghum" },
  { id: "farmer_audu_plateau", name: "Audu Danjuma", location: "Bokkos", primaryCrop: "Irish Potatoes" },
  { id: "farmer_yakubu_mangu", name: "Yakubu Dung", location: "Mangu", primaryCrop: "Cabbage & Vegetables" },
  { id: "farmer_esther_ladi", name: "Esther Pam", location: "Barkin Ladi", primaryCrop: "Cassava" },
  { id: "farmer_musa_kuru", name: "Musa Yakubu", location: "Kuru, Jos South", primaryCrop: "Fonio (Acha)" },
  { id: "farmer_grace_vom", name: "Grace Gyang", location: "Vom", primaryCrop: "Soybeans & Grain" },
];

export default function OfftakerCustomOrdersPage() {
  const { user, profile } = useAuth();
  const [promptText, setPromptText] = useState("");
  const [selectedFarmers, setSelectedFarmers] = useState<string[]>(["all"]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const offtakerId = user?.uid || "offtaker_guest";
  const offtakerName = profile?.companyName || profile?.fullName || "Grand Cereals Ltd";

  const loadPastCustomOrders = async () => {
    try {
      setLoading(true);
      const orders = await getCustomOrders(offtakerId);
      setCustomOrders(orders);
      setLoading(false);
    } catch (err) {
      console.warn("Failed to load custom orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPastCustomOrders();
  }, [offtakerId]);

  const handleFarmerToggle = (farmerId: string) => {
    if (farmerId === "all") {
      if (selectedFarmers.includes("all")) {
        setSelectedFarmers([]);
      } else {
        setSelectedFarmers(["all"]);
      }
      return;
    }

    const withoutAll = selectedFarmers.filter((f) => f !== "all");
    if (withoutAll.includes(farmerId)) {
      setSelectedFarmers(withoutAll.filter((f) => f !== farmerId));
    } else {
      setSelectedFarmers([...withoutAll, farmerId]);
    }
  };

  // Run Gemini AI on prompt
  const handleAnalyzePrompt = async () => {
    if (!promptText.trim()) return;
    setAnalyzing(true);
    setAiAnalysis(null);

    try {
      const res = await fetch("/api/sourcing-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiAnalysis(json.data);
      }
    } catch (e) {
      console.error("AI sourcing analysis error:", e);
    } finally {
      setAnalyzing(false);
    }
  };

  // Submit and broadcast
  const handleBroadcastRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setSubmitting(true);
    setSuccessMsg("");

    try {
      await createCustomOrder({
        offtakerId,
        offtakerName,
        promptText,
        parsedCrop: aiAnalysis?.crop || "Commodity Produce",
        parsedQuantityTons: aiAnalysis?.quantityTons || 10,
        targetRegion: aiAnalysis?.targetRegion || "Plateau State",
        deliveryWindow: aiAnalysis?.deliveryWindow || "Next 14 Days",
        estimatedBudget: aiAnalysis?.fairMarketPricePerTonNaira
          ? aiAnalysis.fairMarketPricePerTonNaira * (aiAnalysis.quantityTons || 10)
          : undefined,
        status: "BROADCAST",
        selectedFarmers: selectedFarmers.includes("all")
          ? REGIONAL_FARMERS.map((f) => f.name)
          : selectedFarmers.map(
              (id) => REGIONAL_FARMERS.find((f) => f.id === id)?.name || id
            ),
        aiAnalysis: aiAnalysis || undefined,
        createdAt: new Date().toISOString(),
      });

      setSubmitting(false);
      setSuccessMsg("Custom procurement request broadcast successfully to regional farmers!");
      setPromptText("");
      setAiAnalysis(null);
      loadPastCustomOrders();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Error creating custom order:", err);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Custom Bulk Produce Sourcing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Type your specific procurement specifications in plain language. Our AI structures the request and broadcasts it to verified Plateau farmer clusters.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Sourcing Interface (Strictly matching PRD Section 3.4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Conversational Prompt Box & Submission (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <form onSubmit={handleBroadcastRequest} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-900">
                  Conversational Sourcing Prompt
                </label>
                <button
                  type="button"
                  onClick={handleAnalyzePrompt}
                  disabled={analyzing || !promptText.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{analyzing ? "Analyzing via AI..." : "AI Intelligence"}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Example: I need 10 metric tons of clean dry white maize delivered to Jos North by next Friday. Produce must be packaged in 50kg sacks."
                className="w-full p-4 rounded-2xl border border-slate-200/90 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Describe desired crop, required tons, packaging (bags/crates), delivery deadline, and destination.
              </span>
            </div>

            {/* AI Real-Time Parsing & Price Benchmark Panel */}
            {aiAnalysis && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>AI Regional Procurement Intelligence</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    Feasibility: {aiAnalysis.feasibility}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Detected Crop</span>
                    <span className="font-bold text-slate-800">{aiAnalysis.crop}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Tonnage</span>
                    <span className="font-bold text-slate-800">{aiAnalysis.quantityTons} MT</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Benchmark / Ton</span>
                    <span className="font-extrabold text-emerald-700">
                      ₦{aiAnalysis.fairMarketPricePerTonNaira?.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Timeline</span>
                    <span className="font-bold text-slate-800 truncate">{aiAnalysis.deliveryWindow}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Advice:</strong> {aiAnalysis.keyAdvice}
                </p>
              </div>
            )}

            {/* Target Farmer Selection List */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 block">
                Target Regional Farmers &amp; Clusters
              </label>

              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedFarmers.includes("all")}
                    onChange={() => handleFarmerToggle("all")}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Broadcast to All Verified Farmers in Plateau State ({REGIONAL_FARMERS.length} Clusters)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {REGIONAL_FARMERS.map((farmer) => {
                    const isChecked =
                      selectedFarmers.includes("all") ||
                      selectedFarmers.includes(farmer.id);

                    return (
                      <label
                        key={farmer.id}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                          isChecked
                            ? "bg-emerald-50/50 border-emerald-300"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={selectedFarmers.includes("all")}
                          onChange={() => handleFarmerToggle(farmer.id)}
                          className="w-3.5 h-3.5 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {farmer.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {farmer.location} • {farmer.primaryCrop}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !promptText.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submitting
                    ? "Broadcasting to Farmers..."
                    : "Send Custom Request to Selected Farmers"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Sent Custom Requests Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Broadcast Log ({customOrders.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
              Loading broadcast history...
            </div>
          ) : customOrders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
              <Clock className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">No custom sourcing prompts broadcast yet.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {customOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {order.parsedCrop || "Commodity Produce"}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1">
                        {order.parsedQuantityTons} MT Required
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      {order.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl italic">
                    &ldquo;{order.promptText}&rdquo;
                  </p>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>Target: {order.targetRegion}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
