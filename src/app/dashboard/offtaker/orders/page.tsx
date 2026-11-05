"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Phone,
  Store,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrders, updateOrderStatus, Order } from "@/lib/firestore";

export default function OfftakerOrdersPage() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimingFilter, setSelectedTimingFilter] = useState<
    "all" | "harvested" | "upcoming"
  >("all");

  const buyerId = user?.uid || "offtaker_guest";

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(buyerId);
      // If user has no orders yet, fetch all recent orders across system
      if (data.length === 0) {
        const general = await getOrders();
        setOrders(general);
      } else {
        setOrders(data);
      }
      setLoading(false);
    } catch (err) {
      console.warn("Failed to load orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [buyerId]);

  const filteredOrders = orders.filter((order) => {
    if (selectedTimingFilter === "harvested") return order.stage === "post-harvest";
    if (selectedTimingFilter === "upcoming") return order.stage === "pre-harvest";
    return true;
  });

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "In Transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Payment Completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Inquiry Accepted":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Orders &amp; Procurement Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor active farm shipments, pre-harvest contract schedules, and verified logistics.
          </p>
        </div>

        {/* Harvest Timing Filter Toggle (Strictly matching PRD Section 3.3) */}
        <div className="inline-flex p-1 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
          <button
            onClick={() => setSelectedTimingFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTimingFilter === "all"
                ? "bg-[#16a34a] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setSelectedTimingFilter("harvested")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTimingFilter === "harvested"
                ? "bg-[#16a34a] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            When Harvested (Ready)
          </button>
          <button
            onClick={() => setSelectedTimingFilter("upcoming")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTimingFilter === "upcoming"
                ? "bg-[#16a34a] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            When Harvest To Be Done (Upcoming)
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
          Loading procurement orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No procurement orders found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven&apos;t placed any direct purchase orders yet. Browse the marketplace or submit custom sourcing requests to regional farmers.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/offtaker/marketplace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-sm"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Browse Produce Marketplace</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredOrders.map((order) => {
            const isHarvested = order.stage === "post-harvest";

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header: Produce Name + Status Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        Ref: {order.paymentReference || order.id.slice(-6)}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {order.crop} — {order.quantity} {order.unit}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Harvest Timing Indicator */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-semibold">Harvest Phase:</span>
                      <span className="font-bold text-slate-900">
                        {isHarvested ? "Post-Harvest (Cured & Bagged)" : "Pre-Harvest Contract"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Schedule:</span>
                      <span className="font-semibold text-emerald-700">
                        {order.harvestTiming ||
                          (isHarvested
                            ? "Ready for pickup / In transit"
                            : "Estimated harvest in 14-21 days")}
                      </span>
                    </div>
                  </div>

                  {/* Farmer Details & Farm Location */}
                  <div className="text-xs text-slate-600 space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Supplier:</span>
                      <span className="font-bold text-slate-800">
                        {order.sellerName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Origin Farm:</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {order.farmLocation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Destination:</span>
                      <span className="font-semibold text-slate-700">
                        {order.deliveryLocation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-400">Total Purchase Value:</span>
                      <span className="font-extrabold text-emerald-700 text-sm">
                        ₦{order.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Ordered: {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  {order.status !== "Delivered" && (
                    <button
                      onClick={async () => {
                        await updateOrderStatus(order.id, "Delivered");
                        loadOrders();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                    >
                      Confirm Delivery
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
