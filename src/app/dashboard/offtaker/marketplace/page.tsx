"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  CreditCard,
  X,
  Plus,
  Store,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getListings,
  createInquiry,
  createOrder,
  ProduceListing,
} from "@/lib/firestore";

function OfftakerMarketplaceContent() {
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();

  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCropFilter, setSelectedCropFilter] = useState("All");
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);

  // Inquiry form states
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryQuantityMudu, setInquiryQuantityMudu] = useState(500);
  const [offeredPricePerMudu, setOfferedPricePerMudu] = useState(0);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Payment checkout states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getListings();
        setListings(data);

        // Pre-select listing if ID in query params
        const paramId = searchParams.get("selected");
        if (paramId) {
          const found = data.find((l) => l.id === paramId);
          if (found) setSelectedListing(found);
        }

        setLoading(false);
      } catch (e) {
        console.warn("Failed to load listings:", e);
        setLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  const crops = ["All", "Yellow Maize", "Irish Potatoes", "Fresh Cabbage", "Cassava", "Fonio (Acha)", "Soybeans"];

  const filteredListings = listings.filter((l) => {
    const matchesCrop =
      selectedCropFilter === "All" ||
      l.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
    const matchesSearch =
      l.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  const handleOpenInquiry = (listing: ProduceListing) => {
    setSelectedListing(listing);
    setOfferedPricePerMudu(listing.pricePerMudu);
    setInquiryQuantityMudu(Math.min(500, listing.volumeMudu));
    setInquiryMessage(
      `We require ${Math.min(500, listing.volumeMudu)} Mudu of ${listing.crop} delivered in 50kg bags to our Jos facility.`
    );
    setInquirySuccess(false);
    setInquiryModalOpen(true);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;

    setInquirySubmitting(true);
    try {
      await createInquiry({
        farmerId: selectedListing.farmerId,
        listingId: selectedListing.id,
        buyerId: user?.uid || "offtaker_guest",
        buyerName: profile?.companyName || profile?.fullName || "Commercial Buyer Ltd",
        buyerType: "Verified Off-Taker",
        buyerPhone: profile?.phone || "08012345678",
        crop: selectedListing.crop,
        volumeMudu: Number(inquiryQuantityMudu),
        offeredPrice: Number(offeredPricePerMudu),
        message: inquiryMessage,
        deliveryLocation: profile?.location || "Jos North Warehouse, Plateau State",
        status: "pending",
        date: new Date().toISOString(),
      });

      setInquirySubmitting(false);
      setInquirySuccess(true);
      setTimeout(() => {
        setInquiryModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Error submitting inquiry:", err);
      setInquirySubmitting(false);
    }
  };

  const handleDirectPayment = async () => {
    if (!selectedListing) return;
    setPaymentSubmitting(true);

    try {
      // Create real order in Firestore
      await createOrder({
        buyerId: user?.uid || "offtaker_guest",
        buyerName: profile?.companyName || profile?.fullName || "Commercial Buyer Ltd",
        buyerType: "off-taker",
        buyerPhone: profile?.phone || "08012345678",
        sellerId: selectedListing.farmerId,
        sellerName: selectedListing.farmerName,
        farmLocation: selectedListing.location || "Plateau State",
        crop: selectedListing.crop,
        quantity: inquiryQuantityMudu,
        unit: "mudu",
        totalPrice: inquiryQuantityMudu * selectedListing.pricePerMudu,
        stage: selectedListing.stage === "Expected Harvest" ? "pre-harvest" : "post-harvest",
        deliveryLocation: profile?.location || "Jos South Aggregation Depot",
        status: "Payment Completed",
        paymentReference: `LF-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
      });

      setPaymentSubmitting(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentModalOpen(false);
      }, 2200);
    } catch (err) {
      console.error("Payment order error:", err);
      setPaymentSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Produce Discovery Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified regional harvest batches, inspect crop maturity, and establish direct off-take agreements.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, farmer name, or LGA..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropFilter(crop)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCropFilter === crop
                  ? "bg-[#16a34a] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Marketplace Card Grid (Strictly matching PRD Section 3.2) */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200">
          Loading verified marketplace listings...
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
          <Store className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No listings found</h3>
          <p className="text-xs text-slate-500">Try adjusting your filter or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const isReady =
              listing.stage === "Ready Inventory" ||
              listing.inventoryState === "Available";

            return (
              <div
                key={listing.id}
                onClick={() => setSelectedListing(listing)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Visual Header */}
                  <div className="relative h-44 bg-gradient-to-br from-emerald-100 via-[#e2f3e8] to-slate-100 flex items-center justify-center overflow-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-md flex items-center justify-center text-emerald-700 text-2xl font-extrabold group-hover:scale-105 transition-transform">
                      {listing.crop.charAt(0)}
                    </div>
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                          isReady
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {isReady ? "Ready for Pickup" : "Expected Harvest"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body Elements (Card Face: Crop Type + Farmer Location) */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {listing.crop}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{listing.location || "Plateau State"}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {listing.grade}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">On-Hand Volume</span>
                        <span className="font-bold text-slate-800">
                          {listing.volumeMudu} Mudu ({listing.volumeKg} kg)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Price per Mudu</span>
                        <span className="font-extrabold text-emerald-700 text-sm">
                          ₦{listing.pricePerMudu.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="px-5 pb-5 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedListing(listing);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-800 border border-slate-200 group-hover:border-emerald-200 text-xs font-bold transition-all"
                  >
                    <span>View Full Specs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL PRODUCT DETAIL DRAWER / VIEWPORT (Strictly matching PRD Section 3.2) */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Produce Procurement Viewport
                </h3>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Crop Hero */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    {selectedListing.grade}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    {selectedListing.crop}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedListing.location || "Plateau State"}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Price per Mudu
                  </span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    ₦{selectedListing.pricePerMudu.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Farmer Profile Snapshot */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Farmer Profile Snapshot
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      {selectedListing.farmerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {selectedListing.farmerName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {selectedListing.location || "Jos South, Plateau State"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Farmer
                  </span>
                </div>
              </div>

              {/* Harvest Maturity & Date Status */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Harvest Maturity &amp; Availability
                </span>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">
                      {selectedListing.stage || "Ready Inventory"}
                    </span>
                  </div>
                  <span className="font-bold text-slate-600">
                    {selectedListing.expectedHarvestDate ||
                      `Harvested on ${selectedListing.harvestDate || "Recent Batch"}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Available Weight on Hand:</span>
                  <span className="font-extrabold text-slate-900">
                    {selectedListing.volumeKg} kg ({selectedListing.volumeMudu} Mudu)
                  </span>
                </div>
              </div>

              {/* Produce Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Packaging &amp; Farm Notes
                </span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedListing.description ||
                    "Clean, sorted Plateau harvest. Standard packaging in 50kg or 100kg woven polypropylene bags. Protected via LetsFarm Quality Guarantee."}
                </p>
              </div>
            </div>

            {/* Dual Primary Actions: Submit Inquiry & Send Payment */}
            <div className="p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => handleOpenInquiry(selectedListing)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>

              <button
                onClick={() => {
                  setPaymentSuccess(false);
                  setPaymentModalOpen(true);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Send Direct Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Submission Modal */}
      {inquiryModalOpen && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Submit Procurement Inquiry
              </h3>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Inquiry Dispatched!
                </h4>
                <p className="text-xs text-slate-500">
                  Your purchase offer of {inquiryQuantityMudu} Mudu has been sent to {selectedListing.farmerName}. You will be notified when accepted.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Requested Quantity (Mudu)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedListing.volumeMudu}
                    value={inquiryQuantityMudu}
                    onChange={(e) => setInquiryQuantityMudu(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Available on hand: {selectedListing.volumeMudu} Mudu
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Offered Price per Mudu (₦)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={offeredPricePerMudu}
                    onChange={(e) => setOfferedPricePerMudu(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery &amp; Packaging Notes
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Specify delivery destination, warehouse point, or packaging specs..."
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold shadow-sm"
                  >
                    {inquirySubmitting ? "Sending..." : "Send Inquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Direct Payment Checkout Modal */}
      {paymentModalOpen && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Secure Escrow Direct Payment
              </h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Payment Confirmed in Escrow!
                </h4>
                <p className="text-xs text-slate-500">
                  Your funds are secured via LetsFarm Agro-Escrow. An order tracking batch has been added to your Orders and Inventory Ledger.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Produce:</span>
                    <span className="font-bold text-slate-900">{selectedListing.crop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Volume:</span>
                    <span className="font-bold text-slate-900">{inquiryQuantityMudu} Mudu</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Farmer / Supplier:</span>
                    <span className="font-bold text-slate-900">{selectedListing.farmerName}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                    <span className="font-bold text-slate-900">Total Escrow Amount:</span>
                    <span className="font-extrabold text-emerald-700">
                      ₦{(inquiryQuantityMudu * selectedListing.pricePerMudu).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Payment is held securely in escrow until harvest inspection and pickup verification at the farm gate.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDirectPayment}
                    disabled={paymentSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold shadow-sm"
                  >
                    {paymentSubmitting ? "Processing..." : "Confirm & Pay"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OfftakerMarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading marketplace...</div>}>
      <OfftakerMarketplaceContent />
    </Suspense>
  );
}
