// Structured Data for SEO (JSON-LD)

interface BlogData {
  title: string;
  excerpt?: string;
  image?: string;
  date: string;
  author?: string;
}

interface StructuredDataProps {
  type: "organization" | "website" | "service" | "blog";
  data?: BlogData;
}

type StructuredDataType = 
  | {
      "@context": string;
      "@type": "Organization" | "WebSite" | "Service" | "BlogPosting";
      [key: string]: unknown;
    }
  | Record<string, never>;

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.elitesurgicalcoders.com";

  let structuredData: StructuredDataType = {};

  switch (type) {
    case "organization":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Elite Surgical Coders and Medical Billing LLC",
        url: baseUrl,
        logo: `${baseUrl}/logo/Logo.svg`,
        description:
          "NY-based surgical coding and medical billing company specializing in orthopedics, spine surgery, and pain management for surgery centers and specialty practices.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "New York",
          addressRegion: "NY",
          addressCountry: "US",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: process.env.NEXT_PUBLIC_PHONE || "+1-555-123-4567",
          contactType: "Customer Service",
          email: process.env.NEXT_PUBLIC_EMAIL || "info@elitesurgicalcoders.com",
        },
        sameAs: [
          // Add social media links here when available
        ],
      };
      break;

    case "website":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Elite Surgical Coders",
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/resources?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      };
      break;

    case "service":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Surgical Coding and Medical Billing",
        provider: {
          "@type": "Organization",
          name: "Elite Surgical Coders and Medical Billing LLC",
        },
        areaServed: {
          "@type": "State",
          name: "New York",
        },
        description:
          "Compliant surgical coding, claims management, and affidavits for New York surgery centers and specialty practices.",
      };
      break;

    case "blog":
      if (data) {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: data.title,
          description: data.excerpt,
          image: data.image ? `${baseUrl}${data.image}` : undefined,
          datePublished: data.date,
          author: {
            "@type": "Organization",
            name: data.author || "Elite Surgical Coders",
          },
          publisher: {
            "@type": "Organization",
            name: "Elite Surgical Coders and Medical Billing LLC",
            logo: {
              "@type": "ImageObject",
              url: `${baseUrl}/logo/Logo.svg`,
            },
          },
        };
      }
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

