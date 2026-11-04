"use client";

import React from "react";
import { UserPlus, Handshake } from "lucide-react";

interface CtaBannerProps {
  onRegisterFarmer?: () => void;
  onPartnerOfftaker?: () => void;
}

export default function CtaBanner({
  onRegisterFarmer,
  onPartnerOfftaker,
}: CtaBannerProps) {
  return (
    <section className="bg-[#0b3820] relative overflow-hidden py-16 sm:py-20 border-t border-emerald-900/50">
      {/* Subtle organic background mesh */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-center lg:text-left">
              Ready to Transform Your Farming
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onRegisterFarmer}
              className="inline-flex items-center gap-2.5 bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg shadow-lg shadow-emerald-950/50 transition-all duration-200"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register as a Farmer</span>
            </button>

            <button
              onClick={onPartnerOfftaker}
              className="inline-flex items-center gap-2.5 bg-transparent hover:bg-white/10 active:scale-95 text-white border border-white/40 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-lg transition-all duration-200"
            >
              <Handshake className="w-5 h-5" />
              <span>Partner as an Off-taker</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
