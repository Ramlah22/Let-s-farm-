"use client";

import React, { useState } from "react";
import {
  X,
  MapPin,
  Compass,
  FileCheck2,
  UploadCloud,
  Camera,
  Plus,
  CheckCircle2,
  Info,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createPlot } from "@/lib/firestore";

interface AddPlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlotAdded?: (plot: any) => void;
}

export default function AddPlotModal({
  isOpen,
  onClose,
  onPlotAdded,
}: AddPlotModalProps) {
  const { user } = useAuth();
  const [plotName, setPlotName] = useState("");
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [plotSize, setPlotSize] = useState("");
  const [crops, setCrops] = useState<string[]>(["Yellow Maize", "Cassava"]);
  const [newCropInput, setNewCropInput] = useState("");
  const [showCropInput, setShowCropInput] = useState(false);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddCrop = () => {
    if (newCropInput.trim() && !crops.includes(newCropInput.trim())) {
      setCrops([...crops, newCropInput.trim()]);
      setNewCropInput("");
      setShowCropInput(false);
    }
  };

  const removeCrop = (cropToRemove: string) => {
    setCrops(crops.filter((c) => c !== cropToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const parsedSize = parseFloat(plotSize) || 1.8;
      const plotData = {
        name: plotName || "East Valley Plot C",
        sizeHectares: parsedSize,
        location: location || "Kwang Village, Jos South LGA, Plateau State",
        crops,
        landmark: landmark || "Behind Government Technical College",
        status: "Active" as const,
        cadastralRef: `NG-PL-JS-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      if (user) {
        const saved = await createPlot(user.uid, plotData);
        if (onPlotAdded) {
          onPlotAdded(saved);
        }
      } else if (onPlotAdded) {
        onPlotAdded({ id: `plot-${Date.now()}`, ...plotData });
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to create plot in Firestore:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header matching PDF */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Add New Plot</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900">
                Plot Registered Successfully!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your cadastral parcel has been queued for field extension agent
                validation and satellite boundary synchronization.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* PLOT NAME * */}
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  PLOT NAME *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. East Valley Plot C or Rayfield Extension"
                    value={plotName}
                    onChange={(e) => setPlotName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-[#fafbfa]"
                  />
                </div>
              </div>

              {/* PHYSICAL LOCATION (VILLAGE / LGA / STATE) * */}
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  PHYSICAL LOCATION (VILLAGE / LGA / STATE) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwang Village, Jos South LGA, Plateau State"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-[#fafbfa]"
                  />
                </div>
              </div>

              {/* NEARBY LANDMARK(S) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  NEARBY LANDMARK(S)
                </label>
                <div className="relative">
                  <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Near Bukuru Water Board, Opposite Police Post"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-[#fafbfa]"
                  />
                </div>
              </div>

              {/* PLOT SIZE (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                    PLOT SIZE
                  </label>
                  <span className="text-xs text-slate-400 font-medium">
                    (Optional)
                  </span>
                </div>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-[#fafbfa] focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 1.8"
                    value={plotSize}
                    onChange={(e) => setPlotSize(e.target.value)}
                    className="flex-1 px-4 py-3 text-sm placeholder:text-slate-400 bg-transparent focus:outline-none"
                  />
                  <div className="px-4 py-3 bg-slate-100 text-xs font-semibold text-slate-700 border-l border-slate-200 flex items-center">
                    Hectares (Ha)
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
                  Optional. Official parcel sizing can be surveyed later by an
                  assigned field extension agent.
                </p>
              </div>

              {/* CURRENT / PLANNED CROPS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-2">
                  CURRENT / PLANNED CROPS
                </label>
                <div className="flex flex-wrap items-center gap-2 p-3 bg-[#fafbfa] border border-slate-200 rounded-xl min-h-[48px]">
                  {crops.map((crop) => (
                    <span
                      key={crop}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200"
                    >
                      <span>{crop}</span>
                      <button
                        type="button"
                        onClick={() => removeCrop(crop)}
                        className="text-emerald-700 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {showCropInput ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Crop name..."
                        value={newCropInput}
                        onChange={(e) => setNewCropInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCrop();
                          }
                        }}
                        className="px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCrop}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCropInput(true)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2.5 py-1 rounded-lg border border-dashed border-emerald-300 hover:bg-emerald-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add crop</span>
                    </button>
                  )}
                </div>
              </div>

              {/* LAND OWNERSHIP & TITLE DOCUMENTS */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <label className="text-xs font-bold text-slate-700 tracking-wider uppercase">
                      LAND OWNERSHIP & TITLE DOCUMENTS
                    </label>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Optional
                  </span>
                </div>

                {/* Yellow / Amber Notice Banner matching PDF */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 mb-3 leading-relaxed">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Notice on Document Verification:</strong> Uploading
                    land ownership documents (e.g. C of O, Family Deed) is
                    optional but gives you a stamp of verification.
                  </span>
                </div>

                {/* Upload Dropzone */}
                <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-[#fbfdfb] rounded-2xl cursor-pointer transition-colors text-center group">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                  {fileName ? (
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                      <FileCheck2 className="w-5 h-5 text-emerald-600" />
                      <span>{fileName}</span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-medium text-slate-700">
                        Drag & drop documents here or{" "}
                        <span className="text-emerald-700 font-bold underline">
                          Browse files
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Supports PDF, JPG, PNG up to 15MB
                      </p>
                      <button
                        type="button"
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                      >
                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                        <span>Take Photo of Title Deed</span>
                      </button>
                    </>
                  )}
                </label>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white font-semibold text-sm shadow-md shadow-emerald-800/20 transition-all flex items-center gap-2"
                >
                  <span>
                    {submitting
                      ? "Registering Plot..."
                      : "Submit Plot Registration"}
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
