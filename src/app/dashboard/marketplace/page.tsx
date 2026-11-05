"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
} from "lucide-react";
import AddProduceModal from "@/components/dashboard/AddProduceModal";
import EditListingModal from "@/components/dashboard/EditListingModal";
import ViewInquiryModal from "@/components/dashboard/ViewInquiryModal";
import { useAuth } from "@/context/AuthContext";
import { getListings, deleteListing as deleteFirestoreListing, ProduceListing } from "@/lib/firestore";

interface ListingItem {
  id: string;
  badge: string;
  badgeType: "contract" | "inspection";
  crop: string;
  location: string;
  volume: string;
  unitPrice: string;
  totalValue: string;
  mudu: string;
  price: string;
}

const initialListings: ListingItem[] = [
  {
    id: "item-1",
    badge: "Pre-Listing Contract",
    badgeType: "contract",
    crop: "Yellow Maize",
    location: "North Plot A - Jos South",
    volume: "12.0 MT",
    unitPrice: "₦320,000 / Ton",
    totalValue: "₦3,840,000",
    mudu: "10619",
    price: "362",
  },
  {
    id: "item-2",
    badge: "Inspection Scheduled",
    badgeType: "inspection",
    crop: "Cassava",
    location: "East Valley Plot B",
    volume: "6.5 MT",
    unitPrice: "₦180,000 / Ton",
    totalValue: "₦1,170,000",
    mudu: "5752",
    price: "203",
  },
];

const completedSales = [
  {
    date: "Oct 28, 2026",
    crop: "Maize",
    quantity: "2.0 Tons",
    settledValue: "₦960,000",
    buyer: "Jos Central Superstores Ltd",
    paymentStatus: "HashPay Escrow Settled ✓",
    paymentBadge: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    date: "Oct 14, 2026",
    crop: "Cassava",
    quantity: "1.5 Tons",
    settledValue: "₦420,000",
    buyer: "Rayfield AgriMarket Wholesalers",
    paymentStatus: "Bank Transfer Completed ✓",
    paymentBadge: "bg-blue-50 text-blue-800 border-blue-200",
  },
];

