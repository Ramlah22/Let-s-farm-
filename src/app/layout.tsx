import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "LetsFarm - Empowering Farmers Through Direct Market Access",
  description:
    "Connecting farmers to the tools, people and resources, aiding them in boosting growth and productivity, with direct access to the larger market.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
