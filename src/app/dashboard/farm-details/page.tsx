"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Share2,
  Edit3,
  Plus,
  MapPin,
  ExternalLink,
  Eye,
  CheckCircle2,
  Maximize2,
  Sprout,
  Sun,
  Droplets,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import AddPlotModal from "@/components/dashboard/AddPlotModal";
import EditFarmDetailsModal from "@/components/dashboard/EditFarmDetailsModal";
import ShareProfileModal from "@/components/dashboard/ShareProfileModal";

export default function FarmDetailsPage() {
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<"all" | "A" | "B">("all");

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Action Buttons matching Screenshot 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Farm Details
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Share Profile */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share Profile</span>
          </button>

          {/* Edit Details */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition-all"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Edit Details</span>
          </button>

          {/* + Add New Plot */}
          <button
            onClick={() => setIsAddPlotOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Plot</span>
          </button>
        </div>
      </div>

      {/* Top Parcels Metrics Strip matching Screenshot 3 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Total Registered Area */}
        <div className="md:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                Total Registered Area
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                3.5 <span className="text-base font-semibold text-slate-500">Ha</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            2 Active Plots
          </span>
        </div>

        {/* North Plot A Strip */}
        <div
          onClick={() => setSelectedPlot("A")}
          className={`md:col-span-4 bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
            selectedPlot === "A"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20"
              : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>North Plot A</span>
              <span className="text-xs font-semibold text-slate-400">• 2.0 Ha</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Crop on Field:{" "}
              <span className="font-semibold text-slate-800">Yellow Maize</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Eye className="w-4 h-4 hover:text-emerald-700" />
            <Edit3
              onClick={(e) => {
                e.stopPropagation();
                setIsEditOpen(true);
              }}
              className="w-4 h-4 hover:text-emerald-700"
            />
          </div>
        </div>

        {/* South Plot B Strip */}
        <div
          onClick={() => setSelectedPlot("B")}
          className={`md:col-span-4 bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
            selectedPlot === "B"
              ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20"
              : "border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>South Plot B</span>
              <span className="text-xs font-semibold text-slate-400">• 1.5 Ha</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Crop on Field:{" "}
              <span className="font-semibold text-slate-800">Cassava</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Eye className="w-4 h-4 hover:text-amber-700" />
            <Edit3
              onClick={(e) => {
                e.stopPropagation();
                setIsEditOpen(true);
              }}
              className="w-4 h-4 hover:text-amber-700"
            />
          </div>
        </div>
      </div>

      {/* Cadastral GIS Satellite Map Card matching Screenshot 3 */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        {/* Sub-header with Location & Google Maps Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>Kwang, Jos South, Plateau</span>
          </div>

          <a
            href="https://maps.google.com/?q=9.8052,8.8921"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Satellite Map Container */}
        <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
          {/* Satellite Map Imagery */}
          <div className="absolute inset-0">
            <Image
              src="/hero-farm.jpg"
              alt="Satellite cadastral farm view"
              fill
              className="object-cover scale-125 brightness-75 contrast-110 filter hue-rotate-15"
            />
            {/* Subtle GIS grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.8px,transparent_0.8px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
          </div>

          {/* Regional Labels matching PDF */}
          <div className="absolute top-8 left-8 text-white/80 font-mono text-[11px] drop-shadow flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Kugiya Market Axis</span>
          </div>
          <div className="absolute top-16 left-1/3 text-white/70 font-mono text-[11px] drop-shadow">
            Bukuru Expressway
          </div>
          <div className="absolute bottom-8 right-16 text-white/70 font-mono text-[11px] drop-shadow">
            Rayfield Agro Corridor
          </div>

          {/* Plot A Cadastral Polygon Overlay */}
          <div
            onClick={() => setSelectedPlot("A")}
            className={`absolute top-16 right-1/4 w-44 h-40 border-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center p-3 text-center ${
              selectedPlot === "A" || selectedPlot === "all"
                ? "border-emerald-400 bg-emerald-600/35 backdrop-blur-[1px] shadow-lg shadow-emerald-950/40"
                : "border-emerald-400/50 bg-emerald-600/15"
            }`}
          >
            <span className="text-xs font-bold text-white drop-shadow">
              Maize Plot (Plot A)
            </span>
            <span className="text-[10px] font-mono text-emerald-200 mt-0.5">
              2.0 Hectares
            </span>
          </div>

          {/* Plot B Cadastral Polygon Overlay */}
          <div
            onClick={() => setSelectedPlot("B")}
            className={`absolute top-44 right-1/6 w-48 h-44 border-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center p-3 text-center ${
              selectedPlot === "B" || selectedPlot === "all"
                ? "border-amber-400 bg-amber-500/35 backdrop-blur-[1px] shadow-lg shadow-amber-950/40"
                : "border-amber-400/50 bg-amber-500/15"
            }`}
          >
            <span className="text-xs font-bold text-white drop-shadow">
              Cassava Plot (Plot B)
            </span>
            <span className="text-[10px] font-mono text-amber-200 mt-0.5">
              1.5 Hectares
            </span>
          </div>

          {/* Bottom Satellite Legend Filter Bar matching Screenshot 3 */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-white text-xs">
            <button
              onClick={() => setSelectedPlot("A")}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition-colors ${
                selectedPlot === "A" ? "bg-white/20 font-bold" : "hover:bg-white/10"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Plot A — Maize Corn (2.0 Ha)</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setSelectedPlot("B")}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-lg transition-colors ${
                selectedPlot === "B" ? "bg-white/20 font-bold" : "hover:bg-white/10"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Plot B — Cassava (1.5 Ha)</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Location & Seasonal Intelligence Guidance (As requested by user) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Seasonal Intelligence & Agro-Climatic Guidance
              </h3>
              <p className="text-xs text-slate-500">
                AI Guidance calibrated for Kwang, Jos South (Plateau Guinea Savannah)
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Source: Nigerian Met Agency & IITA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Advisory 1 */}
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Harvest Window: Yellow Maize</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tasseling phase complete. Dry season winds expected in 18 days. Optimal
              pre-harvest harvesting window begins Nov 24–Dec 05.
            </p>
          </div>

          {/* Advisory 2 */}
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <span>Moisture & Soil Management</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jos South humidity dropping to 48%. Cassava tubers enter starch
              consolidation stage. Mulching recommended on Plot B.
            </p>
          </div>

          {/* Advisory 3 */}
          <div className="p-4 rounded-2xl bg-[#fafbfa] border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Pest Advisory: Fall Armyworm</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Surrounding cluster reports FAW low activity. Bi-weekly foliage scan
              advised via LetsFarm Crop Scanner camera.
            </p>
          </div>
        </div>
      </div>

      {/* Add Plot Modal */}
      <AddPlotModal
        isOpen={isAddPlotOpen}
        onClose={() => setIsAddPlotOpen(false)}
      />

      {/* Edit Details Modal */}
      <EditFarmDetailsModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
