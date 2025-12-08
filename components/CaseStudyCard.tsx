import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CaseStudyCardProps {
  clientType: string;
  problem: string;
  solution: string;
  outcome: string;
  href?: string;
}

export default function CaseStudyCard({
  clientType,
  problem,
  solution,
  outcome,
  href,
}: CaseStudyCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
        {clientType}
      </div>
      <h3 className="mb-4 text-xl font-semibold text-primary">Challenge</h3>
      <p className="mb-4 text-gray-600">{problem}</p>
      <h4 className="mb-2 text-lg font-semibold text-primary">Our Approach</h4>
      <p className="mb-4 text-gray-600">{solution}</p>
      <div className="rounded-md bg-accent/10 p-4">
        <h4 className="mb-2 font-semibold text-primary">Result</h4>
        <p className="text-gray-700">{outcome}</p>
      </div>
      {href && (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

