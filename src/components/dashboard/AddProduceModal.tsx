"use client";

import React, { useState } from "react";
import {
  X,
  Sprout,
  Scale,
  Calculator,
  MapPin,
  Clock,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createListing } from "@/lib/firestore";

interface AddProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProduceAdded?: (produce: any) => void;
}

export default function AddProduceModal({
  isOpen,
  onClose,
  onProduceAdded,
}: AddProduceModalProps) {
  const [cropType, setCropType] = useState("Yellow Maize");
  const [volumeMudu, setVolumeMudu] = useState("499");
  const [pricePerMudu, setPricePerMudu] = useState("1200");
  const [associatedPlot, setAssociatedPlot] = useState("North Plot A - Jos South (Maize Field)");
  const [inventoryState, setInventoryState] = useState<"ready" | "pre-harvest">("ready");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Measurement conversions
  const muduCount = parseFloat(volumeMudu) || 0;
  const { user, profile } = useAuth();
  const unitPrice = parseFloat(pricePerMudu) || 0;
  const totalValue = muduCount * unitPrice;
  const approxKg = muduCount * 1.13;
  const metricTonnes = approxKg / 1000;
  const perTonneRate = metricTonnes > 0 ? totalValue / metricTonnes : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const listingData = {
        farmerId: user?.uid || "demo-farmer",
        farmerName: profile?.fullName || "Plateau Farmer",
        crop: cropType,
        volumeMudu: muduCount,
        volumeKg: Math.round(approxKg),
        pricePerMudu: unitPrice,
        grade: "Grade A Export",
        inventoryState: (inventoryState === "ready" ? "Available" : "Reserved") as "Available" | "Reserved",
        plotName: associatedPlot,
        harvestDate: "Dec 2026",
      };

      if (user) {
        const saved = await createListing(listingData);
        if (onProduceAdded) {
          onProduceAdded({
            id: saved.id,
            cropType,
            volumeMudu: muduCount,
            metricTonnes: metricTonnes.toFixed(2),
            totalValue,
            pricePerMudu: unitPrice,
            inventoryState,
            associatedPlot,
          });
        }
      } else if (onProduceAdded) {
        onProduceAdded({
          id: `item-${Date.now()}`,
          cropType,
          volumeMudu: muduCount,
          metricTonnes: metricTonnes.toFixed(2),
          totalValue,
          pricePerMudu: unitPrice,
          inventoryState,
          associatedPlot,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to add produce listing to Firestore:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header matching PDF */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Add New Produce Listing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">
                Produce Batch Listed!
              </h4>
              <p className="text-sm text-slate-600">
                Your produce volume has been aggregated and listed for verified
                off-takers on the Plateau Commercial Node.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Crop Type * */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Crop Type *
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-[#fafbfa] text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Yellow Maize</option>
                  <option>Fresh Cassava</option>
                  <option>White Sorghum</option>
                  <option>Irish Potatoes (Nicola Seed Grade)</option>
                  <option>Soybeans</option>
                </select>
              </div>

              {/* Volume & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Volume / Quantity *
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-[#fafbfa] focus-within:ring-2 focus-within:ring-emerald-500">
                    <input
                      type="number"
                      required
                      placeholder="499"
                      value={volumeMudu}
                      onChange={(e) => setVolumeMudu(e.target.value)}
                      className="flex-1 px-3.5 py-3 text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
                    />
                    <div className="px-3 py-3 bg-slate-100 text-xs font-semibold text-slate-700 border-l border-slate-200 flex items-center">
                      Mudu (Jos bowl)
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    ℹ️ 1 Mudu ≈ 1.13 kg standard Jos bowl
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Price per Mudu *
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-[#fafbfa] focus-within:ring-2 focus-within:ring-emerald-500">
                    <div className="px-3 py-3 bg-slate-100 text-xs font-bold text-slate-700 border-r border-slate-200 flex items-center">
                      ₦
                    </div>
                    <input
                      type="number"
                      required
                      placeholder="1200"
                      value={pricePerMudu}
                      onChange={(e) => setPricePerMudu(e.target.value)}
                      className="flex-1 px-3.5 py-3 text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Estimated Total Batch Value:{" "}
                    <span className="font-bold text-slate-900">
                      ₦{totalValue.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>

              {/* Measurement Conversion Box matching PDF */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>Measurement Conversion</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      ENTERED INPUT
                    </span>
                    <span className="block text-xs font-bold text-slate-900 mt-0.5">
                      {muduCount} Mudu (~{Math.round(approxKg)} kg)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      AGGREGATED LISTING
                    </span>
                    <span className="block text-xs font-bold text-emerald-700 mt-0.5">
                      {metricTonnes.toFixed(3)} MT
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      OFF-TAKE METRIC FLOOR
                    </span>
                    <span className="block text-xs font-bold text-slate-900 mt-0.5">
                      ~₦{Math.round(perTonneRate).toLocaleString()} / Tonne
                    </span>
                  </div>
                </div>
              </div>

              {/* Associated Farm Plot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Associated Farm Plot
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={associatedPlot}
                    onChange={(e) => setAssociatedPlot(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-[#fafbfa] text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option>North Plot A - Jos South (Maize Field)</option>
                    <option>East Valley Plot B - Barkin Ladi</option>
                    <option>South Plot C - Riyom Agro Basin</option>
                  </select>
                </div>
              </div>

              {/* Inventory State matching PDF */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Inventory State
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInventoryState("ready")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      inventoryState === "ready"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500"
                        : "border-slate-200 bg-[#fafbfa] text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <PackageCheck className="w-4 h-4 text-emerald-600" />
                    <span>Ready Stock</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInventoryState("pre-harvest")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      inventoryState === "pre-harvest"
                        ? "bg-amber-50 border-amber-500 text-amber-800 ring-1 ring-amber-500"
                        : "border-slate-200 bg-[#fafbfa] text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Pre-Harvest</span>
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {submitting ? "Saving..." : "Save Produce Listing"}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
