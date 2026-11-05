"use client";

import React, { useState, useEffect } from "react";
import {
  CloudSun,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  RefreshCw,
  Calendar,
  AlertTriangle,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPlots, Plot } from "@/lib/firestore";

interface ForecastItem {
  day: string;
  date: string;
  prob: number;
  high: number;
  low: number;
  isToday: boolean;
  condition: string;
}

interface CropProfile {
  name: string;
  idealTemp: string;
  bestMonths: string;
  riskFactor: string;
}

const CROP_PROFILES: Record<string, CropProfile> = {
  Maize: {
    name: "Maize",
    idealTemp: "20°C – 30°C",
    bestMonths: "April – August",
    riskFactor: "Fall Armyworm & Rust",
  },
  "Irish Potato": {
    name: "Irish Potato",
    idealTemp: "15°C – 22°C",
    bestMonths: "Nov – Feb (Dry) / May – Aug",
    riskFactor: "Late Blight & Bacterial Wilt",
  },
  Cassava: {
    name: "Cassava",
    idealTemp: "25°C – 32°C",
    bestMonths: "March – November",
    riskFactor: "Cassava Mosaic & Whitefly",
  },
  Tomatoes: {
    name: "Tomatoes",
    idealTemp: "18°C – 27°C",
    bestMonths: "Oct – March (Irrigated)",
    riskFactor: "Tuta Absoluta & Early Blight",
  },
  Cabbage: {
    name: "Cabbage",
    idealTemp: "15°C – 20°C",
    bestMonths: "Year-Round (Jos Plateau)",
    riskFactor: "Diamondback Moth",
  },
};

