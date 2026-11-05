"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PackageCheck,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Store,
  Inbox,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrders, Order } from "@/lib/firestore";

export default function ConsumerOrdersPage() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const consumerId = user?.uid || "consumer_guest";

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const myOrders = await getOrders(consumerId);
        if (myOrders.length > 0) {
          setOrders(myOrders);
        } else {
          const generalOrders = await getOrders();
          setOrders(generalOrders);
        }
        setLoading(false);
      } catch (err) {
        console.warn("Failed to load consumer orders:", err);
        setLoading(false);
      }
    }
    loadData();
  }, [consumerId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Household Orders &amp; Deliveries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track farm-direct orders, estimated delivery arrival, and farm gate provenance.
          </p>
        </div>

        <Link
          href="/dashboard/consumer/marketplace"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop More Fresh Food</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
          Loading household orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl bg-white border border-dashed border-slate-200 space-y-3">
          <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            No household orders yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Order fresh tubers, grains, or vegetables directly from Plateau smallholders.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/consumer/marketplace"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-sm"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Browse Farm Store</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Order: {order.paymentReference || order.id.slice(-6)}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {order.crop} ({order.quantity} {order.unit})
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {order.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Farmer:</span>
                    <span className="font-bold text-slate-800">{order.sellerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Origin:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {order.farmLocation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Delivery Address:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                      {order.deliveryLocation}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-400">Total Paid:</span>
                    <span className="font-extrabold text-emerald-700 text-sm">
                      ₦{order.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100">
                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Farm Gate Direct
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
