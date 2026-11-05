"use client";

import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Smartphone,
  ChevronRight,
} from "lucide-react";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareProfileModal({
  isOpen,
  onClose,
}: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);
  const shareLink = "https://letsfarm.ng/p/musa-rayfield-35";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Share Farm Profile
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
        <div className="p-6 sm:p-8 space-y-6">
          {/* Share Link Box */}
          <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-[#f8faf9]">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono text-slate-600 bg-transparent focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold shadow-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Sharing Channels List */}
          <div className="space-y-3">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SHARING CHANNELS
            </span>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                "Verified LetsFarm Profile: " + shareLink
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Share via WhatsApp
                  </h4>
                  <p className="text-xs text-slate-500">
                    Instant message with verified link and preview summary
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(
                "Verified LetsFarm Cadastral Dossier"
              )}&body=${encodeURIComponent(
                "Here is my verified farm profile: " + shareLink
              )}`}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Share via Email
                  </h4>
                  <p className="text-xs text-slate-500">
                    Send official farm credentials dossier to agribusinesses
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* SMS / Text */}
            <a
              href={`sms:?body=${encodeURIComponent(
                "LetsFarm Profile: " + shareLink
              )}`}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Share via SMS / Text
                  </h4>
                  <p className="text-xs text-slate-500">
                    Send quick SMS summary for rural & USSD recipients
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Bottom Done Button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm shadow-md shadow-emerald-800/20 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
