import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  href?: string;
  icon?: React.ReactNode;
}

export default function ServiceCard({
  title,
  description,
  href = "/contact",
  icon,
}: ServiceCardProps) {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {icon && <div className="mb-4 text-accent">{icon}</div>}
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <p className="mt-3 text-gray-600">{description}</p>
      {href && (
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-dark"
        >
          Learn more
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

