"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Store,
  Boxes,
  MessageSquarePlus,
  Building2,
  MapPin,
  TrendingUp,
  Inbox,
  Send,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getListings,
  getInquiriesByBuyer,
  getInquiries,
  getOrders,
  ProduceListing,
  BuyerInquiry,
  Order,
} from "@/lib/firestore";

export default function OfftakerOverviewPage() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const buyerId = user?.uid || "offtaker_guest";
  const buyerName = profile?.companyName || profile?.fullName || "Grand Cereals Ltd";

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load real listings
        const allListings = await getListings();
        setListings(allListings);

        // Load inquiries sent by this offtaker (or all inquiries if demo)
        const myInquiries = await getInquiriesByBuyer(buyerId);
        if (myInquiries.length > 0) {
          setInquiries(myInquiries);
        } else {
          const generalInquiries = await getInquiries();
          setInquiries(generalInquiries);
        }

        // Load orders
        const allOrders = await getOrders(buyerId);
        setOrders(allOrders);

        setLoading(false);
      } catch (err) {
        console.warn("Failed to load offtaker overview data:", err);
        setLoading(false);
      }
    }
    loadData();
  }, [buyerId]);

  const deliveredOrders = orders.filter((o) => o.status === "Delivered");
  const deliveredVolumeTons = deliveredOrders.reduce(
    (acc, o) => acc + (o.unit === "tons" ? o.quantity : o.quantity * 0.00113),
    0
  );

  const activeOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Inquiry Pending"
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {buyerName}
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Verified Off-Taker
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Commercial procurement overview, direct farm supply pipelines, and regional delivery tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/offtaker/custom-orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
          >
            <MessageSquarePlus className="w-4 h-4 text-emerald-600" />
            <span>Broadcast Request</span>
          </Link>
          <Link
            href="/dashboard/offtaker/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 active:scale-95 transition-all"
          >
            <Store className="w-4 h-4" />
            <span>Discover Produce</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Summary Cards (Strictly matching PRD Section 3.1) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Enquiries Sent Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Enquiries Sent
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {inquiries.length} <span className="text-lg font-medium text-slate-500">Active</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Direct supplier inquiries submitted
            </p>
          </div>
        </div>

        {/* Metric 2: Products Delivered Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Delivered Produce
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {deliveredVolumeTons > 0 ? deliveredVolumeTons.toFixed(1) : "0"}{" "}
              <span className="text-lg font-medium text-slate-500">MT</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {deliveredOrders.length} successful batch deliveries
            </p>
          </div>
        </div>

        {/* Metric 3: Active Orders Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Active Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {activeOrders.length}{" "}
              <span className="text-lg font-medium text-slate-500">In Transit</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Pre-harvest &amp; ready warehouse batches
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Platform Listings (7 cols) + Inquiries Feed (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Platform Listings Feed */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Fresh Farm Produce Feed
              </h2>
              <p className="text-xs text-slate-500">
                Latest listings verified by Plateau State agricultural agents.
              </p>
            </div>
            <Link
              href="/dashboard/offtaker/marketplace"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
              Loading fresh produce listings...
            </div>
          ) : listings.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No active produce listings currently available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {listings.slice(0, 6).map((listing) => {
                const isReady =
                  listing.stage === "Ready Inventory" ||
                  listing.inventoryState === "Available";

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                            {listing.grade}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">
                            {listing.crop}
                          </h3>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isReady
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {listing.stage || "Ready Inventory"}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">
                            {listing.location || "Plateau State"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-slate-500">Available Volume:</span>
                          <span className="font-bold text-slate-900">
                            {listing.volumeMudu} Mudu ({listing.volumeKg} kg)
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Price per Mudu:</span>
                          <span className="font-extrabold text-emerald-700 text-sm">
                            ₦{listing.pricePerMudu.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-2">
                      <Link
                        href={`/dashboard/offtaker/marketplace?selected=${listing.id}`}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-xs font-bold transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Listing &amp; Inquire</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recent Inquiries & Activity Feed (Sidebar Panel) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Inquiry Pipeline
            </h2>
            <Link
              href="/dashboard/offtaker/orders"
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Orders →
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            {inquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No inquiries sent yet. Browse marketplace listings to start direct farmer negotiations.
              </div>
            ) : (
              <div className="space-y-3.5">
                {inquiries.slice(0, 5).map((inq) => {
                  const isAccepted = inq.status === "accepted";

                  return (
                    <div
                      key={inq.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-[#f9faf9] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          {inq.crop} ({inq.volumeMudu} Mudu)
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isAccepted
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isAccepted ? "Accepted" : "Pending"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Offered: ₦{inq.offeredPrice.toLocaleString()}/Mudu • {inq.buyerName}
                      </p>
                      {isAccepted && (
                        <div className="pt-1.5 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Payment Link Unlocked
                          </span>
                          <Link
                            href="/dashboard/offtaker/orders"
                            className="text-xs font-bold text-slate-900 hover:text-emerald-700 underline"
                          >
                            Pay Now →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Custom Sourcing Banner */}
          <div className="bg-gradient-to-br from-[#0a2e14] to-[#15803d] rounded-3xl p-6 text-white space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-emerald-300" />
              <h3 className="font-bold text-sm">Need Custom Bulk Tonnage?</h3>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Use our AI sourcing tool to specify tons, packaging, and delivery deadlines. Your prompt is broadcast to verified cluster farmers across Plateau State.
            </p>
            <Link
              href="/dashboard/offtaker/custom-orders"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <span>Broadcast Prompt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
