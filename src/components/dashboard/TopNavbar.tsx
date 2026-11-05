"use client";

import React, { useEffect, useState } from "react";
import { CloudSun, Bell, Menu, CloudRain, Sun, Cloud } from "lucide-react";
import Link from "next/link";

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
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    }
    if (c.includes("cloud")) {
      return <CloudSun className="w-5 h-5 text-amber-500" />;
    }
    return <Sun className="w-5 h-5 text-amber-500" />;
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-20 px-6 sm:px-10 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-slate-900 text-lg">LetsFarm</span>
      </div>

      <div className="hidden md:block">
        {/* Breadcrumb or spacing */}
      </div>

      {/* Right Tools: Weather & Notification */}
      <div className="flex items-center gap-5 ml-auto">
        {/* Weather Pill matching PDF Screenshot */}
        <Link
          href="/dashboard/seasonal-insights"
          className="flex items-center gap-3 bg-[#f8faf9] border border-slate-200/90 rounded-2xl px-4 py-2 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer group"
          title="View detailed seasonal & weather insights"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {weather.temp}°C • {weather.cityName}
            </span>
            <span className="text-[11px] text-slate-500 capitalize">
              {weather.description} • {weather.humidity}% hum.
            </span>
          </div>
        </Link>

        {/* Notifications Bell matching PDF */}
        <button
          className="relative p-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 transition-colors text-slate-600 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
