"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  Calculator,
  Trash2,
  PackageCheck,
  Clock,
  Save,
  CheckCircle2,
} from "lucide-react";

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing?: any;
  onUpdate?: (updated: any) => void;
  onDelete?: () => void;
}

export default function EditListingModal({
  isOpen,
  onClose,
  listing,
  onUpdate,
  onDelete,
}: EditListingModalProps) {
  const [cropType, setCropType] = useState(listing?.crop || "Yellow Maize");
  const [volumeMudu, setVolumeMudu] = useState(listing?.mudu || "10619");
  const [pricePerMudu, setPricePerMudu] = useState(listing?.price || "362");
  const [inventoryState, setInventoryState] = useState<"ready" | "pre-harvest">("pre-harvest");
  const [submitting, setSubmitting] = useState(false);
  const [updatedSuccess, setUpdatedSuccess] = useState(false);

  if (!isOpen) return null;

  const muduCount = parseFloat(volumeMudu) || 0;
  const unitPrice = parseFloat(pricePerMudu) || 0;
  const totalValue = muduCount * unitPrice;
  const approxKg = muduCount * 1.13;
  const metricTonnes = approxKg / 1000;
  const perTonneRate = metricTonnes > 0 ? totalValue / metricTonnes : 0;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setUpdatedSuccess(true);
      if (onUpdate) {
        onUpdate({
          cropType,
          volumeMudu: muduCount,
          metricTonnes: metricTonnes.toFixed(1),
          totalValue,
          perTonneRate: Math.round(perTonneRate),
        });
      }
      setTimeout(() => {
        setUpdatedSuccess(false);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header matching PDF */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">
            Edit Produce Listing
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
          {updatedSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">
                Listing Updated!
              </h4>
              <p className="text-sm text-slate-600">
                Produce volume, floor pricing, and off-take contracts have been
                refreshed on the commercial node.
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Category & Crop Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-100/70 text-xs font-bold text-slate-600">
                    <span>Grains & Cereals</span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Crop Type *
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-[#fafbfa] text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option>Yellow Maize</option>
                    <option>Fresh Cassava</option>
                    <option>White Sorghum</option>
                  </select>
                </div>
              </div>

              {/* Volume & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Volume / Quantity *
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-[#fafbfa]">
                    <input
                      type="number"
                      required
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
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-[#fafbfa]">
                    <div className="px-3 py-3 bg-slate-100 text-xs font-bold text-slate-700 border-r border-slate-200 flex items-center">
                      ₦
                    </div>
                    <input
                      type="number"
                      required
                      value={pricePerMudu}
                      onChange={(e) => setPricePerMudu(e.target.value)}
                      className="flex-1 px-3.5 py-3 text-sm font-bold text-slate-900 bg-transparent focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Total Market Value:{" "}
                    <span className="font-bold text-slate-900">
                      ₦{totalValue.toLocaleString()}
                    </span>{" "}
                    (~₦{Math.round(perTonneRate).toLocaleString()}/Tonne)
                  </p>
                </div>
              </div>

              {/* Measurement Conversion Box matching edit listing PDF */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>Measurement Conversion</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      CURRENT LISTING VOLUME
                    </span>
                    <span className="block text-xs font-bold text-slate-900 mt-0.5">
                      {muduCount.toLocaleString()} Mudu (~
                      {Math.round(approxKg).toLocaleString()} kg)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      AGGREGATED OFF-TAKE VOLUME
                    </span>
                    <span className="block text-xs font-bold text-emerald-700 mt-0.5">
                      {metricTonnes.toFixed(1)} Metric Tonnes (MT)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      OFF-TAKE FLOOR RATE
                    </span>
                    <span className="block text-xs font-bold text-slate-900 mt-0.5">
                      ₦{Math.round(perTonneRate).toLocaleString()} / Tonne
                    </span>
                  </div>
                </div>
              </div>

              {/* Associated Farm Plot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Associated Farm Plot
                </label>
                <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-100/70 text-xs font-bold text-slate-700">
                  North Plot A - Jos South (Maize Field)
                </div>
              </div>

              {/* Inventory State */}
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

              {/* Bottom Actions with Delete Listing matching PDF */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (onDelete) onDelete();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Listing</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 flex items-center gap-1.5 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {submitting ? "Updating..." : "Update Listing"}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
