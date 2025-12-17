import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Elite Surgical Coders and Medical Billing LLC, a NYC-based coding and billing company supporting surgical practices since 2019.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              About Elite Surgical Coders
            </h1>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold text-primary">Our Story</h2>
            <div className="mt-6 space-y-4 text-gray-600">
              <p>
                Elite Surgical Coders and Medical Billing LLC is a NYC-based coding and billing company founded to support surgical practices facing complex New York laws and high denial rates.
              </p>
              <p>
                Since 2019, we&apos;ve been helping surgery centers and specialty practices navigate the complexities of surgical coding, claims management, and legal documentation. With over 20 years of combined experience in coding and billing, our team understands the unique challenges facing New York providers.
              </p>
              <p>
                We started because we saw too many practices struggling with denials, documentation gaps, and legal challenges that could be prevented with the right expertise. Our mission is to turn complex operative notes and consults into clean, compliant, defensible revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold text-white">Our Team</h2>
            <div className="mt-6 space-y-4 text-gray-200">
              <p>
                We are a small, elite team of certified professional coders and billing specialists. Each member brings deep expertise in surgical coding, with particular strength in orthopedics, spine surgery, and pain management.
              </p>
              <p>
                Our team members are certified by recognized coding organizations and have extensive experience with New York-specific regulations, including No-Fault, Workers&apos; Compensation, and commercial payer requirements.
              </p>
              <p className="text-sm italic text-gray-300">
                Individual team member profiles will be added here in the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-semibold text-primary">Our Values</h2>
            <div className="mt-8 space-y-6">
              <div className="rounded-lg border-l-4 border-primary bg-white p-6 shadow-md">
                <h3 className="text-xl font-semibold text-primary">Accuracy and Compliance</h3>
                <p className="mt-2 text-gray-600">
                  We prioritize accuracy in every code assignment and ensure full compliance with regulations. Our work stands up to audits and legal scrutiny.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-accent bg-white p-6 shadow-md">
                <h3 className="text-xl font-semibold text-primary">Responsiveness to Clients</h3>
                <p className="mt-2 text-gray-600">
                  We understand that timely coding and billing support is critical to your revenue cycle. We respond quickly to your needs and maintain clear communication.
                </p>
              </div>
              <div className="rounded-lg border-l-4 border-primary bg-white p-6 shadow-md">
                <h3 className="text-xl font-semibold text-primary">Partnership Mindset</h3>
                <p className="mt-2 text-gray-600">
                  We work as an extension of your team, not just a vendor. We take ownership of outcomes and are invested in your success. Our goal is to help you focus on patient care while we handle the complexities of coding and billing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

