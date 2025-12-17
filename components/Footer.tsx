import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE || "+1-555-123-4567";
  const email = process.env.NEXT_PUBLIC_EMAIL || "info@elitesurgicalcoders.com";
  const address = process.env.NEXT_PUBLIC_ADDRESS || "80-02 Kew Gardens Road, Kew Gardens, NY 11415";

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-darker text-white border-t-4 border-accent/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="relative h-12 w-48">
                <Image
                  src="/logo/Logo.svg"
                  alt="Elite Surgical Coders"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
            <p className="mb-4 text-sm text-gray-300">
              Supporting New York surgery centers and specialty practices with compliant surgical coding, claims management, and legal affidavits.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{address}</span>
              </div>
              <a
                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                className="flex items-center gap-2 hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/specialties" className="text-gray-300 hover:text-accent transition-colors">
                  Specialties
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-gray-300 hover:text-accent transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-accent transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Disclaimer */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Important Notice</h3>
            <p className="mb-4 text-sm text-gray-300">
              <strong className="text-white">Do not submit patient-identifying information (PHI)</strong> through our web forms. Once we connect, we&apos;ll provide secure methods for exchanging PHI as needed.
            </p>
            <p className="text-xs text-gray-400">
              © {currentYear} Elite Surgical Coders and Medical Billing LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

