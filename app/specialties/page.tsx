import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who We Serve",
  description: "Elite Surgical Coders serves New York hospitals, surgery centers, specialty practices, and legal teams with expert coding and billing support.",
};

export default function SpecialtiesPage() {
  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Who We Serve</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              We focus on New York practices, hospitals, surgery centers, and legal teams who need expert surgical coding, billing support, and legal documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Service Segments */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Hospitals & Surgery Centers */}
            <div className="rounded-lg border-l-4 border-primary bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Hospitals & Surgery Centers
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  We support hospitals and ambulatory surgery centers (ASCs) with high-volume surgical coding, complex operative notes, and coordination with internal billing teams. Our expertise in orthopedics, spine, and pain management procedures helps ensure accurate coding and maximum revenue capture.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong>
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>High-volume coding support for busy surgical schedules</li>
                  <li>Expert handling of complex multi-level procedures</li>
                  <li>Seamless coordination with your internal billing department</li>
                  <li>Reduced coding errors and denials</li>
                  <li>Compliance with NY-specific regulations</li>
                </ul>
              </div>
            </div>

            {/* Orthopedic, Spine & Pain Practices */}
            <div className="rounded-lg border-l-4 border-accent bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Orthopedic, Spine & Pain Practices
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  Our deep understanding of complex procedural coding, frequent injections, multi-level surgeries, and documentation challenges makes us the ideal partner for specialty practices. We know the nuances of coding for orthopedics, spine surgery, and pain management procedures.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong>
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Specialized expertise in orthopedics, spine, and pain management</li>
                  <li>Accurate coding for complex procedures and injections</li>
                  <li>Understanding of multi-level surgery coding requirements</li>
                  <li>Documentation support that reduces denials</li>
                  <li>Affidavit support for No-Fault and Workers&apos; Comp cases</li>
                </ul>
              </div>
            </div>

            {/* Multi-Specialty Groups */}
            <div className="rounded-lg border-l-4 border-primary bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Multi-Specialty Groups
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  We provide flexibility and process standardization across multiple providers and specialties. Our scalable approach ensures consistent coding quality and compliance regardless of the number of providers or specialties in your group.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong>
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Standardized coding processes across all providers</li>
                  <li>Flexible support for multiple specialties</li>
                  <li>Consistent quality and compliance</li>
                  <li>Scalable solutions that grow with your practice</li>
                  <li>Centralized workflow management</li>
                </ul>
              </div>
            </div>

            {/* Law Firms / Legal Teams */}
            <div className="rounded-lg border-l-4 border-accent bg-white p-8 shadow-md">
              <h2 className="text-3xl font-semibold text-primary">
                Law Firms / Legal Teams
              </h2>
              <div className="mt-6 space-y-4 text-gray-600">
                <p>
                  We provide specific support for affidavits, rebuttals, and documentation for arbitration and litigation contexts. Our expertise in medical coding and billing documentation helps legal teams build strong cases for their clients.
                </p>
                <p>
                  <strong className="text-primary">Benefits:</strong>
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>Expert affidavit preparation for No-Fault and Workers&apos; Comp cases</li>
                  <li>Thorough rebuttals that support your legal position</li>
                  <li>Clear, defensible documentation for arbitration and litigation</li>
                  <li>Understanding of medical coding standards and regulations</li>
                  <li>Timely delivery to meet legal deadlines</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

