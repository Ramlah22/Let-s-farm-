"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, MapPin, Package, Calendar } from "lucide-react";

interface MarketplaceItem {
  id: string;
  category: "Expected Pre-Harvest" | "Ready Stock";
  statusBadge: string;
  statusType: "pre-harvest" | "dispatch";
  subBadge: string;
  title: string;
  location: string;
  quantity: string;
  buttonText: string;
  buttonVariant: "solid" | "outline";
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: "item-1",
    category: "Expected Pre-Harvest",
    statusBadge: "EXPECTED PRE-HARVEST",
    statusType: "pre-harvest",
    subBadge: "Nov 28 Maturity",
    title: "Yellow Grain Maize (Bulk)",
    location: "Jos South",
    quantity: "15 Metric Tons Reserved",
    buttonText: "Submit Bulk Pre-Offer",
    buttonVariant: "solid",
  },
  {
    id: "item-2",
    category: "Ready Stock",
    statusBadge: "READY FOR DISPATCH",
    statusType: "dispatch",
    subBadge: "In Aggregator Hub",
    title: "Fresh Cassava Tubers",
    location: "Barkin Ladi",
    quantity: "8 Metric Tons Available",
    buttonText: "Order Dispatch",
    buttonVariant: "solid",
  },
  {
    id: "item-3",
    category: "Expected Pre-Harvest",
    statusBadge: "EXPECTED PRE-HARVEST",
    statusType: "pre-harvest",
    subBadge: "Dec 05 Maturity",
    title: "Grade-A Roma Tomatoes",
    location: "Riyom Plateau",
    quantity: "12 Metric Tons",
    buttonText: "Request Inspection",
    buttonVariant: "outline",
  },
];

interface MarketplaceProps {
  onActionClick?: (item: MarketplaceItem) => void;
}

export default function Marketplace({ onActionClick }: MarketplaceProps) {
  const [activeTab, setActiveTab] = useState<string>("All Commodities");

  const filteredItems = marketplaceItems.filter((item) => {
    if (activeTab === "All Commodities") return true;
    return item.category === activeTab;
  });

  return (
    <section
      id="marketplace"
      className="relative py-24 sm:py-28 overflow-hidden bg-gradient-to-b from-[#f3f8f5] via-[#e5efe8] to-[#edf4f0] border-t border-slate-200/70"
    >
      {/* Background Soft Glows & Precision Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute -bottom-24 right-10 w-[30rem] h-[30rem] rounded-full bg-teal-500/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #166534 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Verified Commodity Exchange</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Direct Marketplace
            </h2>
          </div>

          {/* Filter Pills matching exact tab names */}
          <div className="inline-flex p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm w-fit">
            {["All Commodities", "Expected Pre-Harvest", "Ready Stock"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md shadow-emerald-800/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Commodity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {filteredItems.map((item) => {
            const isPreHarvest = item.statusType === "pre-harvest";

            return (
              <div
                key={item.id}
                className="group relative bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 hover:border-emerald-500/50 p-6 sm:p-7 shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Subtle Gradient Light Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        isPreHarvest
                          ? "bg-amber-50 text-amber-900 border-amber-200"
                          : "bg-emerald-50 text-emerald-900 border-emerald-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPreHarvest ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
                        }`}
                      />
                      {item.statusBadge}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {item.subBadge}
                    </span>
                  </div>

                  {/* Produce Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  {/* Specs & Location Box */}
                  <div className="space-y-2.5 p-4 rounded-2xl bg-gradient-to-br from-[#fafbfa] to-[#f3f6f4] border border-slate-200/70 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Location
                      </span>
                      <span className="font-bold text-slate-900">{item.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/50">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                        Available Volume
                      </span>
                      <span className="font-bold text-slate-900">{item.quantity}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div>
                  <button
                    onClick={() => onActionClick && onActionClick(item)}
                    className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                      item.buttonVariant === "solid"
                        ? "bg-gradient-to-r from-[#16a34a] to-[#15803d] hover:from-[#15803d] hover:to-[#166534] active:scale-[0.98] text-white shadow-md shadow-emerald-800/15"
                        : "bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 border border-slate-300 hover:border-slate-400 shadow-sm"
                    }`}
                  >
                    <span>{item.buttonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
