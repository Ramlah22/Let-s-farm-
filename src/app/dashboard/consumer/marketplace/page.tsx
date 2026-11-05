"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  HeartPulse,
  CreditCard,
  X,
  ChevronRight,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getListings, createOrder, ProduceListing } from "@/lib/firestore";

function ConsumerMarketplaceContent() {
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");

  // Buy modal states
  const [selectedItem, setSelectedItem] = useState<ProduceListing | null>(null);
  const [orderQuantityMudu, setOrderQuantityMudu] = useState(5);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getListings();
        setListings(data);

        const cropParam = searchParams.get("crop");
        if (cropParam) {
          setSearchQuery(cropParam);
        }

        setLoading(false);
      } catch (err) {
        console.warn("Failed to load consumer listings:", err);
        setLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  const categories = ["All", "Tubers & Roots", "Grains & Cereals", "Fresh Greens"];

  const filtered = listings.filter((l) => {
    const matchesSearch =
      l.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleOpenBuyModal = (item: ProduceListing) => {
    setSelectedItem(item);
    setOrderQuantityMudu(5);
    setDeliveryAddress(profile?.location || "Rayfield, Jos, Plateau State");
    setOrderSuccess(false);
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      await createOrder({
        buyerId: user?.uid || "consumer_guest",
        buyerName: profile?.fullName || "Amina Bello",
        buyerType: "consumer",
        buyerPhone: profile?.phone || "08012345678",
        sellerId: selectedItem.farmerId,
        sellerName: selectedItem.farmerName,
        farmLocation: selectedItem.location || "Plateau State",
        crop: selectedItem.crop,
        quantity: orderQuantityMudu,
        unit: "mudu",
        totalPrice: orderQuantityMudu * selectedItem.pricePerMudu,
        stage: "post-harvest",
        deliveryLocation: deliveryAddress || "Jos Urban Delivery",
        status: "Payment Completed",
        paymentReference: `LF-CONS-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
      });

      setIsSubmitting(false);
      setOrderSuccess(true);
      setTimeout(() => {
        setSelectedItem(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to submit consumer order:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Direct Farm Produce Store
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Order fresh, organic plateau produce in household portions (Mudu &amp; Kilograms).
          </p>
        </div>

        <Link
          href="/dashboard/consumer/nutrition"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <HeartPulse className="w-4 h-4 text-emerald-600" />
          <span>Check Nutrition Facts First</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Irish potatoes, yellow maize, cabbage, fonio..."
          className="w-full text-xs text-slate-900 focus:outline-none bg-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-slate-400 hover:text-slate-600 mr-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
          Loading farm inventory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No produce matches your search</h3>
          <p className="text-xs text-slate-500">Try searching for other fresh Plateau staples.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                <div className="h-40 bg-gradient-to-br from-emerald-100 via-[#e6f5eb] to-slate-100 flex items-center justify-center relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-emerald-800 font-extrabold text-xl group-hover:scale-105 transition-transform">
                    {item.crop.charAt(0)}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
                      {item.grade}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.crop}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{item.location}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-700 block">
                        ₦{item.pricePerMudu.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">per Mudu</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Farmer: <strong>{item.farmerName}</strong></span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Fresh Harvest
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOpenBuyModal(item)}
                  className="w-full py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy Direct from Farmer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Direct Farm Gate Checkout
              </h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {orderSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Order Successfully Placed!
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedItem.farmerName} in {selectedItem.location} has received your order for {orderQuantityMudu} Mudu of {selectedItem.crop}. Delivery is being dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmOrder} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{selectedItem.crop}</h4>
                    <p className="text-[11px] text-slate-600">{selectedItem.location}</p>
                  </div>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    ₦{selectedItem.pricePerMudu.toLocaleString()} / Mudu
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Quantity (Mudu)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderQuantityMudu((prev) => Math.max(1, prev - 1))}
                      className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={orderQuantityMudu}
                      onChange={(e) => setOrderQuantityMudu(Number(e.target.value))}
                      className="w-20 text-center py-2 rounded-xl border border-slate-200 font-extrabold text-slate-900 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setOrderQuantityMudu((prev) => prev + 1)}
                      className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-500 text-[11px]">
                      (~{(orderQuantityMudu * 1.13).toFixed(1)} kg)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter street, estate, or Jos neighborhood..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-700">Total Payable:</span>
                  <span className="font-extrabold text-emerald-700 text-base">
                    ₦{(orderQuantityMudu * selectedItem.pricePerMudu).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold shadow-sm"
                  >
                    {isSubmitting ? "Placing Order..." : "Confirm & Pay"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsumerMarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading store...</div>}>
      <ConsumerMarketplaceContent />
    </Suspense>
  );
}
