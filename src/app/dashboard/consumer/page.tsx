"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  HeartPulse,
  Truck,
  Sparkles,
  TrendingDown,
  Store,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Inbox,
  ChefHat,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getListings,
  getOrders,
  ProduceListing,
  Order,
} from "@/lib/firestore";

export default function ConsumerOverviewPage() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const consumerId = user?.uid || "consumer_guest";
  const consumerName = profile?.fullName
    ? profile.fullName.trim().split(" ")[0]
    : "Valued Consumer";

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const allListings = await getListings();
        setListings(allListings);

        const myOrders = await getOrders(consumerId);
        if (myOrders.length > 0) {
          setOrders(myOrders);
        } else {
          // If fresh account, fetch general orders for dashboard demo
          const generalOrders = await getOrders();
          setOrders(generalOrders);
        }
        setLoading(false);
      } catch (e) {
        console.warn("Error loading consumer data:", e);
        setLoading(false);
      }
    }
    loadData();
  }, [consumerId]);

  const activeDeliveries = orders.filter(
    (o) => o.status !== "Delivered"
  );

  const completedPurchases = orders.filter(
    (o) => o.status === "Delivered"
  );

  const totalSpent = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {consumerName}!
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Farm-to-Table
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fresh, affordable produce directly from Plateau State farmers with zero middleman markups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/consumer/nutrition"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>AI Nutrition Guide</span>
          </Link>
          <Link
            href="/dashboard/consumer/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy Fresh Crops</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Household Food Basket */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Household Pantry
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {orders.length} <span className="text-lg font-medium text-slate-500">Orders</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Direct farm-gate purchases
            </p>
          </div>
        </div>

        {/* Metric 2: Middleman Savings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Direct Savings
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-700 tracking-tight mb-2">
              ~28%
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              Below open city retail prices
            </p>
          </div>
        </div>

        {/* Metric 3: Nutritional Index */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Dietary Quality
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              94 / 100
            </div>
            <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              High in whole grains &amp; fiber
            </p>
          </div>
        </div>

        {/* Metric 4: Active Farm Deliveries */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Deliveries In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {activeDeliveries.length}{" "}
              <span className="text-lg font-medium text-slate-500">Active</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Direct from Jos &amp; Bokkos farms
            </p>
          </div>
        </div>
      </div>

      {/* 3 Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          href="/dashboard/consumer/marketplace"
          className="bg-[#16a34a] hover:bg-[#15803d] text-white rounded-2xl p-6 flex items-center gap-4 shadow-md shadow-emerald-800/15 active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-snug">Order Fresh Food</h3>
            <p className="text-xs text-emerald-100 mt-0.5">Potatoes, maize, vegetables</p>
          </div>
        </Link>

        <Link
          href="/dashboard/consumer/nutrition"
          className="bg-white hover:bg-emerald-50/60 border border-emerald-200/80 text-slate-900 rounded-2xl p-6 flex items-center gap-4 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-snug">AI Healthy Recipes</h3>
            <p className="text-xs text-slate-500 mt-0.5">Nutritional meal planner</p>
          </div>
        </Link>

        <Link
          href="/dashboard/consumer/orders"
          className="bg-white hover:bg-emerald-50/60 border border-emerald-200/80 text-slate-900 rounded-2xl p-6 flex items-center gap-4 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold leading-snug">Track Deliveries</h3>
            <p className="text-xs text-slate-500 mt-0.5">Direct to your doorstep</p>
          </div>
        </Link>
      </div>

      {/* Fresh Plateau Harvest Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Available Fresh Crops Right Now
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sourced this week from verified smallholder farms across Plateau State.
            </p>
          </div>
          <Link
            href="/dashboard/consumer/marketplace"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Loading fresh crops...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200/90 bg-[#fafbfa] hover:border-emerald-200 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                        {item.grade}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {item.crop}
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700">
                      ₦{item.pricePerMudu.toLocaleString()} / Mudu
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.description || "Freshly harvested from local Plateau soil."}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-2">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{item.location} • Farmer {item.farmerName}</span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/consumer/marketplace?crop=${encodeURIComponent(item.crop)}`}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 text-xs font-bold text-center transition-all"
                >
                  Order This Produce
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
