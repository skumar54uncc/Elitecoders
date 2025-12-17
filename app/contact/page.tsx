import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import GoogleMap from "@/components/GoogleMap";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Elite Surgical Coders. We respond within 1 business day. Do not submit PHI via web forms.",
};

export default function ContactPage() {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE || "+1-555-123-4567";
  const email = process.env.NEXT_PUBLIC_EMAIL || "info@elitesurgicalcoders.com";
  const address = process.env.NEXT_PUBLIC_ADDRESS || "New York, NY 11415";

  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Contact Us</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              We respond within 1 business day. Please note: <strong className="text-white">Do not submit patient-identifying information (PHI) via web forms.</strong> Once we connect, we&apos;ll provide secure methods for exchanging PHI as needed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Details */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-primary">Send us a message</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-semibold text-primary">Get in touch</h2>
              <div className="mt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Phone</h3>
                    <a
                      href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                      className="mt-1 text-gray-600 hover:text-accent"
                    >
                      {phoneNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Email</h3>
                    <a
                      href={`mailto:${email}`}
                      className="mt-1 text-gray-600 hover:text-accent"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Location</h3>
                    <p className="mt-1 text-gray-600">{address}</p>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="mt-8">
                <h3 className="mb-4 font-semibold text-primary">Find Us</h3>
                <GoogleMap address={address} height="384px" />
                <p className="mt-4 text-sm text-gray-600">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-dark underline"
                  >
                    Open in Google Maps
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

