"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Sprout,
  CheckCircle2,
  Camera,
  ShieldCheck,
  Building,
  LogOut,
  Save,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateFarmerProfile } from "@/lib/firestore";

export default function FarmerSettingsPage() {
  const router = useRouter();
  const { user, profile, logout } = useAuth();

  const [fullName, setFullName] = useState(profile?.fullName || "Musa Yakubu");
  const [phone, setPhone] = useState(profile?.phone || "+234 803 456 7890");
  const [email, setEmail] = useState(profile?.email || "musa.yakubu@farmmail.ng");
  const [location, setLocation] = useState(profile?.location || "Jos South, Plateau State");
  const [specialization, setSpecialization] = useState(
    "Maize & Cassava Cultivator (2 Plots Registered • 14.5 Hectares)"
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.phone) setPhone(profile.phone);
      if (profile.email) setEmail(profile.email);
      if (profile.location) setLocation(profile.location);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (user) {
        await updateFarmerProfile(user.uid, {
          fullName,
          phone,
          location,
          specialization,
          updatedAt: new Date().toISOString(),
        });
      }

      // Update local storage
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("letsfarm_user_profile");
        const parsed = cached ? JSON.parse(cached) : {};
        localStorage.setItem(
          "letsfarm_user_profile",
          JSON.stringify({ ...parsed, fullName, phone, location, specialization })
        );
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title matching PDF */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Farmer Profile & Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Connected to Cloud Firestore • Updates are instantly reflected across your dashboard
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully to Firestore!</span>
        </div>
      )}

      {/* Main Grid: Left Profile Card & Right Form matching PDF */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Profile Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-4">
          {/* Avatar with Camera Icon */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#16a34a] text-white text-4xl font-extrabold flex items-center justify-center shadow-lg shadow-emerald-800/20">
              {fullName ? fullName.charAt(0).toUpperCase() : "M"}
            </div>
            <button
              type="button"
              title="Change photo"
              className="absolute bottom-0 right-0 p-2 rounded-full bg-white border border-slate-200 shadow-md text-slate-600 hover:text-emerald-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Commercial Grain & Root Cultivator
            </p>
          </div>

          {/* Badges matching PDF */}
          <div className="w-full space-y-2 pt-2">
            {/* Identity Verified */}
            <div className="p-3 rounded-2xl bg-[#fafbfa] border border-slate-200/80 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    Identity Verified
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    NIN & USSD Synced
                  </span>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            {/* Cooperative Member */}
            <div className="p-3 rounded-2xl bg-[#fafbfa] border border-slate-200/80 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <Building className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-slate-900">
                    Cooperative Member
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Plateau Grain Union #4481
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-[#fafbfa] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Phone Number & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase">
                    Phone Number
                  </label>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-[#fafbfa] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Farm Region / Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                Primary Farm Region / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-[#fafbfa] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Farm Specialization / Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                Farm Specialization & Description
              </label>
              <div className="relative">
                <Sprout className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  rows={3}
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 bg-[#fafbfa] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-6 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-800/15 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving to Cloud..." : "Save Profile Changes"}</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="py-2.5 px-4 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
