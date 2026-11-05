"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  MapPin,
  Scan,
  SunMedium,
  ShoppingBag,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Truck,
  MessageSquarePlus,
  Boxes,
  HeartPulse,
  PackageCheck,
  Building2,
  User,
  Repeat,
} from "lucide-react";
import { useAuth, AccountType } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();

  // Strictly use authenticated profile accountType
  const userRole: AccountType = profile?.accountType || "farmer";

  const displayName =
    userRole === "off-taker"
      ? profile?.companyName || "Grand Cereals Ltd"
      : profile?.fullName || (userRole === "consumer" ? "Amina Bello" : "Musa Yakubu");

  // Farmer Navigation
  const farmerNav = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutGrid,
      active: pathname === "/dashboard",
    },
    {
      name: "Farm Details",
      href: "/dashboard/farm-details",
      icon: MapPin,
      active: pathname === "/dashboard/farm-details",
    },
    {
      name: "Crop Scanner",
      href: "/dashboard/crop-scanner",
      icon: Scan,
      active: pathname === "/dashboard/crop-scanner",
    },
    {
      name: "Seasonal Insights",
      href: "/dashboard/seasonal-insights",
      icon: SunMedium,
      active: pathname === "/dashboard/seasonal-insights",
    },
    {
      name: "Marketplace",
      href: "/dashboard/marketplace",
      icon: ShoppingBag,
      active: pathname === "/dashboard/marketplace",
    },
  ];

  // Off-Taker Navigation (Strictly matching PRD Section 2)
  const offtakerNav = [
    {
      name: "Overview",
      href: "/dashboard/offtaker",
      icon: LayoutGrid,
      active: pathname === "/dashboard/offtaker" || pathname === "/offtaker/overview",
    },
    {
      name: "Marketplace",
      href: "/dashboard/offtaker/marketplace",
      icon: ShoppingBag,
      active: pathname === "/dashboard/offtaker/marketplace" || pathname === "/offtaker/marketplace",
    },
    {
      name: "Orders",
      href: "/dashboard/offtaker/orders",
      icon: Truck,
      active: pathname === "/dashboard/offtaker/orders" || pathname === "/offtaker/orders",
    },
    {
      name: "Custom Orders",
      href: "/dashboard/offtaker/custom-orders",
      icon: MessageSquarePlus,
      active: pathname === "/dashboard/offtaker/custom-orders" || pathname === "/offtaker/custom-orders",
    },
    {
      name: "Inventory",
      href: "/dashboard/offtaker/inventory",
      icon: Boxes,
      active: pathname === "/dashboard/offtaker/inventory" || pathname === "/offtaker/inventory",
    },
  ];

  // Consumer Navigation
  const consumerNav = [
    {
      name: "Overview",
      href: "/dashboard/consumer",
      icon: LayoutGrid,
      active: pathname === "/dashboard/consumer",
    },
    {
      name: "Marketplace",
      href: "/dashboard/consumer/marketplace",
      icon: ShoppingBag,
      active: pathname === "/dashboard/consumer/marketplace",
    },
    {
      name: "Nutritional Guide",
      href: "/dashboard/consumer/nutrition",
      icon: HeartPulse,
      active: pathname === "/dashboard/consumer/nutrition",
    },
    {
      name: "My Orders",
      href: "/dashboard/consumer/orders",
      icon: PackageCheck,
      active: pathname === "/dashboard/consumer/orders",
    },
  ];

  const currentNav =
    userRole === "off-taker"
      ? offtakerNav
      : userRole === "consumer"
      ? consumerNav
      : farmerNav;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30">
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 overflow-hidden rounded-xl ring-2 ring-emerald-600/20 shadow-sm">
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
                Nigeria AgriTech
              </span>
            </div>
          </Link>
        </div>

        {/* Active Portal Badge (Non-clickable, reflects strictly registered role) */}
        <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Portal Mode
          </span>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200/70 px-2.5 py-0.5 rounded-full capitalize flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {userRole}
          </span>
        </div>

        {/* Primary Role-Aware Navigation */}
        <nav className="p-4 space-y-1.5">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#16a34a] text-white shadow-md shadow-emerald-800/15"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation & Profile */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
            pathname === "/dashboard/settings"
              ? "bg-[#16a34a] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
          }`}
        >
          <Settings
            className={`w-4 h-4 ${
              pathname === "/dashboard/settings" ? "text-white" : "text-slate-500"
            }`}
          />
          <span>Settings</span>
        </Link>

        <a
          href="tel:09158900701"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Help & USSD Support</span>
        </a>

        {/* User Profile Card */}
        <div className="pt-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm uppercase">
                {displayName.charAt(0)}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-500 truncate flex items-center gap-1 capitalize">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Verified {userRole}</span>
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
