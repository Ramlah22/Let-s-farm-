"use client";

import React from "react";
import Link from "next/link";
import { UserPlus, Handshake, ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-gradient-to-r from-[#021d10] via-[#07361e] to-[#02180d] border-t border-emerald-900/60">
      {/* Background Soft Ambient Light Flares & Precision Lattice */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute -bottom-24 right-1/4 w-[30rem] h-[30rem] rounded-full bg-teal-500/10 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #4ade80 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Get Started Today</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Ready to Transform Your Farming
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup?type=farmer"
              className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base px-7 py-4 rounded-xl shadow-xl shadow-emerald-950/60 border border-emerald-400/30 transition-all duration-200"
            >
              <UserPlus className="w-5 h-5 text-white/90" />
              <span>Register as a Farmer</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/signup?type=off-taker"
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 active:scale-[0.98] text-white border border-white/20 hover:border-white/30 backdrop-blur-md font-bold text-sm sm:text-base px-7 py-4 rounded-xl transition-all duration-200 shadow-sm"
            >
              <Handshake className="w-5 h-5 text-emerald-300" />
              <span>Partner as an Off-taker</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
