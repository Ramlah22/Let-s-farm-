"use client";

import React, { useEffect, useState } from "react";
import { CloudSun, Bell, Menu, CloudRain, Sun } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface TopNavbarProps {
  onMobileMenuToggle?: () => void;
}

interface LiveWeather {
  temp: number;
  cityName: string;
  condition: string;
  description: string;
  humidity: number;
}

export default function TopNavbar({ onMobileMenuToggle }: TopNavbarProps) {
  const { profile } = useAuth();
  const [weather, setWeather] = useState<LiveWeather>({
    temp: 28,
    cityName: "Jos South",
    condition: "Sunny",
    description: "Plateau Weather",
    humidity: 24,
  });

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch("/api/weather?city=Jos,NG");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.current) {
            setWeather({
              temp: json.data.current.temp,
              cityName: json.data.current.cityName || "Jos South",
              condition: json.data.current.condition,
              description: json.data.current.description,
              humidity: json.data.current.humidity,
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch live weather, using fallback:", err);
      }
    }
    loadWeather();
  }, []);

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes("rain") || c.includes("shower")) {
      return <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
    }
    if (c.includes("cloud")) {
      return <CloudSun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />;
    }
    return <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />;
  };

  const weatherLink =
    profile?.accountType === "off-taker"
      ? "/dashboard/offtaker"
      : profile?.accountType === "consumer"
      ? "/dashboard/consumer"
      : "/dashboard/seasonal-insights";

  return (
    <header className="h-16 sm:h-20 bg-white/85 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
      {/* Mobile Menu Button & Brand */}
      <div className="flex items-center gap-2.5 md:hidden">
        <button
          onClick={onMobileMenuToggle}
          className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <span className="font-extrabold text-slate-900 text-base sm:text-lg">LetsFarm</span>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
          {profile?.accountType || "Farmer"} Portal
        </span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs text-slate-600 font-medium">Plateau State Agritech Node</span>
      </div>

      {/* Right Tools: Weather & Notification */}
      <div className="flex items-center gap-2.5 sm:gap-4 ml-auto">
        {/* Weather Pill: Scaled down on mobile to prevent overflow */}
        <Link
          href={weatherLink}
          className="flex items-center gap-2 sm:gap-3 bg-[#f8faf9] border border-slate-200/90 rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer group"
          title="Live Plateau State Weather"
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-xs font-bold text-slate-800 leading-tight">
                {weather.temp}°C
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden xs:inline sm:inline">
                • {weather.cityName}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 capitalize hidden sm:block">
              {weather.description} • {weather.humidity}% hum.
            </span>
          </div>
        </Link>

        {/* Notifications Bell */}
        <button
          className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 transition-colors text-slate-600 hover:text-slate-900 shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
