"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  Filter,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Search,
  Building2,
  FileSpreadsheet,
  Store,
  Inbox,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrders, Order } from "@/lib/firestore";

export default function OfftakerInventoryPage() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters (Strictly matching PRD Section 3.5)
  const [searchQuery, setSearchQuery] = useState("");
  const [harvestStageFilter, setHarvestStageFilter] = useState<
    "all" | "post-harvest" | "pre-harvest"
  >("all");
  const [cropFilter, setCropFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  const buyerId = user?.uid || "offtaker_guest";

  useEffect(() => {
    async function loadInventory() {
      try {
        setLoading(true);
        const data = await getOrders(buyerId);
        if (data.length === 0) {
          const general = await getOrders();
          setOrders(general);
        } else {
          setOrders(data);
        }
        setLoading(false);
      } catch (err) {
        console.warn("Failed to load inventory:", err);
        setLoading(false);
      }
    }
    loadInventory();
  }, [buyerId]);

  const filteredInventory = orders.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      harvestStageFilter === "all" || item.stage === harvestStageFilter;

    const matchesCrop =
      cropFilter === "all" ||
      item.crop.toLowerCase().includes(cropFilter.toLowerCase());

    const matchesLocation =
      locationFilter === "all" ||
      item.farmLocation.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesStage && matchesCrop && matchesLocation;
  });

  const totalTonsInStock = filteredInventory.reduce((acc, item) => {
    const tons =
      item.unit === "tons"
        ? item.quantity
        : item.quantity * 0.00113; // 1 mudu = 1.13kg = 0.00113 tons
    return acc + tons;
  }, 0);

  const totalValuation = filteredInventory.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Purchased Inventory &amp; Warehouse Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Internal warehouse stock tracking across regional Plateau farm origins and harvest stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/offtaker/marketplace"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all"
          >
            <Store className="w-4 h-4" />
            <span>Procure More Produce</span>
          </Link>
        </div>
      </div>

      {/* Summary Valuation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              Total Volume in Ledger
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {totalTonsInStock.toFixed(1)}{" "}
              <span className="text-sm font-medium text-slate-500">Metric Tons</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              Purchased Batch Valuation
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              ₦{totalValuation > 0 ? (totalValuation / 1000000).toFixed(2) : "0"}{" "}
              <span className="text-sm font-semibold text-slate-500">Million</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              Active Batches
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {filteredInventory.length}{" "}
              <span className="text-sm font-medium text-slate-500">Ledger Records</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Inventory Filter Bar (Strictly matching PRD Section 3.5) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by crop or farm..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Harvest Stage Dropdown */}
          <select
            value={harvestStageFilter}
            onChange={(e) => setHarvestStageFilter(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Harvest Stages</option>
            <option value="post-harvest">Post-Harvest (Delivered / Cured)</option>
            <option value="pre-harvest">Pre-Harvest (Contracted Field)</option>
          </select>

          {/* Crop Type Dropdown */}
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Crop Types</option>
            <option value="maize">Maize (White &amp; Yellow)</option>
            <option value="potato">Irish Potatoes</option>
            <option value="cabbage">Cabbage</option>
            <option value="cassava">Cassava</option>
            <option value="fonio">Fonio (Acha)</option>
            <option value="soybeans">Soybeans</option>
          </select>

          {/* Location Dropdown */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Regional Origins</option>
            <option value="jos">Jos South &amp; North</option>
            <option value="bokkos">Bokkos LGA</option>
            <option value="mangu">Mangu LGA</option>
            <option value="barkin ladi">Barkin Ladi LGA</option>
            <option value="vom">Vom Agricultural Axis</option>
          </select>
        </div>
      </div>

      {/* Purchased Produce Inventory Ledger (Table & Card Grid) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            Loading inventory ledger...
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3">
            <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              No inventory records match filters
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Completed purchase orders and accepted pre-harvest contracts are automatically logged here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Crop Name</th>
                  <th className="px-6 py-4">Harvest Stage</th>
                  <th className="px-6 py-4">Volume Purchased</th>
                  <th className="px-6 py-4">Origin Farm</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4">Storage / Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item) => {
                  const isPost = item.stage === "post-harvest";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-xs">
                            {item.crop.charAt(0)}
                          </div>
                          <span>{item.crop}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPost
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPost ? "bg-emerald-600" : "bg-amber-600"
                            }`}
                          />
                          {isPost ? "Post-Harvest Delivered" : "Pre-Harvest Contract"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-extrabold text-slate-900">
                        {item.quantity} {item.unit}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 block">
                          {item.sellerName}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {item.farmLocation}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-700 block">
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.deliveryLocation}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
