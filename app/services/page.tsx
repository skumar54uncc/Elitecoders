import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "End-to-end surgical coding, claims management, affidavits, and practice support tailored to New York providers.",
};

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Services</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              End-to-end surgical coding, claims management, affidavits, and practice support tailored to New York providers.
            </p>
          </div>
        </div>
      </section>

      {/* Service Blocks */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Surgical & Office Visit Coding */}
            <div className="rounded-lg border-l-4 border-primary bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Surgical & Office Visit Coding
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Our certified professional coders specialize in accurate CPT/ICD/modifier assignment with strict adherence to New York law compliance. We focus on orthopedics, spine, and pain management specialties, ensuring every code is defensible and fully supported by documentation.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong> Fewer denials, correct reimbursements, and documentation that stands up to audits. We understand the nuances of complex surgical procedures and how to code them correctly for maximum revenue capture while maintaining compliance.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
              >
                Discuss this service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Transcription */}
            <div className="rounded-lg border-l-4 border-accent bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Transcription of Operative Reports & Consults
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  We transcribe operative reports and office visit consults, ensuring completeness and clarity that supports accurate coding. Our transcription process captures all critical details needed for proper code assignment and billing.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong> Complete, accurate documentation that reduces coding errors and supports your revenue cycle. We ensure nothing is missed that could impact reimbursement or compliance.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
              >
                Discuss this service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Claims Management */}
            <div className="rounded-lg border-l-4 border-primary bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Claims Management & Appeals
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  From coding to claim submission support, denial tracking, and appeals support. We coordinate closely with your practice billing staff to ensure smooth workflows and timely claim submission.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong> Reduced denial rates, faster claim processing, and expert support when appeals are needed. We track patterns in denials and help address root causes.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
              >
                Discuss this service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Documentation Audits */}
            <div className="rounded-lg border-l-4 border-accent bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Documentation Audits
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Periodic chart reviews identifying missed revenue opportunities and compliance risks. We provide detailed recommendations for improving documentation and revenue capture.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong> Identify under-coding, missed modifiers, and documentation gaps before they become denials. Our audits help practices maximize revenue while maintaining compliance.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
              >
                Discuss this service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Physician Education */}
            <div className="rounded-lg border-l-4 border-primary bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Physician Education
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  1:1 and small-group education for surgeons and providers. We teach how to document procedures and visits so that codes are fully supported and reimbursed.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong> Empower your providers to document correctly from the start, reducing coding errors and denials. Education is tailored to your specialty and practice needs.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
              >
                Discuss this service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Affidavits & Legal Support */}
            <div className="rounded-lg border-l-4 border-accent bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Affidavits & Legal Support
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Preparation of affidavits and rebuttals for No-Fault, Workers&apos; Comp, and arbitration contexts. We have extensive experience in legal documentation that supports claims in dispute.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong> Strong, defensible documentation that supports your position in legal proceedings. Our affidavits are thorough, accurate, and tailored to the specific requirements of each case.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
              >
                Discuss this service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Practice Support */}
            <div className="rounded-lg border-l-4 border-primary bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Practice Support & Workflow Clean-up
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Help offices &quot;get in shape&quot; by improving workflows, templates, and communication between providers and billing staff. We identify bottlenecks and inefficiencies that impact revenue.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong> Streamlined processes, better communication, and reduced administrative burden. We help practices run more efficiently and capture more revenue.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
              >
                Discuss this service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

