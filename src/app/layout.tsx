import type { Metadata } from "next";
import { Outfit, Delius } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiBot from "@/components/AiBot";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const delius = Delius({
  weight: "400",
  variable: "--font-delius",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLASS | Premium Plant Boutique",
  description: "Elegant indoor plants and care tracking for your premium space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${delius.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-deep text-txt-white overflow-x-hidden">
        <AppProvider>
          <Navbar />
          <main className="flex-grow pt-24 pb-12">
            {children}
          </main>
          <Footer />
          <AiBot />
        </AppProvider>
      </body>
    </html>
  );
}
