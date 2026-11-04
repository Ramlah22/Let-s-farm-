"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#051c11] text-slate-300 border-t border-emerald-950/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-emerald-900/40">
          {/* Col 1: Brand & Bio (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 overflow-hidden rounded-full ring-2 ring-emerald-500/30">
                <Image
                  src="/logo.jpg"
                  alt="LetsFarm Nigeria Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">
                  LetsFarm Nigeria
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                  Agribusiness Solution
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Building resilient food supply systems from Jos, Plateau
              State across sub-Saharan Africa.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Plateau Regional Aggregation Hubs Online</span>
            </div>
          </div>

          {/* Col 2: Products & Tech (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-emerald-800/40 pb-2">
              PRODUCTS & TECH
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#marketplace"
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                >
                  <span>AgriShop Storefront</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="#reach"
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                >
                  <span>USSD Offline Engine</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="#detect-diseases"
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Soil & Crop</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="#solutions"
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                >
                  <span>Logistics</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Hub (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-emerald-800/40 pb-2">
              REGIONAL HUB
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Plot 12 Yakubu Gowon Way, Rayfield, Jos, Plateau State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="tel:+23470053873276"
                  className="hover:text-emerald-300 font-medium transition-colors"
                >
                  +234 (0) 700 LETS-FARM
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="mailto:desk@letsfarm.ng"
                  className="hover:text-emerald-300 font-medium transition-colors"
                >
                  desk@letsfarm.ng
                </a>
              </li>
            </ul>

            {/* Verification Tag */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Certified NAFDAC and CAC Compliant AgTech Network</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching PDF text */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 LetsFarm Integrated Solutions Ltd. All rights reserved. Built
            for Nigerian Agricultural Prosperity.
          </p>
          <div className="flex items-center gap-6">
            <a href="#about-us" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#about-us" className="hover:text-slate-300 transition-colors">
              Terms of Trade
            </a>
            <a href="#about-us" className="hover:text-slate-300 transition-colors">
              NAFDAC Standards
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
