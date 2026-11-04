"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  UploadCloud,
  ArrowRight,
  Sprout,
  ShoppingBag,
  Store,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { useAuth, AccountType } from "@/context/AuthContext";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerWithEmail } = useAuth();

  const [accountType, setAccountType] = useState<AccountType>("farmer");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [cacFileName, setCacFileName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "consumer") setAccountType("consumer");
    else if (typeParam === "off-taker" || typeParam === "offtaker") setAccountType("off-taker");
    else if (typeParam === "farmer") setAccountType("farmer");
  }, [searchParams]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCacFileName(file.name);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const res = await registerWithEmail({
      email,
      password,
      accountType,
      fullName: accountType === "off-taker" ? undefined : fullName,
      companyName: accountType === "off-taker" ? companyName : undefined,
      phone: phone || "08012345678",
      location: location || "Jos South, Plateau State",
      cacDocumentName: cacFileName || undefined,
    });
    setSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1800);
    } else {
      setErrorMsg(res.error || "Failed to create account. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-emerald-200">
      {/* Cinematic atmospheric background with cool depth */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/hero-farm.jpg"
          alt="Farmland background"
          fill
          className="object-cover scale-105 contrast-[1.08] brightness-[0.88]"
          priority
        />
        {/* Balanced elegant overlay - rich, cool, not pitch black */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-[#081f14]/50 to-slate-950/70 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-black/15 mix-blend-multiply" />
      </div>

      {/* Main Centered Signup Card (No background logo header - logo is on the form only) */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/60 my-auto">
          {/* Logo on the form card matching PDF */}
          <div className="flex justify-center mb-4">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl ring-2 ring-emerald-500/20 shadow-sm">
              <Image src="/logo.jpg" alt="LetsFarm" fill className="object-cover" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              {accountType === "farmer" &&
                "Join thousands transforming agriculture across Nigeria"}
              {accountType === "consumer" &&
                "Join thousands accessing fresh, traceable farm produce across Nigeria"}
              {accountType === "off-taker" &&
                "Partner directly with verified farming clusters and secure bulk agricultural produce across Nigeria"}
            </p>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {accountType === "off-taker"
                  ? "Submitted for Verification!"
                  : "Account Created Successfully!"}
              </h2>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Your profile has been saved. Loading your personalized farming dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Dynamic Field: FULL NAME or COMPANY NAME */}
              {accountType === "off-taker" ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                    COMPANY NAME
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grand Cereals Ltd or Plateau Agro Processing"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ibrahim Danladi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL ADDRESS (Now used for primary authentication) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  {accountType === "off-taker" ? "OFFICIAL EMAIL ADDRESS" : "EMAIL ADDRESS"}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder={
                      accountType === "off-taker"
                        ? "procurement@company.ng"
                        : "e.g. ibrahim@example.com"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* LOCATION / LGA */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  {accountType === "off-taker"
                    ? "LOCATION / OPERATIONAL HEADQUARTERS"
                    : "LOCATION / LGA"}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jos South, Plateau State"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
              </div>

              {/* PHONE NUMBER (Saved in Firestore for future features as requested) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  PHONE NUMBER
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="0801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  Compatible with USSD & SMS offline notifications
                </p>
              </div>

              {/* Off-taker CAC upload dropzone */}
              {accountType === "off-taker" && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                    COMPANY REGISTRATION / CAC DOCUMENT
                  </label>
                  <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-xl cursor-pointer transition-colors text-center group">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    {cacFileName ? (
                      <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                        <span>{cacFileName}</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-emerald-800">
                          Click to upload CAC Certificate or Business Registration document
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          PDF, PNG up to 10MB
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}

              {/* SELECT ACCOUNT TYPE 3 Toggle Buttons */}
              <div className="pt-1">
                <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-2">
                  SELECT ACCOUNT TYPE
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Farmer */}
                  <button
                    type="button"
                    onClick={() => setAccountType("farmer")}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      accountType === "farmer"
                        ? "bg-[#16a34a] text-white shadow-md shadow-emerald-700/20"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Sprout className="w-4 h-4" />
                    <span>Farmer</span>
                  </button>

                  {/* Consumer */}
                  <button
                    type="button"
                    onClick={() => setAccountType("consumer")}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      accountType === "consumer"
                        ? "bg-[#16a34a] text-white shadow-md shadow-emerald-700/20"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Consumer</span>
                  </button>

                  {/* Off-taker */}
                  <button
                    type="button"
                    onClick={() => setAccountType("off-taker")}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                      accountType === "off-taker"
                        ? "bg-[#16a34a] text-white shadow-md shadow-emerald-700/20"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Off-taker</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.99] disabled:opacity-70 text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition-all"
                >
                  <span>
                    {submitting
                      ? "Creating Account..."
                      : accountType === "off-taker"
                      ? "Submit for Verification"
                      : "Create Account"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Terms of Service */}
              <p className="text-[11px] text-center text-slate-500 leading-normal pt-1">
                By signing up, you agree to LetsFarm&apos;s{" "}
                <Link href="#" className="font-semibold text-emerald-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                &{" "}
                <Link href="#" className="font-semibold text-emerald-700 hover:underline">
                  Privacy Policy
                </Link>
              </p>

              {/* Login link */}
              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Bottom Legal Footer */}
      <footer className="relative z-10 px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/80 font-medium">
        <div>
          © 2026 LetsFarm Integrated Solutions Ltd. Built for Nigerian Agricultural Prosperity.
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading LetsFarm Portal...</div>}>
      <SignupContent />
    </Suspense>
  );
}
