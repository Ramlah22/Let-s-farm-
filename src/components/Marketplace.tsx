"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, MapPin, Package } from "lucide-react";

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
    <section id="marketplace" className="py-20 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Direct Marketplace
            </h2>
          </div>

          {/* Filter Pills matching the PDF */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-full w-fit">
            {["All Commodities", "Expected Pre-Harvest", "Ready Stock"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#16a34a] text-white shadow-sm"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-300/40"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3 Columns Grid for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isPreHarvest = item.statusType === "pre-harvest";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200"
              >
                <div>
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md ${
                        isPreHarvest
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {item.statusBadge}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      {isPreHarvest ? (
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {item.subBadge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">
                    {item.title}
                  </h3>

                  {/* Location & Quantity info */}
                  <p className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.location}</span>
                    <span className="text-slate-300">•</span>
                    <Package className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{item.quantity}</span>
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div>
                  {item.buttonVariant === "solid" ? (
                    <button
                      onClick={() => onActionClick && onActionClick(item)}
                      className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onActionClick && onActionClick(item)}
                      className="w-full bg-white hover:bg-emerald-50 active:scale-[0.98] text-[#16a34a] border border-[#16a34a] font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
