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
    default: "Elite Surgical Coders | NY Surgical Coding & Billing for Orthopedics, Spine & Pain Management",
    template: "%s | Elite Surgical Coders",
  },
  description: "Surgical coding and medical billing for orthopedic doctors, spine doctors, and pain management doctors in New York. Elite Surgical Coders supports NY surgery centers and specialty practices with compliant coding, claims management, and affidavits.",
  keywords: [
    "orthopedic doctors New York",
    "pain management doctors New York",
    "spine doctors New York",
    "orthopedic doctors NY",
    "spine doctors NY",
    "pain management doctors NY",
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
    "NY medical billing",
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
    title: "Elite Surgical Coders | Coding & Billing for Orthopedic, Spine & Pain Doctors in NY",
    description: "Surgical coding and medical billing for orthopedic doctors, spine doctors, and pain management doctors in New York. Compliant coding, claims management, and affidavits.",
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
    title: "Elite Surgical Coders | Orthopedic, Spine & Pain Doctors – New York",
    description: "Surgical coding and billing for orthopedic doctors, spine doctors, and pain management doctors in New York.",
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
  // PWA manifest + icons from RealFaviconGenerator — copy all files from the zip into /public
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Elite Surgical Coders",
    capable: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
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

