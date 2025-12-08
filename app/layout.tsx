import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitesurgicalcoders.com"),
  title: {
    default: "Elite Surgical Coders | NY Surgical Coding & Billing for Hospitals, Orthopedics & Spine",
    template: "%s | Elite Surgical Coders",
  },
  description: "Elite Surgical Coders and Medical Billing LLC provides compliant surgical coding, claims management, and affidavits for New York hospitals, surgery centers, and specialty practices. Expert CPT/ICD coding, No-Fault billing, Workers' Comp, and legal documentation support.",
  keywords: [
    "surgical coding",
    "medical billing",
    "New York",
    "orthopedics",
    "spine surgery",
    "pain management",
    "affidavits",
    "workers compensation",
    "no-fault",
    "CPT coding",
    "ICD-10 coding",
    "NY hospitals",
    "surgery centers",
    "medical coding services",
    "healthcare billing",
    "revenue cycle management",
    "claim denials",
    "medical documentation",
  ],
  authors: [{ name: "Elite Surgical Coders and Medical Billing LLC" }],
  creator: "Elite Surgical Coders and Medical Billing LLC",
  publisher: "Elite Surgical Coders and Medical Billing LLC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.elitesurgicalcoders.com",
    siteName: "Elite Surgical Coders",
    title: "Elite Surgical Coders | NY Surgical Coding & Billing",
    description: "Compliant surgical coding, claims management, and affidavits for New York hospitals, surgery centers, and specialty practices.",
    images: [
      {
        url: "/logo/Logo.svg",
        width: 1200,
        height: 630,
        alt: "Elite Surgical Coders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Surgical Coders | NY Surgical Coding & Billing",
    description: "Expert surgical coding and medical billing for New York healthcare practices.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <StructuredData type="service" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitesurgicalcoders.com"} />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

