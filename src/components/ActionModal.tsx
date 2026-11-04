"use client";

import React, { useState } from "react";
import { X, CheckCircle, ArrowRight, ShieldCheck, Phone, User, Building, MapPin } from "lucide-react";

export type ModalType =
  | "signin"
  | "getstarted"
  | "pre-offer"
  | "dispatch"
  | "inspection"
  | "farmer-reg"
  | "offtaker-partner"
  | "scan-crops"
  | null;

interface ActionModalProps {
  type: ModalType;
  itemData?: any;
  onClose: () => void;
}

export default function ActionModal({ type, itemData, onClose }: ActionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    state: "Plateau State",
    notes: "",
  });

  if (!type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after success
    }, 2500);
  };

  const getModalTitle = () => {
    switch (type) {
      case "signin":
        return "Sign In to LetsFarm";
      case "getstarted":
        return "Get Started with LetsFarm";
      case "pre-offer":
        return `Submit Bulk Pre-Offer: ${itemData?.title || "Commodity"}`;
      case "dispatch":
        return `Order Dispatch: ${itemData?.title || "Commodity"}`;
      case "inspection":
        return `Request Field Inspection: ${itemData?.title || "Commodity"}`;
      case "farmer-reg":
        return "Register as a Verified Farmer";
      case "offtaker-partner":
        return "Partner as an Institutional Off-taker";
      case "scan-crops":
        return "Instant Crop Health Diagnostic";
      default:
        return "LetsFarm Action";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-emerald-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{getModalTitle()}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Powered by LetsFarm Regional Hub • Jos, Plateau
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Request Received!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                A LetsFarm Regional Agent will contact you on{" "}
                <span className="font-semibold text-slate-800">
                  {formData.phone || "your phone"}
                </span>{" "}
                within 15 minutes to verify details.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="bg-[#16a34a] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#15803d]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {itemData && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1">
                  <div className="font-bold text-slate-800">{itemData.title}</div>
                  <div className="text-slate-500">
                    Location: {itemData.location} • Volume: {itemData.quantity}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ibrahim Danladi"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number (SMS & WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="0803 000 0000 or 0915 890 0701"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  State / Hub Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option>Plateau State (Jos Hub)</option>
                    <option>Kaduna State</option>
                    <option>Benue State</option>
                    <option>Nasarawa State</option>
                    <option>Kano State</option>
                    <option>Oyo State</option>
                    <option>Federal Capital Territory (Abuja)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Notes / Quantity Needed
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify quantity or delivery requirements..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.99] text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Submit to Network</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified & encrypted by LetsFarm Secure Protocol
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
