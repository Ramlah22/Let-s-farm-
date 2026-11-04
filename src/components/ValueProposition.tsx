"use client";

import React from "react";
import { Sprout, Warehouse, UtensilsCrossed, ShieldCheck } from "lucide-react";

const pillars = [
  {
    badge: "Zero Guesswork",
    icon: Sprout,
    title: "For Farmers",
    description:
      "Check plant health, access and share inventory, identify weather patterns and trends.",
  },
  {
    badge: "Guaranteed Supply",
    icon: Warehouse,
    title: "For Off-takers",
    description:
      "Reserve harvests 30 to 60 days before maturity. Access regional aggregation pipelines with real-time moisture & grade validation.",
  },
  {
    badge: "Field to Table",
    icon: UtensilsCrossed,
    title: "For Consumers",
    description:
      "Find out best crops for nutrition, gain access to the marketplace for fresh produce and connect with rural farmers",
  },
  {
    badge: "Verified Provenance",
    icon: ShieldCheck,
    title: "Agent Verified",
    description:
      "Listings for farmers, wholesalers and retailers are verified for the best safety and quality.",
  },
];

export default function ValueProposition() {
  return (
    <section id="solutions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Nigeria&apos;s Agricultural Reality
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative bg-[#fcfdfd] border border-slate-200/90 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-emerald-600 group-hover:text-emerald-700">
                  <span>Learn more</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
