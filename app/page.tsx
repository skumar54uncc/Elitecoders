import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import ServiceCard from "@/components/ServiceCard";
import CaseStudyCard from "@/components/CaseStudyCard";
import CTASection from "@/components/CTASection";
import Link from "next/link";
import { FileText, ClipboardCheck, TrendingUp, Scale, Users, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "NY-Based Surgical Coding & Billing for Orthopedics, Spine & Pain Practices",
  description: "Elite Surgical Coders and Medical Billing LLC supports New York hospitals, surgery centers, and specialty practices with compliant surgical coding, claims management, and legal affidavits. Expert CPT/ICD coding, No-Fault billing, Workers' Comp support, and legal documentation. Reduce denials and improve revenue capture.",
  keywords: [
    "surgical coding New York",
    "medical billing NY",
    "orthopedic coding",
    "spine surgery billing",
    "pain management coding",
    "NY hospitals billing",
    "surgery center coding",
    "CPT coding services",
    "ICD-10 coding",
    "No-Fault billing",
    "Workers Compensation coding",
    "medical coding experts",
    "revenue cycle management",
    "claim denials reduction",
  ],
  openGraph: {
    title: "NY-Based Surgical Coding & Billing for Orthopedics, Spine & Pain Practices",
    description: "Expert surgical coding and medical billing for New York healthcare practices. Reduce denials and improve revenue.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection
        headline="NY-Based Surgical Coding & Billing for Orthopedics, Spine & Pain Practices"
        subheadline="Elite Surgical Coders and Medical Billing LLC supports New York hospitals, surgery centers, and specialty practices with compliant surgical coding, claims management, and legal affidavits — so your team can focus on patient care."
        primaryCTA={{ text: "Book a 15-Minute Call", href: "/contact" }}
        secondaryCTA={{ text: "Request a Free Coding & Claims Review", href: "/contact" }}
        showPhoneCTA={true}
      />

      <StatsSection />

      {/* Problems We Solve */}
      <section className="bg-pattern-primary bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              Problems We Solve
            </h2>
            <div className="mt-8 space-y-4 text-left">
              <div className="rounded-lg border-l-4 border-primary bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary">High surgical claim denials</h3>
                <p className="mt-2 text-gray-600">
                  Complex procedures and documentation requirements lead to costly denials and delays.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-accent bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary">Confusing NY Workers&apos; Comp & No-Fault rules</h3>
                <p className="mt-2 text-gray-600">
                  Navigating New York&apos;s specific regulations requires deep local expertise.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-primary bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary">Surgeons spending time correcting documentation</h3>
                <p className="mt-2 text-gray-600">
                  Instead of operating, your team is fixing coding and documentation issues.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-accent bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-primary">Gaps in affidavits and rebuttals</h3>
                <p className="mt-2 text-gray-600">
                  When claims go legal, incomplete documentation weakens your position.
                </p>
              </div>
            </div>
            <p className="mt-8 rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-white">
              We turn complex operative notes and consults into clean, compliant, defensible revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive support for your coding, billing, and legal needs
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard
              title="Surgical & Office Visit Coding"
              description="CPT/ICD/modifier assignment with NY law compliance. Fewer denials, correct reimbursements, documentation that stands up to audits."
              href="/services"
              icon={<FileText className="h-8 w-8" />}
            />
            <ServiceCard
              title="Transcription of Operative Reports & Consults"
              description="Complete transcription ensuring clarity and completeness that supports accurate coding and billing."
              href="/services"
              icon={<ClipboardCheck className="h-8 w-8" />}
            />
            <ServiceCard
              title="Claims Management & Appeals"
              description="From coding to claim submission, denial tracking, and appeals support. Coordination with your billing staff."
              href="/services"
              icon={<TrendingUp className="h-8 w-8" />}
            />
            <ServiceCard
              title="Documentation Audits & Physician Education"
              description="Periodic chart reviews identifying missed revenue and compliance risks. Recommendations for improvement."
              href="/services"
              icon={<Briefcase className="h-8 w-8" />}
            />
            <ServiceCard
              title="Affidavits & Legal Support"
              description="Preparation of affidavits and rebuttals for No-Fault, Workers&apos; Comp, and arbitration contexts."
              href="/services"
              icon={<Scale className="h-8 w-8" />}
            />
            <ServiceCard
              title="Practice Support & Workflow Clean-up"
              description="Help offices improve workflows, templates, and communication between providers and billing staff."
              href="/services"
              icon={<Users className="h-8 w-8" />}
            />
          </div>
        </div>
      </section>

      {/* Specialties & Payers */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Specialties & Payers
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              Specialized expertise for New York practices
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-primary">Specialties</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">•</span> Orthopedics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">•</span> Spine surgery
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">•</span> Pain management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">•</span> Other surgical subspecialties
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-primary">Payers & Programs</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">•</span> NYS No-Fault
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">•</span> Workers&apos; Compensation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent font-bold">•</span> Commercial insurances
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Simple, streamlined process</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border-2 border-primary/20 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mt-6 text-xl font-semibold text-primary">
                Send your operative notes and consults
              </h3>
              <p className="mt-2 text-gray-600">
                Via secure upload (details to be configured later)
              </p>
            </div>
            <div className="rounded-lg border-2 border-accent/30 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="mt-6 text-xl font-semibold text-primary">
                We transcribe, code, and audit
              </h3>
              <p className="mt-2 text-gray-600">
                Certified coders apply compliant codes, modifiers, and documentation checks
              </p>
            </div>
            <div className="rounded-lg border-2 border-primary/20 bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mt-6 text-xl font-semibold text-primary">
                You get clean claims and legal backup
              </h3>
              <p className="mt-2 text-gray-600">
                Ready-to-submit claims plus affidavits/rebuttals when needed
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              See if this fits your practice
            </Link>
          </div>
        </div>
      </section>

      {/* Results / Mini Case Snippets */}
      <section className="bg-pattern-primary bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">Results</h2>
            <p className="mt-4 text-lg text-gray-600">Real outcomes for New York practices</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <CaseStudyCard
              clientType="NY Orthopedic Group"
              problem="High surgical claim denials and documentation gaps affecting revenue"
              solution="Comprehensive coding audit, workflow improvements, and physician education on documentation requirements"
              outcome="Significantly reduced denials and improved first-pass payment rates within 6 months"
            />
            <CaseStudyCard
              clientType="Spine Surgery Practice"
              problem="Complex multi-level procedures leading to coding errors and under-coding"
              solution="Specialized coding support for complex spine procedures and regular documentation reviews"
              outcome="Improved accuracy in coding complex procedures and increased revenue capture"
            />
            <CaseStudyCard
              clientType="Pain Management Center"
              problem="No-Fault and Workers&apos; Comp claims requiring legal affidavits and rebuttals"
              solution="Expert affidavit preparation and legal documentation support for arbitration cases"
              outcome="Stronger legal position in disputes and improved claim resolution rates"
            />
          </div>
        </div>
      </section>

      {/* Trust & Compliance */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Trust & Compliance
            </h2>
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-start gap-4 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                    <span className="text-lg font-bold text-primary">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Certified Professional Coders
                  </h3>
                  <p className="mt-1 text-gray-200">
                    Deep NY experience with understanding of local LCDs, No-Fault, Workers&apos; Comp, and commercial payer rules.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                    <span className="text-lg font-bold text-primary">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">HIPAA-Conscious Processes</h3>
                  <p className="mt-1 text-gray-200">
                    Strict PHI handling and secure processes. We do not allow PHI submission through website forms.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                    <span className="text-lg font-bold text-primary">✓</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Professional Partnership</h3>
                  <p className="mt-1 text-gray-200">
                    We work as an extension of your team, ensuring accuracy, compliance, and responsiveness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        headline="Want to see if we can improve your revenue and reduce denials?"
        ctaText="Request a Free Review"
        ctaHref="/contact"
        variant="primary"
      />

      {/* Spacer to separate from footer */}
      <div className="h-8 bg-gradient-to-b from-primary to-primary-dark"></div>
    </>
  );
}

