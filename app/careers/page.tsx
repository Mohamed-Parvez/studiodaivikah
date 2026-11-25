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

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CareersContent />
    </>
  );
}
