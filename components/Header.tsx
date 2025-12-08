"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/specialties", label: "Specialties" },
    { href: "/results", label: "Results" },
    { href: "/about", label: "About" },
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Contact" },
  ];

  const phoneNumber = process.env.NEXT_PUBLIC_PHONE || "+1-555-123-4567";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              {/* Logo Image - Using SVG (preferred), with PNG fallback */}
              <div className="relative h-16 w-56 md:h-20 md:w-64">
                <Image
                  src="/logo/Logo.svg"
                  alt="Elite Surgical Coders - NY Surgical Coding & Billing Experts"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-primary transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phoneNumber.replace(/\D/g, "")}`}
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </a>
            <Link
              href="/contact"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-accent-dark"
            >
              Book a Call
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-4 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="h-5 w-5" />
                <span>Call Now</span>
              </a>
              <Link
                href="/contact"
                className="block rounded-md bg-accent px-3 py-2 text-center text-base font-semibold text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book a Call
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

