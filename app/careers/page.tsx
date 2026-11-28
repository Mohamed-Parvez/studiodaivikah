import type { Metadata } from "next";
import CareersContent from "@/components/careers/careersContent";

export const metadata: Metadata = {
  title: "Careers | Studio Daivikah",
  description:
    "Join Studio Daivikah. Explore career opportunities, internships, and job openings in architecture, interior design, 3D visualization, and sustainable spatial design.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers | Studio Daivikah",
    description:
      "Join Studio Daivikah. Explore career opportunities, internships, and job openings in architecture, interior design, 3D visualization, and sustainable spatial design.",
    url: "https://studiodaivikah.com/careers",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Studio Daivikah Careers",
  url: "https://studiodaivikah.com/careers",
  description:
    "Career opportunities, internships, and job vacancies at Studio Daivikah.",
  publisher: {
    "@type": "ArchitecturalStudio",
    name: "Studio Daivikah",
    url: "https://studiodaivikah.com",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://studiodaivikah.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Careers",
      item: "https://studiodaivikah.com/careers",
    },
  ],
};

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CareersContent />
    </>
  );
}
