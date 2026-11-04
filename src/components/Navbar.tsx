"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  onOpenAuth?: (mode: "signin" | "getstarted") => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-full ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/40 transition-all">
              <Image
                src="/logo.jpg"
                alt="LetsFarm Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                LetsFarm
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-emerald-700 -mt-1 hidden sm:block">
                Agribusiness Solution
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#solutions"
              className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Solutions
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#marketplace"
              className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Marketplace
            </Link>
            <Link
              href="#reach"
              className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Reach (USSD/SMS)
            </Link>
            <Link
              href="#about-us"
              className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              About Us
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={() => onOpenAuth ? onOpenAuth("signin") : null}
              className="text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors px-2 py-1"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth ? onOpenAuth("getstarted") : null}
              className="bg-[#15803d] hover:bg-[#166534] active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-emerald-700/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-emerald-700 p-2 rounded-md focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            href="#solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
          >
            Solutions
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
          >
            How It Works
          </Link>
          <Link
            href="#marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
          >
            Marketplace
          </Link>
          <Link
            href="#reach"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
          >
            Reach (USSD/SMS)
          </Link>
          <Link
            href="#about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
          >
            About Us
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAuth) onOpenAuth("signin");
              }}
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAuth) onOpenAuth("getstarted");
              }}
              className="w-full text-center py-2.5 text-sm font-semibold bg-[#15803d] hover:bg-[#166534] text-white rounded-lg shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
