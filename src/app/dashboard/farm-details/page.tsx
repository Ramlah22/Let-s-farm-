"use client";

import React, { useState, useEffect } from "react";
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
  Inbox,
  Trash2,
} from "lucide-react";
import AddPlotModal from "@/components/dashboard/AddPlotModal";
import EditFarmDetailsModal from "@/components/dashboard/EditFarmDetailsModal";
import ShareProfileModal from "@/components/dashboard/ShareProfileModal";
import { useAuth } from "@/context/AuthContext";
import { getPlots, deletePlot, Plot } from "@/lib/firestore";

export default function FarmDetailsPage() {
  const { user, profile } = useAuth();
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlotId, setSelectedPlotId] = useState<string | "all">("all");

  const loadFarmPlots = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userPlots = await getPlots(user.uid);
      setPlots(userPlots);
      setLoading(false);
    } catch (err) {
      console.warn("Error fetching plots:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmPlots();
  }, [user]);

  const handleDeletePlot = async (id: string) => {
    if (confirm("Are you sure you want to delete this plot registration?")) {
      await deletePlot(id);
      loadFarmPlots();
    }
  };

  const totalRegisteredArea = plots.reduce(
    (acc, p) => acc + (p.sizeHectares || 0),
    0
  );

  const farmLocation = profile?.location || "Kwang, Jos South, Plateau State";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Farm Details &amp; Asset Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered land parcels, GPS mapping, and agricultural asset inventory.
          </p>
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
            <span>Edit Farm</span>
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

      {/* Top Parcels Metrics Strip */}
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
                {totalRegisteredArea.toFixed(1)}{" "}
                <span className="text-base font-semibold text-slate-500">Ha</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {plots.length} Active {plots.length === 1 ? "Plot" : "Plots"}
          </span>
        </div>

        {/* Real Registered Parcels Preview */}
        {loading ? (
          <div className="md:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/80 text-center text-xs text-slate-400 flex items-center justify-center">
            Loading registered plots...
          </div>
        ) : plots.length === 0 ? (
          <div className="md:col-span-8 bg-white rounded-2xl p-5 border border-dashed border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              No farm plots registered yet. Click <strong>&ldquo;Add New Plot&rdquo;</strong> to register your field parcels.
            </div>
            <button
              onClick={() => setIsAddPlotOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              Register First Plot →
            </button>
          </div>
        ) : (
          plots.slice(0, 2).map((plot) => (
            <div
              key={plot.id}
              onClick={() => setSelectedPlotId(plot.id)}
              className={`md:col-span-4 bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
                selectedPlotId === plot.id
                  ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20"
                  : "border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="truncate max-w-[140px]">{plot.name}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    • {plot.sizeHectares} Ha
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">
                  Crops:{" "}
                  <span className="font-semibold text-slate-800">
                    {plot.crops?.join(", ") || "General Crop"}
                  </span>
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePlot(plot.id);
                }}
                title="Delete plot"
                className="text-slate-400 hover:text-red-600 p-1 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Cadastral GIS Satellite Map Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        {/* Sub-header with Location & Google Maps Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <span>{farmLocation}</span>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(farmLocation)}`}
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

          {/* Regional Labels */}
          <div className="absolute top-8 left-8 text-white/80 font-mono text-[11px] drop-shadow flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Plateau Agricultural Node</span>
          </div>
          <div className="absolute top-16 left-1/3 text-white/70 font-mono text-[11px] drop-shadow">
            Jos South Aggregation Axis
          </div>
          <div className="absolute bottom-8 right-16 text-white/70 font-mono text-[11px] drop-shadow">
            Kuru - Vom Agricultural Corridor
          </div>

          {/* Render Real Registered Plot Boundaries */}
          {plots.map((p, idx) => {
            const topPositions = [16, 44, 28, 52];
            const rightPositions = ["25%", "15%", "40%", "30%"];
            const top = topPositions[idx % topPositions.length];
            const right = rightPositions[idx % rightPositions.length];

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlotId(p.id)}
                style={{ top: `${top}%`, right: right }}
                className={`absolute w-44 h-36 border-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center p-3 text-center ${
                  selectedPlotId === p.id || selectedPlotId === "all"
                    ? "border-emerald-400 bg-emerald-600/40 backdrop-blur-[1px] shadow-lg shadow-emerald-950/40"
                    : "border-emerald-400/50 bg-emerald-600/15"
                }`}
              >
                <span className="text-xs font-bold text-white drop-shadow">
                  {p.name}
                </span>
                <span className="text-[10px] font-mono text-emerald-200 mt-0.5">
                  {p.sizeHectares} Ha
                </span>
                <span className="text-[9px] text-white/80 mt-1 uppercase font-semibold">
                  {p.crops?.[0] || "Active"}
                </span>
              </div>
            );
          })}

          {/* Bottom Satellite Legend Filter Bar */}
          <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-white text-xs">
            <button
              onClick={() => setSelectedPlotId("all")}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedPlotId === "all" ? "bg-white/20 font-bold" : "hover:bg-white/10"
              }`}
            >
              All Plots ({plots.length})
            </button>
            {plots.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlotId(p.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  selectedPlotId === p.id ? "bg-white/20 font-bold" : "hover:bg-white/10"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="truncate max-w-[120px]">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full Registered Plots List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          All Registered Parcels ({plots.length})
        </h2>
        {plots.length === 0 ? (
          <p className="text-xs text-slate-500">
            No parcels registered. Use the &ldquo;Add New Plot&rdquo; button above to add plots.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plots.map((plot) => (
              <div
                key={plot.id}
                className="p-5 rounded-2xl border border-slate-200/90 bg-[#fafbfa] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{plot.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {plot.status || "Active"}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    <strong>Size:</strong> {plot.sizeHectares} Hectares
                  </p>
                  <p>
                    <strong>Location:</strong> {plot.location || farmLocation}
                  </p>
                  <p>
                    <strong>Crops:</strong> {plot.crops?.join(", ") || "General Crop"}
                  </p>
                  {plot.landmark && (
                    <p>
                      <strong>Landmark:</strong> {plot.landmark}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPlotModal
        isOpen={isAddPlotOpen}
        onClose={() => {
          setIsAddPlotOpen(false);
          loadFarmPlots();
        }}
      />
      <EditFarmDetailsModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
      <ShareProfileModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
