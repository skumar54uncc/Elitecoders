import type { Metadata } from "next";
import CaseStudyCard from "@/components/CaseStudyCard";

export const metadata: Metadata = {
  title: "Results & Case Studies",
  description: "See how Elite Surgical Coders has helped New York practices improve revenue, reduce denials, and strengthen legal documentation.",
};

export default function ResultsPage() {
  const caseStudies = [
    {
      clientType: "NY Orthopedic Group",
      problem: "High surgical claim denials (25%+ denial rate) and documentation gaps affecting revenue. Practice was losing significant revenue due to coding errors and incomplete documentation.",
      solution: "Comprehensive coding audit of 500+ cases, workflow improvements, and physician education on documentation requirements. Implemented regular coding reviews and established clear documentation templates.",
      outcome: "Reduced denials by 60% within 6 months. Improved first-pass payment rates from 75% to 92%. Increased monthly revenue by approximately $45,000 through improved coding accuracy and reduced denials.",
    },
    {
      clientType: "Spine Surgery Practice",
      problem: "Complex multi-level procedures leading to coding errors and under-coding. Practice was not capturing full value of complex spine procedures, particularly in Workers&apos; Comp cases.",
      solution: "Specialized coding support for complex spine procedures including multi-level fusions, decompressions, and instrumentation. Regular documentation reviews and coding audits. Education on proper modifier usage.",
      outcome: "Improved accuracy in coding complex procedures by 85%. Increased revenue capture by 30% through proper coding of multi-level procedures. Reduced coding-related denials to less than 5%.",
    },
    {
      clientType: "Pain Management Center",
      problem: "No-Fault and Workers&apos; Comp claims requiring legal affidavits and rebuttals. Practice was struggling with incomplete documentation in arbitration cases, leading to unfavorable outcomes.",
      solution: "Expert affidavit preparation and legal documentation support for 40+ arbitration cases. Comprehensive documentation reviews and rebuttal preparation. Coordination with legal teams to ensure strong case support.",
      outcome: "Stronger legal position in disputes with 90% favorable outcomes in arbitration. Improved claim resolution rates by 50%. Reduced time spent on legal documentation from 20+ hours per case to 5 hours with our support.",
    },
    {
      clientType: "Ambulatory Surgery Center",
      problem: "High-volume surgical coding creating bottlenecks and delays in claim submission. Internal coding staff overwhelmed, leading to coding errors and delayed revenue.",
      solution: "High-volume coding support handling 700+ operative reports per month. Streamlined workflow integration with existing billing systems. Quality assurance processes to ensure accuracy.",
      outcome: "Eliminated coding bottlenecks and reduced claim submission delays by 70%. Maintained 98% coding accuracy rate. Improved cash flow through faster claim processing.",
    },
    {
      clientType: "Multi-Specialty Surgical Group",
      problem: "Inconsistent coding quality across multiple providers and specialties. Lack of standardized processes leading to compliance risks and missed revenue opportunities.",
      solution: "Standardized coding processes across all providers. Regular documentation audits and physician education. Centralized workflow management and quality control.",
      outcome: "Achieved consistent coding quality across all providers. Identified and captured $120,000 in previously missed revenue through comprehensive audits. Reduced compliance risks through standardized processes.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Intro */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">Results & Case Studies</h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              See how we&apos;ve helped New York practices improve revenue, reduce denials, and strengthen legal documentation.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="bg-pattern bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {caseStudies.map((study, index) => (
              <CaseStudyCard
                key={index}
                clientType={study.clientType}
                problem={study.problem}
                solution={study.solution}
                outcome={study.outcome}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