export default function SeasonalInsightsPage() {
  const { user, profile } = useAuth();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlotName, setSelectedPlotName] = useState("North Plot A - Jos South");
  const [selectedCrop, setSelectedCrop] = useState("Irish Potato");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live weather states
  const [currentWeather, setCurrentWeather] = useState({
    temp: 29,
    humidity: 22,
    rainfall: 0,
    wind: 14,
    condition: "Sunny & Pleasant",
    cityName: "Jos South",
  });

  const [forecastList, setForecastList] = useState<ForecastItem[]>([
    { day: "Mon", date: "Nov 3", prob: 10, high: 29, low: 16, isToday: false, condition: "Sunny" },
    { day: "Tue", date: "Nov 4", prob: 15, high: 28, low: 15, isToday: false, condition: "Partly Cloudy" },
    { day: "Wed", date: "Nov 5", prob: 5, high: 30, low: 16, isToday: true, condition: "Clear" },
    { day: "Thu", date: "Nov 6", prob: 10, high: 29, low: 15, isToday: false, condition: "Sunny" },
    { day: "Fri", date: "Nov 7", prob: 20, high: 28, low: 16, isToday: false, condition: "Mild Breeze" },
    { day: "Sat", date: "Nov 8", prob: 15, high: 29, low: 15, isToday: false, condition: "Clear" },
    { day: "Sun", date: "Nov 9", prob: 5, high: 30, low: 16, isToday: false, condition: "Sunny" },
  ]);

  // AI-generated guidance from Gemini
  const [aiInsights, setAiInsights] = useState<{
    overview: string;
    plantingRecommendations: Array<{ crop: string; action: string; tip: string }>;
    pestAlerts: Array<{ pest: string; risk: "Low" | "Medium" | "High"; advice: string }>;
    soilIrrigationTip: string;
  } | null>(null);

  // Load user plots
  useEffect(() => {
    async function loadPlots() {
      if (!user) return;
      try {
        const userPlots = await getPlots(user.uid);
        if (userPlots.length > 0) {
          setPlots(userPlots);
          setSelectedPlotName(`${userPlots[0].name} (${userPlots[0].location})`);
          if (userPlots[0].crops && userPlots[0].crops.length > 0) {
            setSelectedCrop(userPlots[0].crops[0]);
          }
        }
      } catch (err) {
        console.warn("Could not load plots for seasonal insights:", err);
      }
    }
    loadPlots();
  }, [user]);

  // Load live weather & Gemini insights
  const fetchWeatherAndInsights = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch live OpenWeather
      const weatherRes = await fetch("/api/weather?city=Jos,NG");
      let weatherSummary = "Warm daytime 28-30°C, dry harmattan breeze, low humidity.";

      if (weatherRes.ok) {
        const weatherJson = await weatherRes.json();
        if (weatherJson.success && weatherJson.data) {
          const cur = weatherJson.data.current;
          setCurrentWeather({
            temp: cur.temp,
            humidity: cur.humidity,
            rainfall: cur.rainMm || 0,
            wind: cur.windSpeed,
            condition: cur.description,
            cityName: cur.cityName,
          });

          weatherSummary = `${cur.temp}°C, humidity ${cur.humidity}%, wind ${cur.windSpeed} km/h, condition: ${cur.description}.`;

          if (weatherJson.data.forecast && weatherJson.data.forecast.length > 0) {
            const mapped: ForecastItem[] = weatherJson.data.forecast.map(
              (f: any, idx: number) => ({
                day: f.day,
                date: f.date,
                prob: f.rainProbability || 10,
                high: f.tempMax || f.temp + 2,
                low: f.tempMin || f.temp - 6,
                isToday: idx === 0,
                condition: f.condition,
              })
            );
            setForecastList(mapped);
          }
        }
      }

      // 2. Fetch Gemini AI Agronomy Advice
      const insightsRes = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: profile?.location || "Jos South, Plateau State",
          crops: [selectedCrop, "Maize", "Irish Potato"],
          weatherSummary,
        }),
      });

      if (insightsRes.ok) {
        const insightsJson = await insightsRes.json();
        if (insightsJson.success && insightsJson.data) {
          setAiInsights(insightsJson.data);
        }
      }
    } catch (err) {
      console.warn("Error refreshing seasonal data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherAndInsights();
  }, [selectedCrop]);

  const activeProfile = CROP_PROFILES[selectedCrop] || CROP_PROFILES["Maize"];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Controls: Farm/Plot Dropdown & Heading matching PDF */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Seasonal Insights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Jos South microclimate data + Gemini AI agronomy forecasting
          </p>
        </div>

        {/* Farm / Plot Selector Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/90 shadow-sm text-xs font-bold text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] uppercase text-slate-400">FARM / PLOT:</span>
            <select
              value={selectedPlotName}
              onChange={(e) => setSelectedPlotName(e.target.value)}
              className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              {plots.length > 0 ? (
                plots.map((p) => (
                  <option key={p.id} value={`${p.name} (${p.location})`}>
                    {p.name} - {p.location}
                  </option>
                ))
              ) : (
                <>
                  <option>North Plot A - Jos South (Maize Field)</option>
                  <option>South Plot B - Jos South (Cassava Field)</option>
                  <option>East Valley Plot C - Plateau Agro</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Card 1: Weather Section matching PDF */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Live Agro-Weather ({currentWeather.cityName})
              </h2>
              <span className="text-xs text-slate-400 font-medium capitalize">
                {currentWeather.condition}
              </span>
            </div>
          </div>

          <button
            onClick={fetchWeatherAndInsights}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-600" : ""}`}
            />
            <span>{isRefreshing ? "Syncing..." : "Refresh Feed"}</span>
          </button>
        </div>

        {/* 4 Weather Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Air Temp */}
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                CURRENT AIR TEMP
              </span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentWeather.temp}° <span className="text-base font-semibold text-slate-500">C</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                RELATIVE HUMIDITY
              </span>
              <Droplets className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
              {currentWeather.humidity}%
            </div>
          </div>

          {/* Rainfall */}
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                PRECIPITATION / RAIN
              </span>
              <CloudRain className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentWeather.rainfall}{" "}
              <span className="text-base font-semibold text-slate-500">mm</span>
            </div>
          </div>

          {/* Wind */}
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                WIND VELOCITY
              </span>
              <Wind className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentWeather.wind}{" "}
              <span className="text-base font-semibold text-slate-500">km/h</span>
            </div>
          </div>
        </div>

        {/* 7-Day Rain Probability Curve matching PDF */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-slate-800">
              7-Day Rain Probability (%) & Diurnal Temperature Curve
            </h3>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Rain Probability (%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>High Temp (°C)</span>
              </div>
            </div>
          </div>

          {/* 7-Column Day Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {forecastList.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                  item.isToday
                    ? "bg-[#faf8f5] border-amber-300 ring-2 ring-amber-400/30 shadow-sm"
                    : "bg-[#fafbfa] border-slate-200/80"
                }`}
              >
                {/* Probability Badge */}
                <div className="mb-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      item.isToday
                        ? "bg-amber-100 text-amber-900"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.prob}% {item.isToday ? "⚡" : ""}
                  </span>
                </div>

                {/* Day Visual Bar */}
                <div className="h-16 flex items-end justify-center mb-3">
                  <div
                    style={{ height: `${Math.max(item.prob, 15)}%` }}
                    className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                      item.isToday
                        ? "bg-amber-500"
                        : item.prob > 40
                        ? "bg-emerald-600"
                        : "bg-emerald-400/70"
                    }`}
                  />
                </div>

                {/* Day & Temp */}
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    {item.day} {item.isToday ? "(Today)" : ""}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    {item.date}
                  </span>
                  <span className="block text-[11px] font-semibold text-slate-600 mt-1">
                    {item.high}° / {item.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: Crop Highlights matching PDF */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Crop Highlights</h2>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Irish Potato">Irish Potato (Plateau Favorite)</option>
              <option value="Maize">Maize (Selected)</option>
              <option value="Cassava">Cassava</option>
              <option value="Tomatoes">Tomatoes</option>
              <option value="Cabbage">Cabbage</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Metric 1 */}
          <div className="p-5 rounded-2xl bg-[#fafbfa] border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                IDEAL TEMPERATURE
              </span>
              <Thermometer className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeProfile.idealTemp}
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-5 rounded-2xl bg-[#fafbfa] border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                BEST GROWTH MONTHS
              </span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeProfile.bestMonths}
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-5 rounded-2xl bg-[#fafbfa] border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                PRIMARY RISK FACTOR
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 tracking-tight">
              {activeProfile.riskFactor}
            </div>
          </div>
        </div>

        {/* Gemini AI Seasonal Advisor Card */}
        {aiInsights && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Gemini Agro-Advisory for Plateau Microclimate
              </h3>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {aiInsights.overview}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 text-xs">
                <span className="font-bold text-slate-900 block mb-1">
                  💡 Soil & Irrigation Strategy:
                </span>
                <span className="text-slate-600 leading-relaxed">
                  {aiInsights.soilIrrigationTip}
                </span>
              </div>
              {aiInsights.pestAlerts?.[0] && (
                <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 text-xs">
                  <span className="font-bold text-amber-800 block mb-1">
                    ⚠️ Scout Alert ({aiInsights.pestAlerts[0].pest}):
                  </span>
                  <span className="text-slate-600 leading-relaxed">
                    {aiInsights.pestAlerts[0].advice}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
