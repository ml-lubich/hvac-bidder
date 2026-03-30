import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HVAC BidPro — Generate Professional HVAC Bids in 60 Seconds",
    template: "%s | HVAC BidPro",
  },
  description:
    "Stop wasting hours on manual bids. HVAC BidPro uses AI to generate accurate, professional estimates in under a minute. Built for HVAC contractors who want to win more jobs.",
  keywords: [
    "HVAC bidding software",
    "HVAC estimate generator",
    "contractor bidding tool",
    "HVAC proposal software",
    "heating and cooling estimates",
    "HVAC contractor tools",
    "air conditioning bid",
    "furnace estimate",
    "HVAC job costing",
  ],
  openGraph: {
    title: "HVAC BidPro — Generate Professional HVAC Bids in 60 Seconds",
    description:
      "Stop wasting hours on manual bids. AI-powered estimates for HVAC contractors.",
    type: "website",
    siteName: "HVAC BidPro",
  },
  twitter: {
    card: "summary_large_image",
    title: "HVAC BidPro — AI-Powered Bid Generation",
    description:
      "Generate accurate HVAC bids in 60 seconds. Built for contractors.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
