"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Check,
  CheckCircle2,
  Sprout,
  Egg,
  Fish,
  Beef,
  Hexagon,
  Sparkles,
  Layers,
} from "lucide-react";

interface EditFarmDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export default function EditFarmDetailsModal({
  isOpen,
  onClose,
  onSave,
}: EditFarmDetailsModalProps) {
  const [plotAName, setPlotAName] = useState("North Plot A - Maize Sector");
  const [plotASize, setPlotASize] = useState("2.0");
  const [plotACrops, setPlotACrops] = useState(["Yellow Maize"]);
  const [newCropA, setNewCropA] = useState("");
  const [addingCropA, setAddingCropA] = useState(false);

  const [plotBName, setPlotBName] = useState("South Plot B - Cassava Sector");
  const [plotBSize, setPlotBSize] = useState("1.5");
  const [plotBCrops, setPlotBCrops] = useState(["Cassava"]);
  const [newCropB, setNewCropB] = useState("");
  const [addingCropB, setAddingCropB] = useState(false);

  const [selectedEnterprise, setSelectedEnterprise] = useState("Crop Cultivation");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const enterprises = [
    {
      name: "Crop Cultivation",
      icon: Sprout,
      description: "Grains, tubers, legumes & cash crops",
    },
    {
      name: "Poultry Farming",
      icon: Egg,
      description: "Broilers, layers, hatcheries & eggs",
    },
    {
      name: "Aquaculture",
      icon: Fish,
      description: "Catfish ponds, fingerlings, recirculating",
    },
    {
      name: "Cattle & Livestock",
      icon: Beef,
      description: "Dairy, beef cattle, sheep & goats",
    },
    {
      name: "Apiaries (Bees)",
      icon: Hexagon,
      description: "Pure honey, wax & pollination units",
    },
    {
      name: "Heliculture",
      icon: Sparkles,
      description: "Snail pens, slime extract & breeders",
    },
    {
      name: "Other / Mixed Integrated Farming",
      icon: Layers,
      description: "Multi-enterprise agroforestry, greenhouse or horticulture",
    },
  ];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      if (onSave) {
        onSave({
          plotA: { name: plotAName, size: plotASize, crops: plotACrops },
          plotB: { name: plotBName, size: plotBSize, crops: plotBCrops },
          enterprise: selectedEnterprise,
        });
      }
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              Farm Details &gt; Edit Farm Details
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              Edit Farm Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {saved ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">
                Farm Details Updated!
              </h4>
              <p className="text-sm text-slate-600">
                Cadastral parcel revisions have been synchronized with your profile.
              </p>
            </div>
          ) : (
            <>
              {/* SECTION 1: Farm Identification & Boundary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Farm Identification & Boundary
                    </h4>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Total: 3.5 Ha (2 Plots)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Card 01: Plot A */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-[#fafbfa] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                          01
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          Plot A (North Sector)
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Primary Plot
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Plot Name
                        </label>
                        <input
                          type="text"
                          value={plotAName}
                          onChange={(e) => setPlotAName(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Plot Size
                        </label>
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                          <input
                            type="text"
                            value={plotASize}
                            onChange={(e) => setPlotASize(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 pr-2">
                            Ha
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Physical Location / LGA & State
                      </label>
                      <div className="text-xs text-slate-600 bg-slate-100/80 px-3 py-2 rounded-lg font-mono">
                        Kwang, Jos South, Plateau State (9.8052° N, 8.8921° E)
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                        Current Crops on Farm
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {plotACrops.map((crop) => (
                          <span
                            key={crop}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200"
                          >
                            <span>{crop}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setPlotACrops(plotACrops.filter((c) => c !== crop))
                              }
                              className="text-emerald-700 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                        {addingCropA ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              autoFocus
                              placeholder="New crop"
                              value={newCropA}
                              onChange={(e) => setNewCropA(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newCropA.trim()) {
                                  e.preventDefault();
                                  setPlotACrops([...plotACrops, newCropA.trim()]);
                                  setNewCropA("");
                                  setAddingCropA(false);
                                }
                              }}
                              className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newCropA.trim()) {
                                  setPlotACrops([...plotACrops, newCropA.trim()]);
                                  setNewCropA("");
                                }
                                setAddingCropA(false);
                              }}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-xs"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAddingCropA(true)}
                            className="text-xs text-slate-500 hover:text-emerald-700 font-medium px-2 py-1 border border-dashed border-slate-300 rounded"
                          >
                            + Add crop variety...
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card 02: Plot B */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-[#fafbfa] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                          02
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          Plot B (South Sector)
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Secondary Plot
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Plot Name
                        </label>
                        <input
                          type="text"
                          value={plotBName}
                          onChange={(e) => setPlotBName(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Plot Size
                        </label>
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                          <input
                            type="text"
                            value={plotBSize}
                            onChange={(e) => setPlotBSize(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 pr-2">
                            Ha
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Physical Location / LGA & State
                      </label>
                      <div className="text-xs text-slate-600 bg-slate-100/80 px-3 py-2 rounded-lg font-mono">
                        Kwang, Jos South, Plateau State (9.8015° N, 8.8950° E)
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                        Current Crops on Farm
                      </label>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {plotBCrops.map((crop) => (
                          <span
                            key={crop}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200"
                          >
                            <span>{crop}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setPlotBCrops(plotBCrops.filter((c) => c !== crop))
                              }
                              className="text-emerald-700 hover:text-red-600"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                        {addingCropB ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              autoFocus
                              placeholder="New crop"
                              value={newCropB}
                              onChange={(e) => setNewCropB(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newCropB.trim()) {
                                  e.preventDefault();
                                  setPlotBCrops([...plotBCrops, newCropB.trim()]);
                                  setNewCropB("");
                                  setAddingCropB(false);
                                }
                              }}
                              className="px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newCropB.trim()) {
                                  setPlotBCrops([...plotBCrops, newCropB.trim()]);
                                  setNewCropB("");
                                }
                                setAddingCropB(false);
                              }}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-xs"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAddingCropB(true)}
                            className="text-xs text-slate-500 hover:text-emerald-700 font-medium px-2 py-1 border border-dashed border-slate-300 rounded"
                          >
                            + Add crop variety...
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Farm Enterprise Type */}
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Farm Enterprise Type
                  </h4>
                  <p className="text-xs text-slate-500">
                    Select the operational model for accurate input vouchers and
                    off-taker quotas
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {enterprises.map((item) => {
                    const isSelected = selectedEnterprise === item.name;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setSelectedEnterprise(item.name)}
                        className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500"
                            : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm font-bold text-slate-900 mb-1">
                            {item.name}
                          </h5>
                          <p className="text-xs text-slate-500 leading-normal">
                            {item.description}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Active Enterprise
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white font-semibold text-sm shadow-md shadow-emerald-800/20 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
