"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, Wallet, Signal, BatteryCharging, Check } from "lucide-react";

export default function UssdSection() {
  const [dialed, setDialed] = useState(false);

  const handleDial = () => {
    setDialed(true);
    setTimeout(() => setDialed(false), 3500);
  };

  return (
    <section id="reach" className="py-20 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtitle & 3 bullets */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4">
                No Smartphone? No Problem. <br />
                Direct USSD & SMS Access
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Connect directly to our network from any standard mobile phone. No
                internet connection or app download required.
              </p>
            </div>

            {/* 3 Value Points */}
            <div className="space-y-5">
              {/* Point 1 */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-700">
                  Call{" "}
                  <a
                    href="tel:09158900701"
                    className="font-bold text-slate-900 hover:text-emerald-700 underline underline-offset-4 decoration-emerald-500/40"
                  >
                    09158900701
                  </a>{" "}
                  to speak with an agent or report harvest availability.
                </p>
              </div>

              {/* Point 2 */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-700">
                  Get live crop pricing and market updates sent straight to your SMS
                  inbox.
                </p>
              </div>

              {/* Point 3 */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-700">
                  Receive verified purchase payments directly into your mobile money
                  wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Phone dialer screen mock matching the PDF */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 flex flex-col justify-between min-h-[300px]">
              {/* Status Header */}
              <div className="flex items-center justify-between text-slate-400 text-xs pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Signal className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">Cellular</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-mono">100%</span>
                  <BatteryCharging className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              {/* Center Number Display */}
              <div className="py-10 text-center">
                {dialed ? (
                  <div className="animate-fadeIn space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Connecting to LetsFarm Node...
                    </div>
                    <div className="text-2xl font-bold text-slate-900 font-mono">
                      09158900701
                    </div>
                    <p className="text-xs text-slate-500">Jos Aggregation Desk</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                      09158900701
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      Toll-free Hotline & USSD Gateway
                    </p>
                  </div>
                )}
              </div>

              {/* Call Action Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleDial}
                  className="w-16 h-16 rounded-full bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-all group"
                  aria-label="Call LetsFarm"
                >
                  {dialed ? (
                    <Check className="w-7 h-7" />
                  ) : (
                    <Phone className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
