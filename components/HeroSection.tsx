"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  showPhoneCTA?: boolean;
}

export default function HeroSection({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  showPhoneCTA = false,
}: HeroSectionProps) {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE || "+1-555-123-4567";

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            {headline}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            {subheadline}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primaryCTA && (
              <Link
                href={primaryCTA.href}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-accent-dark"
              >
                {primaryCTA.text}
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            {secondaryCTA && (
              <Link
                href={secondaryCTA.href}
                className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {secondaryCTA.text}
              </Link>
            )}
            {showPhoneCTA && (
              <a
                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark sm:hidden"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

