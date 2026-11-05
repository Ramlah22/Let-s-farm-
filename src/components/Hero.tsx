"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ScanLine, Sprout, TrendingUp, Users } from "lucide-react";

interface HeroProps {
  onScanCropsClick?: () => void;
}

export default function Hero({ onScanCropsClick }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #c8ecd5 0%, #a8dab8 30%, #8ecfa2 60%, #74c48c 100%)",
        minHeight: "calc(100vh - 0px)",
      }}
    >
      {/* Soft blob glows for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 65%)",
            transform: "translate(-25%, -25%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(21,128,61,0.2) 0%, transparent 65%)",
            transform: "translate(20%, 20%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── MAIN HERO BODY ── */}
        <div className="relative flex items-center min-h-[520px] lg:min-h-[560px] py-12">

          {/* ── LEFT: Text Content ── */}
          <div className="relative z-20 w-full lg:w-[52%] space-y-6">

           

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight"
              style={{ color: "#0a2e14" }}
            >
              Empowering Farmers
              <br />
              Through{" "}
              <span
                className="relative inline-block"
                style={{ color: "#166534" }}
              >
                Direct Market
              </span>
              <br />
              Access
            </h1>

            {/* Subtitle */}
            <p
              className="text-base sm:text-lg leading-relaxed max-w-md"
              style={{ color: "#1a4a27" }}
            >
              Connecting farmers to the tools, people and resources, aiding
              them in boosting growth and productivity, with direct access to
              the larger market.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="#marketplace"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
                  boxShadow: "0 8px 24px rgba(21,128,61,0.4)",
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                Explore Marketplace
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

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
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.75)",
                  color: "#0d4a1f",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ScanLine className="w-4 h-4" />
                Scan Crops
              </button>
            </div>

            {/* Social proof row */}
            <div className="flex items-center gap-4 pt-2">
             
            </div>
          </div>

          {/* ── CENTER-RIGHT: Large Crop Image ── */}
          <div
            className="absolute right-0 bottom-0 z-10 pointer-events-none"
            style={{ width: "58%", maxWidth: "720px" }}
          >
            {/* Glow circle behind plant */}
            <div
              className="absolute"
              style={{
                inset: "5% 0% -5% 10%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(200,236,213,0.5) 40%, transparent 70%)",
                borderRadius: "50%",
              }}
            />

            {/* The plant image */}
            <Image
              src="/crop-hero.png"
              alt="Fresh crops"
              width={760}
              height={520}
              className="relative z-10 w-full h-auto object-contain"
              priority
              style={{
                filter:
                  "drop-shadow(0 24px 48px rgba(0,0,0,0.15)) drop-shadow(0 4px 12px rgba(21,128,61,0.2))",
              }}
            />

            {/* Floating top-right card — Farm preview */}
            <div
              className="absolute top-8 right-4 z-20 p-3 rounded-2xl shadow-xl"
              style={{
                background: "rgba(255,255,255,0.80)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.9)",
                width: "180px",
              }}
            >
              {/* Mini placeholder farm image */}
              <div
                className="w-full h-20 rounded-xl mb-2 overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, #a8dab8, #5aab72)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sprout className="w-10 h-10" style={{ color: "rgba(255,255,255,0.7)" }} />
                </div>
                <div
                  className="absolute bottom-1.5 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.75)", color: "#0d4a1f" }}
                >
                  Live Farm View
                </div>
              </div>
              <p
                className="text-[11px] font-bold leading-tight"
                style={{ color: "#0a2e14" }}
              >
                Smart Monitoring
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "#2d6a3f" }}>
                Real-time farm insights
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM FEATURE STRIP ── */}
        <div
          className="relative z-20 grid grid-cols-1 sm:grid-cols-3 gap-px mb-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          {[
            {
              icon: <Sprout className="w-5 h-5" />,
              title: "Smart Farming",
              desc: "AI-powered crop scanning and seasonal guidance help farmers make smarter decisions at every growth stage.",
            },
            {
              icon: <TrendingUp className="w-5 h-5" />,
              title: "Direct Market Access",
              desc: "List produce directly on the marketplace and connect with verified off-takers and consumers — no middlemen.",
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: "Fresh Off-Take",
              desc: "Consumers and off-takers access fresh, traceable produce sourced directly from verified Plateau-region farms.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-6 px-5"
              style={{
                background:
                  i === 0
                    ? "rgba(255,255,255,0.18)"
                    : i === 1
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.08)",
                borderRight:
                  i < 2 ? "1px solid rgba(255,255,255,0.3)" : "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.4)",
                  color: "#0d4a1f",
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3
                  className="text-sm font-bold mb-1"
                  style={{ color: "#0a2e14" }}
                >
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#1a4a27" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
