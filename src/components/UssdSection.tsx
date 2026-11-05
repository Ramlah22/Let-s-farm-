"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, Wallet, Signal, BatteryCharging, Check, PhoneCall, Radio } from "lucide-react";

export default function UssdSection() {
  const [dialed, setDialed] = useState(false);

  const handleDial = () => {
    setDialed(true);
    setTimeout(() => setDialed(false), 3500);
  };

  return (
    <section
      id="reach"
      className="relative py-24 sm:py-28 overflow-hidden bg-gradient-to-b from-[#f5f9f6] via-[#e8f2ec] to-[#f4f8f6] border-t border-slate-200/70"
    >
      {/* Background Soft Glows & Precision Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -left-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute -bottom-20 right-20 w-[28rem] h-[28rem] rounded-full bg-teal-500/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #166534 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtitle & 3 bullets */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                <span>Zero-Data Rural Accessibility</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18] mb-4">
                No Smartphone? No Problem. <br />
                Direct USSD & SMS Access
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Connect directly to our network from any standard mobile phone. No
                internet connection or app download required.
              </p>
            </div>

            {/* 3 Value Points Styled as Modern Glass Cards */}
            <div className="space-y-4">
              {/* Point 1 */}
              <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
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
              <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                  Get live crop pricing and market updates sent straight to your SMS
                  inbox.
                </p>
              </div>

              {/* Point 3 */}
              <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                  Receive verified purchase payments directly into your mobile money
                  wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Phone dialer screen mock */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[360px] bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 p-6 sm:p-7 flex flex-col justify-between min-h-[340px]">
              {/* Status Header */}
              <div className="flex items-center justify-between text-slate-400 text-xs pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Signal className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-700">Cellular Network</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-mono font-bold">100%</span>
                  <BatteryCharging className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              {/* Center Number Display */}
              <div className="py-8 text-center">
                {dialed ? (
                  <div className="animate-fadeIn space-y-2.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Connecting to LetsFarm Node...
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                      09158900701
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Jos Aggregation Desk</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-wider">
                      09158900701
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Toll-Free Agri Hotline
                    </div>
                    <p className="text-xs text-slate-400 font-medium pt-1">
                      24/7 Farmer Support & Trade Hotline
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Action Trigger */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleDial}
                  disabled={dialed}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-800/20 flex items-center justify-center gap-2 transition-all disabled:opacity-75"
                >
                  <PhoneCall className={`w-4 h-4 ${dialed ? "animate-bounce" : ""}`} />
                  <span>{dialed ? "Connected to Hotline" : "Simulate USSD Dial"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