export default function FarmerMarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingItem[]>(initialListings);
  const [isAddProduceOpen, setIsAddProduceOpen] = useState(false);
  const [selectedListingForEdit, setSelectedListingForEdit] = useState<ListingItem | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // Filters
  const [selectedCrop, setSelectedCrop] = useState("All Crops (Maize, Cassava, Soybeans)");
  const [selectedHarvestType, setSelectedHarvestType] = useState("Expected Harvest / Pre-Listing (3)");
  const [selectedPlot, setSelectedPlot] = useState("All Plots (Jos South Node)");

  // Load farmer's listings from Firestore
  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const firestoreListings = await getListings(user.uid);
        if (firestoreListings && firestoreListings.length > 0) {
          const mapped: ListingItem[] = firestoreListings.map((fl) => {
            const mt = (fl.volumeKg / 1000).toFixed(2);
            const total = fl.volumeMudu * fl.pricePerMudu;
            return {
              id: fl.id,
              badge: fl.inventoryState === "Available" ? "Ready for Dispatch" : "Pre-Listing Contract",
              badgeType: "contract",
              crop: fl.crop,
              location: fl.plotName || "Jos South LGA",
              volume: `${mt} MT`,
              unitPrice: `₦${Math.round(total / (parseFloat(mt) || 1)).toLocaleString()} / Ton`,
              totalValue: `₦${total.toLocaleString()}`,
              mudu: String(fl.volumeMudu),
              price: String(fl.pricePerMudu),
            };
          });
          setListings(mapped);
        }
      } catch (err) {
        console.warn("Could not load listings from Firestore:", err);
      }
    }
    loadData();
  }, [user]);

  const handleProduceAdded = (newProduce: any) => {
    const item: ListingItem = {
      id: newProduce.id || `item-${Date.now()}`,
      badge:
        newProduce.inventoryState === "ready"
          ? "Ready for Dispatch"
          : "Pre-Listing Contract",
      badgeType: "contract",
      crop: newProduce.cropType,
      location: newProduce.associatedPlot?.split("-")[0]?.trim() || "Jos South",
      volume: `${newProduce.metricTonnes} MT`,
      unitPrice: `₦${Math.round(
        newProduce.totalValue / (parseFloat(newProduce.metricTonnes) || 1)
      ).toLocaleString()} / Ton`,
      totalValue: `₦${newProduce.totalValue.toLocaleString()}`,
      mudu: String(newProduce.volumeMudu),
      price: String(newProduce.pricePerMudu),
    };
    setListings([item, ...listings]);
  };

  const handleListingUpdated = (updatedData: any) => {
    if (!selectedListingForEdit) return;
    setListings(
      listings.map((l) =>
        l.id === selectedListingForEdit.id
          ? {
              ...l,
              crop: updatedData.cropType,
              volume: `${updatedData.metricTonnes} MT`,
              totalValue: `₦${updatedData.totalValue.toLocaleString()}`,
              unitPrice: `₦${updatedData.perTonneRate.toLocaleString()} / Ton`,
            }
          : l
      )
    );
  };

  const handleDeleteListing = async (id: string) => {
    try {
      if (!id.startsWith("item-")) {
        await deleteFirestoreListing(id);
      }
    } catch (err) {
      console.warn("Could not delete from Firestore:", err);
    }
    setListings(listings.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Node location dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            Plateau Commercial Node
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Farmer Marketplace
          </h1>
        </div>

        {/* Add New Produce CTA */}
        <button
          onClick={() => setIsAddProduceOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Produce</span>
        </button>
      </div>

      {/* Filter Row matching PDF */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Crop Selector */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase mb-1">
              <span>Crop</span>
              <span className="text-emerald-700">All Selected</span>
            </div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#fafbfa] text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option>All Crops (Maize, Cassava, Soybeans)</option>
              <option>Yellow Maize</option>
              <option>Cassava</option>
              <option>Soybeans</option>
            </select>
          </div>

          {/* Harvest Type */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase mb-1">
              <span>Harvest Type</span>
              <span className="text-emerald-700">Pre-Listing</span>
            </div>
            <select
              value={selectedHarvestType}
              onChange={(e) => setSelectedHarvestType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#fafbfa] text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option>🌾 Expected Harvest / Pre-Listing (3)</option>
              <option>Ready Stock in Barn</option>
              <option>All Batches</option>
            </select>
          </div>

          {/* Plot */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase mb-1">
              <span>Plot</span>
              <span className="text-emerald-700">Jos South</span>
            </div>
            <select
              value={selectedPlot}
              onChange={(e) => setSelectedPlot(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#fafbfa] text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option>All Plots (Jos South Node)</option>
              <option>North Plot A - Maize</option>
              <option>East Valley Plot B - Cassava</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-medium text-slate-500">
          <span>Active Filters:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
            <span>Crop: All</span>
            <button className="text-slate-400 hover:text-slate-700">✕</button>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <span>Harvest: Expected Harvest (Pre-Listing)</span>
            <button className="text-emerald-700 hover:text-red-600">✕</button>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
            <span>Plot: All Plots (Jos South)</span>
            <button className="text-slate-400 hover:text-slate-700">✕</button>
          </span>
        </div>
      </div>

      {/* 2 Produce Listing Cards matching PDF */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5 hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Badge Row */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                    item.badgeType === "contract"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              {/* Crop & Plot Location */}
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {item.crop}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item.location}</span>
              </p>

              {/* Volume & Price Metrics */}
              <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-slate-100">
                <div>
                  <span className="block text-[11px] font-bold uppercase text-slate-400">
                    Listed Volume
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {item.volume}
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-bold uppercase text-slate-400">
                    Floor Unit Price
                  </span>
                  <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                    {item.unitPrice}
                  </div>
                </div>
              </div>

              {/* Total Market Value */}
              <div className="flex items-baseline justify-between pt-3 text-xs">
                <span className="text-slate-500 font-medium">Total Market Value</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {item.totalValue}
                </span>
              </div>
            </div>

            {/* Bottom Card Actions matching PDF */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedListingForEdit(item)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors text-center"
              >
                Edit Listing
              </button>

              <button
                onClick={() => setIsInquiryOpen(true)}
                className="py-2.5 px-3 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-800 border border-blue-200/60 text-xs font-bold transition-colors text-center flex items-center justify-center gap-1"
              >
                <span>View Inquiries</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Table: Recent Completed Sales Ledger matching PDF */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            Recent Completed Sales Ledger
          </h3>
          <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <span>View More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-3">
                <th className="pb-3 font-bold">SETTLEMENT DATE</th>
                <th className="pb-3 font-bold">PRODUCE DESCRIPTION</th>
                <th className="pb-3 font-bold">QUANTITY (MT)</th>
                <th className="pb-3 font-bold">SETTLED VALUE</th>
                <th className="pb-3 font-bold">OFF-TAKER / BUYER</th>
                <th className="pb-3 font-bold text-right">PAYMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {completedSales.map((sale, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 text-slate-600 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sale.date}</span>
                  </td>
                  <td className="py-3.5 font-bold text-slate-900">
                    • {sale.crop}
                  </td>
                  <td className="py-3.5 text-slate-600">{sale.quantity}</td>
                  <td className="py-3.5 font-bold text-slate-900">
                    {sale.settledValue}
                  </td>
                  <td className="py-3.5 text-slate-700">{sale.buyer}</td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full border text-[11px] font-bold ${sale.paymentBadge}`}
                    >
                      {sale.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Produce Modal */}
      <AddProduceModal
        isOpen={isAddProduceOpen}
        onClose={() => setIsAddProduceOpen(false)}
        onProduceAdded={handleProduceAdded}
      />

      {/* Edit Listing Modal */}
      <EditListingModal
        isOpen={!!selectedListingForEdit}
        onClose={() => setSelectedListingForEdit(null)}
        listing={selectedListingForEdit}
        onUpdate={handleListingUpdated}
        onDelete={() => {
          if (selectedListingForEdit) handleDeleteListing(selectedListingForEdit.id);
        }}
      />

      {/* View Inquiry Modal */}
      <ViewInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </div>
  );
}
