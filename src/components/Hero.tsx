"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ScanLine } from "lucide-react";

interface HeroProps {
  onScanCropsClick?: () => void;
}

export default function Hero({ onScanCropsClick }: HeroProps) {
  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-farm.jpg"
          alt="Lush green Nigerian farmland with sunset sky"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Deep atmospheric overlay matching the PDF */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-slate-950/85 to-emerald-950/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl space-y-6">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Empowering Farmers <br className="hidden sm:inline" />
            Through Direct Market Access
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-emerald-50/90 font-normal leading-relaxed max-w-2xl">
            Connecting farmers to the tools, people and resources , aiding them in
            boosting growth and productivity, with direct access to the larger
            market.
          </p>

          {/* Action CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="#marketplace"
              className="inline-flex items-center gap-2.5 bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white font-semibold text-base px-6 py-3.5 rounded-lg shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/60 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Explore Marketplace</span>
            </Link>

            <button
              onClick={() => {
                if (onScanCropsClick) {
                  onScanCropsClick();
                } else {
                  const el = document.getElementById("detect-diseases");
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/30 backdrop-blur-md font-semibold text-base px-6 py-3.5 rounded-lg transition-all duration-200 shadow-sm"
            >
              <ScanLine className="w-5 h-5" />
              <span>Scan Crops</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
