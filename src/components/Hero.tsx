"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onScanCropsClick?: () => void;
}

export default function Hero({ onScanCropsClick }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* ── HERO CONTAINER WITH CURVED BOTTOM EDGE (100vh) ── */}
      <div
        className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-slate-950"
        style={{
          borderBottomLeftRadius: "50% 80px",
          borderBottomRightRadius: "50% 80px",
        }}
      >
        {/* Full-bleed Rice Field Background Photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/rice-field-hero.webp"
            alt="Lush green terraced rice field"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          {/* Vertical Dark Gradient Overlay (top 0.25 to bottom 0.65) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.72) 100%)",
            }}
          />
          {/* Subtle vignette for depth */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* ── SPACER FOR TOP NAVBAR (pt-28 to pt-36) ── */}
        <div className="h-28 sm:h-32 shrink-0" />

        {/* ── CENTERED HERO STACK ── */}
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center my-auto flex flex-col items-center space-y-6 sm:space-y-7">
          {/* 1. Announcement Pill */}
          <div className="inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-white/[0.14] border border-white/25 backdrop-blur-md shadow-sm animate-fadeIn">
            <span className="text-xs sm:text-[13px] font-normal text-white/95 tracking-normal">
              Empowering Farmers Through Direct Market Access.
            </span>
            <Link
              href="#solutions"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-slate-950 text-xs font-semibold hover:bg-slate-100 transition-all shadow-sm"
            >
              <span>See Report</span>
              <ArrowRight className="w-3 h-3 text-slate-950" />
            </Link>
          </div>

          {/* 2. Headline: Two balanced lines, 64-72px desktop, 36-40px mobile, weight 500, tight letter-spacing */}
          <h1 className="text-[2.25rem] sm:text-[3.6rem] lg:text-[4.25rem] font-[500] text-white tracking-[-0.035em] leading-[1.06] max-w-3xl mx-auto text-balance">
            Know Your Farm. Predict Your Harvest.
            <br />
            Connect To Market.
          </h1>

          {/* 3. Subtext: 15-16px, white at 80% opacity, centered, max-width ~560px */}
          <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-[560px] mx-auto text-balance">
            Connecting farmers to the tools, people and resources, aiding them in
            boosting growth and productivity, with direct access to the larger market.
          </p>

          {/* 4. Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 pb-4">
            {/* Primary white pill button with dark text + black circle arrow */}
            <Link
              href="#marketplace"
              className="group inline-flex items-center pl-6 pr-2 py-2 rounded-full bg-white text-slate-950 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-all shadow-lg shadow-black/20"
            >
              <span>Get Started</span>
              <span className="w-7 h-7 ml-3 rounded-full bg-slate-950 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Secondary plain text link in white, no background or border */}
            <button
              onClick={() => {
                if (onScanCropsClick) {
                  onScanCropsClick();
                } else {
                  document
                    .getElementById("detect-diseases")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-white hover:text-white/80 font-medium text-xs sm:text-sm transition-colors py-2 px-3"
            >
              Scan Crops
            </button>
          </div>
        </div>

        {/* ── 5. TRUSTED-BY STRIP (above the bottom curve) ── */}
       
      </div>
    </section>
  );
}
