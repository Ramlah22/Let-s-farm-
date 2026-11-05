"use client";

import React from "react";
import { Sprout, Warehouse, UtensilsCrossed, ShieldCheck, ArrowRight } from "lucide-react";

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
    <section
      id="solutions"
      className="relative py-24 sm:py-28 overflow-hidden bg-gradient-to-b from-[#f7faf8] via-[#edf5f0] to-[#f5f9f6]"
    >
      {/* Background Ambient Glow & Geometric Lattice */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] rounded-full bg-teal-500/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #15803d 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching exact words */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Agribusiness Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Built for Nigeria&apos;s Agricultural Reality
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Engineered specifically to solve post-harvest loss, information asymmetry, and fragmented regional logistics.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-7 hover:shadow-2xl hover:shadow-emerald-900/10 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Sleek Top Gradient Accent Border */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100/80 border border-emerald-200/80 flex items-center justify-center text-emerald-700 group-hover:from-emerald-600 group-hover:to-green-700 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-700/25 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50/90 text-emerald-800 border border-emerald-200/80">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-emerald-700 transition-colors">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
