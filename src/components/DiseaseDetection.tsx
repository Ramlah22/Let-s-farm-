"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Scan, ShieldCheck, Zap, AlertTriangle, RefreshCw } from "lucide-react";

export default function DiseaseDetection() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectionState, setDetectionState] = useState<"detected" | "healthy" | "analyzing">("detected");

  const triggerScan = () => {
    setIsScanning(true);
    setDetectionState("analyzing");
    setTimeout(() => {
      setIsScanning(false);
      setDetectionState("detected");
    }, 1800);
  };

  return (
    <section id="detect-diseases" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Phone Frame with Live Scan */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] aspect-[9/16] bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl ring-1 ring-slate-800 shadow-emerald-950/20">
              {/* Phone Notch/Speaker */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-950 rounded-full z-30" />

              {/* Viewport Screen */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-emerald-950 border border-slate-700/50 flex flex-col justify-between">
                {/* Real Crop Plant Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/hero-farm.jpg"
                    alt="Scanning crop plant leaves"
                    fill
                    className="object-cover scale-150 brightness-95 contrast-105"
                  />
                  {/* Subtle camera view green tint */}
                  <div className="absolute inset-0 bg-emerald-950/20 backdrop-brightness-95" />
                </div>

                {/* Top Overlay: LIVE SCAN Indicator */}
                <div className="relative z-20 pt-8 px-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold text-white tracking-widest uppercase">
                      LIVE SCAN
                    </span>
                  </div>

                  <button
                    onClick={triggerScan}
                    title="Rescan"
                    className="bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/20 text-white hover:text-emerald-300 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Center: AI Target Bounding Box */}
                <div className="relative z-20 mx-auto w-48 h-48 my-auto">
                  {/* Animated laser line during scanning */}
                  {isScanning && (
                    <div className="absolute inset-x-0 h-0.5 bg-red-400 shadow-[0_0_8px_#ef4444] animate-bounce z-30" />
                  )}

                  {/* Target Bounding Box matching PDF */}
                  <div className="relative w-full h-full border-2 border-red-500/90 rounded-xl bg-red-500/10 backdrop-blur-[1px] transition-all duration-300">
                    {/* Bounding Box Corner Accents */}
                    <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-red-500" />
                    <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500" />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500" />

                    {/* Red Pill: PEST DETECTED */}
                    <div className="absolute -top-3.5 right-3 bg-red-600 text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded shadow-md flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>
                        {isScanning ? "ANALYZING..." : "PEST DETECTED"}
                      </span>
                    </div>

                    {/* AI Reticle in center */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-60">
                      <Scan className="w-12 h-12 text-red-300" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                {/* Bottom Diagnostic Preview Bar */}
                <div className="relative z-20 p-4 pb-6">
                  <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-xl p-3 text-white">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-emerald-400">FAW Caterpillars</span>
                      <span className="text-slate-300 font-mono">98.4% Match</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      NAFDAC Remedy: Neem Extract + Emamectin Benzoate 5% SG
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title + Descriptions + Feature Cards */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4">
                Detect Diseases and Improve <br className="hidden sm:inline" />
                Farm Health Early
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Diagnose foliar blight, armyworm attacks, and micronutrient
                deficiencies in seconds.
              </p>
            </div>

            {/* 2 Feature Callouts matching the PDF */}
            <div className="space-y-6 pt-2">
              {/* Feature 1: Quick Diagnostic */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    Quick Diagnostic
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Through our crop scanning technology, you can easily scan crops and
                    gain results in a short period of time.
                  </p>
                </div>
              </div>

              {/* Feature 2: Localized Remedies */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">
                    Localized Remedies
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Prescriptions match locally accessible bio-treatments and
                    certified NAFDAC registered solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
