"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sprout,
  ShoppingBag,
  Store,
  CheckCircle2,
} from "lucide-react";
import { useAuth, AccountType } from "@/context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const { loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("farmer");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setSubmitting(true);
    const res = await loginWithEmail(email, password);
    setSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setErrorMsg(res.error || "Failed to log in. Please check your credentials.");
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

      {/* Main Centered Login Card (No background logo header - logo is on the form only) */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/60 my-auto">
          {/* Logo on the form card matching PDF */}
          <div className="flex justify-center mb-4">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl ring-2 ring-emerald-500/20 shadow-sm">
              <Image src="/logo.jpg" alt="LetsFarm" fill className="object-cover" />
            </div>
          </div>

          {/* Title & Subtitle matching PDF */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Log in to LetsFarm
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Enter your registered email address to access your agribusiness account.
            </p>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Welcome back!
              </h2>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Authentication confirmed. Redirecting to your agricultural dashboard...
              </p>
            </div>
          ) : (
            /* Main Email Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* EMAIL ADDRESS */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-1.5">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ibrahim@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
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

              {/* Log in with Email CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.99] disabled:opacity-70 text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-800/20 transition-all"
                >
                  <span>
                    {submitting ? "Signing In..." : "Log in with Email"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Navigation Links matching PDF */}
              <div className="pt-4 text-center space-y-2 border-t border-slate-100">
                <p className="text-xs text-slate-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={`/signup?type=${accountType}`}
                    className="font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
                  >
                    Create an account
                  </Link>
                </p>
                <p className="text-xs text-slate-500">
                  Need help logging in?{" "}
                  <a
                    href="tel:09158900701"
                    className="font-semibold text-slate-700 hover:text-emerald-700 underline underline-offset-2"
                  >
                    Contact Support
                  </a>
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
          <a href="tel:09158900701" className="hover:text-white transition-colors">
            Contact Support
          </a>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading LetsFarm Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
