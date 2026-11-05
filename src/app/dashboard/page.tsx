"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Maximize2,
  Banknote,
  ShieldCheck,
  Users,
  Camera,
  PlusCircle,
  Store,
  SunMedium,
  CheckCircle,
  Phone,
  FileText,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import AddPlotModal from "@/components/dashboard/AddPlotModal";
import { useAuth } from "@/context/AuthContext";
import { getPlots, getListings, getScans } from "@/lib/firestore";

export default function FarmerDashboardOverview() {
  const { user, profile } = useAuth();
  const [activeInventoryTab, setActiveInventoryTab] = useState<
    "expected" | "ready"
  >("expected");
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [acceptedDeals, setAcceptedDeals] = useState<string[]>([]);
  const [agreementModalItem, setAgreementModalItem] = useState<any>(null);

  // Dynamic stats
  const [totalLandHa, setTotalLandHa] = useState("3.5");
  const [activePlotsCount, setActivePlotsCount] = useState(2);
  const [harvestValueDisplay, setHarvestValueDisplay] = useState("₦2.4 M");
  const [healthStatus, setHealthStatus] = useState("Good Condition");

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const plots = await getPlots(user.uid);
        if (plots && plots.length > 0) {
          const totalHa = plots.reduce((acc, p) => acc + (p.sizeHectares || 0), 0);
          setTotalLandHa(totalHa.toFixed(1));
          setActivePlotsCount(plots.length);
        }

        const listings = await getListings(user.uid);
        if (listings && listings.length > 0) {
          const totalVal = listings.reduce((acc, l) => acc + (l.volumeMudu * l.pricePerMudu || 0), 0);
          if (totalVal > 0) {
            setHarvestValueDisplay(`₦${(totalVal / 1000000).toFixed(1)} M`);
          }
        }

        const scans = await getScans(user.uid);
        if (scans && scans.length > 0) {
          const latest = scans[0];
          setHealthStatus(latest.condition);
        }
      } catch (e) {
        console.warn("Could not load dashboard overview metrics:", e);
      }
    }
    loadStats();
  }, [user]);

  const handleAcceptDeal = (dealId: string) => {
    setAcceptedDeals([...acceptedDeals, dealId]);
  };

  const farmerFirstName = profile?.fullName
    ? profile.fullName.trim().split(" ")[0]
    : "Musa";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title Greeting matching PDF */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Good morning, {farmerFirstName}!
        </h1>
      </div>

      {/* 4 Metric Cards Grid matching PDF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Farm Land */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total Farm Land
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {totalLandHa} <span className="text-xl font-medium text-slate-500">Ha</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {activePlotsCount} registered plot{activePlotsCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Metric 2: Expected Harvest Value */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Expected Harvest Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {harvestValueDisplay}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Aggregated marketplace volume
            </p>
          </div>
        </div>

        {/* Metric 3: Crop Health Status */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Crop Health Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-600 tracking-tight mb-2 line-clamp-1">
              {healthStatus}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              No active pests reported
            </p>
          </div>
        </div>

        {/* Metric 4: Buyer Inquiries */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Buyer Inquiries
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              3 Buyers
            </div>
            <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
              <span>→</span>
              <span>₦420/kg top offer price</span>
            </p>
          </div>
        </div>
      </div>

      {/* 4 Quick Action Cards matching PDF */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Action 1: Check Plant Health (Solid Green) */}
        <Link
          href="/#detect-diseases"
          className="bg-[#16a34a] hover:bg-[#15803d] text-white rounded-2xl p-6 flex items-center gap-4 shadow-md shadow-emerald-800/15 active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-base font-bold leading-snug">
            Check Plant <br /> Health
          </span>
        </Link>

        {/* Action 2: Add New Farm Plot (Soft Mint) */}
        <button
          onClick={() => setIsAddPlotOpen(true)}
          className="bg-white hover:bg-emerald-50/60 border border-emerald-200/80 text-slate-900 rounded-2xl p-6 flex items-center gap-4 shadow-sm active:scale-95 transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-base font-bold leading-snug">
            Add New <br /> Farm Plot
          </span>
        </button>

        {/* Action 3: Sell Your Food (Soft Mint) */}
        <Link
          href="/#marketplace"
          className="bg-white hover:bg-emerald-50/60 border border-emerald-200/80 text-slate-900 rounded-2xl p-6 flex items-center gap-4 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
            <Store className="w-6 h-6" />
          </div>
          <span className="text-base font-bold leading-snug">
            Sell Your <br /> Food
          </span>
        </Link>

        {/* Action 4: Seasonal Insights (Soft Mint) */}
        <Link
          href="/dashboard/farm-details"
          className="bg-white hover:bg-emerald-50/60 border border-emerald-200/80 text-slate-900 rounded-2xl p-6 flex items-center gap-4 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
            <SunMedium className="w-6 h-6" />
          </div>
          <span className="text-base font-bold leading-snug">
            Seasonal <br /> Insights
          </span>
        </Link>
      </div>

      {/* SECTION: Buyer Offers & Purchase Requests matching PDF */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Buyer Offers & Purchase Requests
          </h2>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveInventoryTab("expected")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeInventoryTab === "expected"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Expected Harvest (Field)
            </button>
            <button
              onClick={() => setActiveInventoryTab("ready")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeInventoryTab === "ready"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Ready Stock in Barn
            </button>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {/* Offer 1: Grand Cereals Ltd */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-[#fafbfa] hover:border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Grand Cereals Ltd (Jos South)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    Verified Buyer
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Wants:{" "}
                  <span className="text-slate-900 font-bold">
                    10 Metric Tons of Yellow Maize
                  </span>{" "}
                  @ <span className="text-emerald-700 font-bold">₦420 per kg</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() =>
                  setAgreementModalItem({
                    buyer: "Grand Cereals Ltd (Jos South)",
                    terms:
                      "10 Metric Tons Yellow Maize (Moisture grade <= 13%), Delivery window: Nov 28 - Dec 02, Escrow deposit: ₦4,200,000 via HashPay.",
                  })
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100/70 transition-colors"
              >
                View Agreement
              </button>

              {acceptedDeals.includes("deal-1") ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Deal Accepted</span>
                </span>
              ) : (
                <button
                  onClick={() => handleAcceptDeal("deal-1")}
                  className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Accept ₦4.2M Deal
                </button>
              )}
            </div>
          </div>

          {/* Offer 2: Rashida Food Hub */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-[#fafbfa] hover:border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Store className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Rashida Food Hub (Terminus Market)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase tracking-wider">
                    Retail Partner
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Wants:{" "}
                  <span className="text-slate-900 font-bold">
                    500kg Fresh Cassava Roots
                  </span>{" "}
                  @ <span className="text-emerald-700 font-bold">₦250 per kg</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:09158900701"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100/70 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Buyer</span>
              </a>

              {acceptedDeals.includes("deal-2") ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sale Confirmed</span>
                </span>
              ) : (
                <button
                  onClick={() => handleAcceptDeal("deal-2")}
                  className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Confirm Sale
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Plot Modal */}
      <AddPlotModal
        isOpen={isAddPlotOpen}
        onClose={() => setIsAddPlotOpen(false)}
      />

      {/* Agreement Preview Modal */}
      {agreementModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900">
                  Pre-Harvest Off-Take Agreement
                </h4>
              </div>
              <button
                onClick={() => setAgreementModalItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 font-mono text-slate-700">
              <p>
                <strong>Buyer:</strong> {agreementModalItem.buyer}
              </p>
              <p>
                <strong>Specifications:</strong> {agreementModalItem.terms}
              </p>
              <p>
                <strong>Quality Assurance:</strong> Verified by Plateau State
                Extension Cluster Agent.
              </p>
            </div>
            <button
              onClick={() => setAgreementModalItem(null)}
              className="w-full py-2.5 rounded-xl bg-[#16a34a] text-white font-bold text-xs"
            >
              Close Agreement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
