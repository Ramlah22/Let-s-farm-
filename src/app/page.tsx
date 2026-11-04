"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueProposition from "@/components/ValueProposition";
import Marketplace from "@/components/Marketplace";
import DiseaseDetection from "@/components/DiseaseDetection";
import UssdSection from "@/components/UssdSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import ActionModal, { ModalType } from "@/components/ActionModal";

export default function Home() {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleOpenAuth = (mode: "signin" | "getstarted") => {
    setModalType(mode);
    setSelectedItem(null);
  };

  const handleMarketplaceAction = (item: any) => {
    if (item.buttonText.includes("Pre-Offer")) {
      setModalType("pre-offer");
    } else if (item.buttonText.includes("Dispatch")) {
      setModalType("dispatch");
    } else {
      setModalType("inspection");
    }
    setSelectedItem(item);
  };

  const handleScanCrops = () => {
    const el = document.getElementById("detect-diseases");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRegisterFarmer = () => {
    setModalType("farmer-reg");
    setSelectedItem(null);
  };

  const handlePartnerOfftaker = () => {
    setModalType("offtaker-partner");
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* Main Page Flow Matching PDF */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero onScanCropsClick={handleScanCrops} />

        {/* 3. Built for Nigeria's Agricultural Reality */}
        <ValueProposition />

        {/* 4. Direct Marketplace */}
        <Marketplace onActionClick={handleMarketplaceAction} />

        {/* 5. Detect Diseases and Improve Farm Health Early */}
        <DiseaseDetection />

        {/* 6. No Smartphone? No Problem. Direct USSD & SMS Access */}
        <UssdSection />

        {/* 7. Ready to Transform Your Farming CTA Banner */}
        <CtaBanner
          onRegisterFarmer={handleRegisterFarmer}
          onPartnerOfftaker={handlePartnerOfftaker}
        />
      </main>

      {/* 8. Polished Modern Footer */}
      <Footer />

      {/* Interactive Action Modals for Demo / Presentations */}
      <ActionModal
        type={modalType}
        itemData={selectedItem}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
