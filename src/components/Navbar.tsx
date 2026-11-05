"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { profile, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardHref =
    profile?.accountType === "off-taker"
      ? "/dashboard/offtaker"
      : profile?.accountType === "consumer"
      ? "/dashboard/consumer"
      : "/dashboard";

  const navLinks = [
    { label: "Solution", href: "#solutions" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Marketplace", href: "#marketplace" },
    { label: "Reach (USSD/SMS)", href: "#reach" },
    { label: "About us", href: "#about-us" },
  ];

  return (
    <>
      {/* ── 1. TOP HEADER (Stays on Hero - scrolls away with hero) ── */}
      <header className="absolute top-0 left-0 right-0 z-40 w-full pt-5 sm:pt-6 px-5 sm:px-10">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between h-12">
          {/* Left: Brand Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/30 group-hover:ring-white/60 transition-all">
              <Image
                src="/logo.jpg"
                alt="LetsFarm Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
              LetsFarm
            </span>
          </Link>

          {/* Right: Auth Action Buttons ("Sign In" and "Get Started") */}
          <div className="hidden sm:flex items-center space-x-5">
            {profile ? (
              <div className="flex items-center gap-3">
                <Link
                  href={dashboardHref}
                  className="bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => logout()}
                  title="Log out"
                  className="text-white/70 hover:text-white p-1.5 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 sm:gap-5">
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white hover:bg-slate-100 active:scale-95 text-slate-950 text-xs sm:text-sm font-semibold px-5 py-2 rounded-full shadow-md transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 rounded-full focus:outline-none bg-white/10 backdrop-blur-md border border-white/20"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mx-auto mt-3 rounded-2xl bg-[#0c2415]/95 backdrop-blur-2xl border border-white/20 px-6 py-6 space-y-4 shadow-2xl animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-white/90 hover:text-white py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              {profile ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold bg-white text-slate-950 rounded-full"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-xs font-medium text-white/90 border border-white/20 rounded-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-xs font-semibold bg-white text-slate-950 rounded-full"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── 2. FLOATING GLASS PILL NAVBAR (hidden on mobile) ── */}
      <nav
        aria-label="Main Navigation"
        className="hidden sm:block fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300"
      >
        <div
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full border shadow-2xl transition-all duration-300 ${
            scrolled
              ? "bg-[#7da66b]/50 backdrop-blur-xl border-white/30 shadow-black/20"
              : "bg-[#a3c98d]/40 backdrop-blur-lg border-white/25 shadow-black/10"
          }`}
          style={{
            boxShadow: scrolled
              ? "0 14px 34px -4px rgba(0, 0, 0, 0.45), 0 0 1px 1px rgba(255, 255, 255, 0.15) inset"
              : "0 10px 28px -4px rgba(0, 0, 0, 0.35), 0 0 1px 1px rgba(255, 255, 255, 0.12) inset",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13.5px] font-medium text-white/90 hover:text-white px-3.5 py-1 rounded-full hover:bg-white/15 transition-all whitespace-nowrap active:scale-95"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}