"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { profile, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Strict Role-Based Dashboard Protection & Access Isolation
  useEffect(() => {
    if (loading || !profile) return;

    const role = profile.accountType;

    if (role === "consumer") {
      const allowed =
        pathname.startsWith("/dashboard/consumer") ||
        pathname === "/dashboard/settings";
      if (!allowed) {
        router.replace("/dashboard/consumer");
      }
    } else if (role === "off-taker") {
      const allowed =
        pathname.startsWith("/dashboard/offtaker") ||
        pathname === "/dashboard/settings";
      if (!allowed) {
        router.replace("/dashboard/offtaker");
      }
    } else if (role === "farmer") {
      const forbidden =
        pathname.startsWith("/dashboard/consumer") ||
        pathname.startsWith("/dashboard/offtaker");
      if (forbidden) {
        router.replace("/dashboard");
      }
    }
  }, [profile, loading, pathname, router]);

  return (
    <div className="min-h-screen bg-[#f5f7f5] flex text-slate-800 antialiased selection:bg-emerald-100">
      {/* Static Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 bg-white shadow-2xl h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Static Top Navbar */}
        <TopNavbar
          onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
