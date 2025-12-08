import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  headline: string;
  description?: string;
  ctaText: string;
  ctaHref: string;
  variant?: "primary" | "secondary";
}

export default function CTASection({
  headline,
  description,
  ctaText,
  ctaHref,
  variant = "primary",
}: CTASectionProps) {
  const bgClass = variant === "primary" ? "bg-primary" : "bg-gray-50";
  const textClass = variant === "primary" ? "text-white" : "text-primary";

  return (
    <section className={`${bgClass} py-16 sm:py-24`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={`text-3xl font-bold sm:text-4xl ${textClass}`}>
            {headline}
          </h2>
          {description && (
            <p className={`mt-4 text-lg ${variant === "primary" ? "text-gray-200" : "text-gray-600"}`}>
              {description}
            </p>
          )}
          <div className="mt-8">
            <Link
              href={ctaHref}
              className={`inline-flex items-center gap-2 rounded-md ${
                variant === "primary"
                  ? "bg-accent text-primary hover:bg-accent-dark"
                  : "bg-primary text-white hover:bg-primary-dark"
              } px-6 py-3 text-base font-semibold transition-colors`}
            >
              {ctaText}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

