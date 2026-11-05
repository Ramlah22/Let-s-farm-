"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  CheckCircle2,
  MapPin,
  Package,
  FileText,
  Ban,
  CheckCircle,
} from "lucide-react";

interface ViewInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function ViewInquiryModal({
  isOpen,
  onClose,
  onAccept,
}: ViewInquiryModalProps) {
  const [buyerChannel, setBuyerChannel] = useState<"offtaker" | "retail">("offtaker");
  const [actionDone, setActionDone] = useState<"accepted" | "rejected" | null>(null);

  if (!isOpen) return null;

  const handleAccept = () => {
    setActionDone("accepted");
    if (onAccept) onAccept();
    setTimeout(() => {
      setActionDone(null);
      onClose();
    }, 1200);
  };

  const handleReject = () => {
    setActionDone("rejected");
    setTimeout(() => {
      setActionDone(null);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
        {/* Header matching PDF */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Produce Inquiries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage incoming bids & off-take agreements for Yellow Maize (Plot North A)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {actionDone ? (
            <div className="py-12 text-center space-y-3">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                  actionDone === "accepted"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {actionDone === "accepted" ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <Ban className="w-8 h-8" />
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {actionDone === "accepted"
                  ? "Offer Accepted Successfully!"
                  : "Offer Rejected"}
              </h4>
              <p className="text-sm text-slate-600">
                {actionDone === "accepted"
                  ? "Escrow lock initialized. Grand Cereals logistics notified."
                  : "The inquiry has been declined and archived."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Main Bid Card matching PDF */}
              <div className="p-6 rounded-2xl border border-slate-200 bg-[#fafbfa] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                    <h4 className="text-base font-bold text-slate-900">
                      Grand Cereals Processing Ltd
                    </h4>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-extrabold text-emerald-700 tracking-tight">
                      ₦2,600,000
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                      ₦325,000 / Ton
                    </span>
                  </div>
                </div>

                {/* Location & Volume Metrics */}
                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Bukuru Industrial Estate, Jos South, Plateau</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-800">
                      8.0 MT (~7,080 Mudu)
                    </span>
                  </div>
                </div>

                {/* Buyer Note */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    BUYER NOTE
                  </span>
                  <p className="text-slate-600 font-medium">No Notes</p>
                </div>

                {/* Buyer Classification */}
                <div className="space-y-2 pt-1">
                  <span className="block text-xs font-bold text-slate-700">
                    Buyer Classification / Channel:
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBuyerChannel("offtaker")}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        buyerChannel === "offtaker"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>Off-taker (Corporate / Wholesaler)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBuyerChannel("retail")}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        buyerChannel === "retail"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                      <span>Retail Consumer</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions matching PDF */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1"
                >
                  Cancel / Close
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReject}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Reject Offer</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAccept}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept Offer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
