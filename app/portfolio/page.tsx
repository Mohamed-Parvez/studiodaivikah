import type { Metadata } from "next";
import PortfolioContent from "@/components/portfolio/portfolioContent";

export const metadata: Metadata = {
  title: "Architecture & Design Portfolio",
  description:
    "Explore Studio Daivikah's portfolio of architectural, interior design, 3D visualization, and sustainable construction projects.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Architecture & Design Portfolio | Studio Daivikah",
    description:
      "Explore Studio Daivikah's portfolio of architectural, interior design, 3D visualization, and sustainable construction projects.",
    url: "https://studiodaivikah.com/portfolio",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Studio Daivikah Portfolio",
  url: "https://studiodaivikah.com/portfolio",
  description: "A showcase of architectural, interior design, and 3D modeling projects by Studio Daivikah.",
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
      name: "Portfolio",
      item: "https://studiodaivikah.com/portfolio",
    },
  ],
};

export default function PortfolioPage() {
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
      <PortfolioContent />
    </>
  );
}
