import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Elite Surgical Coders team. We are a specialized small team of certified professional coders.",
};

export default function CareersPage() {
  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Careers</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              We are a specialized small team of certified professional coders and billing specialists.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border-2 border-primary bg-white p-8 text-center shadow-lg">
            <h2 className="text-2xl font-semibold text-primary">Open Positions</h2>
            <p className="mt-4 text-gray-600">
              No open positions at this time. We are a small, specialized team, but we&apos;re always interested in connecting with talented certified professional coders who share our commitment to accuracy and excellence.
            </p>
            <p className="mt-4 text-gray-600">
              If you&apos;re a certified coder with experience in surgical coding, particularly in orthopedics, spine, or pain management, and you&apos;re interested in future opportunities, please{" "}
              <Link href="/contact" className="font-medium text-accent hover:text-accent-dark">
                reach out
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

