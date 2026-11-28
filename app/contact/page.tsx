import type { Metadata } from "next";
import ContactContent from "@/components/contact/contactContent";

export const metadata: Metadata = {
  title: "Contact Us | Architectural Consultation",
  description:
    "Get in touch with Studio Daivikah. Request an architectural consultation, inquire about interior design services, or discuss your upcoming project.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Architectural Consultation | Studio Daivikah",
    description:
      "Get in touch with Studio Daivikah. Request an architectural consultation, inquire about interior design services, or discuss your upcoming project.",
    url: "https://studiodaivikah.com/contact",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Studio Daivikah",
  url: "https://studiodaivikah.com/contact",
  mainEntity: {
    "@type": "ArchitecturalStudio",
    name: "Studio Daivikah",
    telephone: "+91-7550237036",
    email: "studiodavikah@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "36, Surapet main road, Puthagaram",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      postalCode: "600099",
      addressCountry: "IN",
    },
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
      name: "Contact",
      item: "https://studiodaivikah.com/contact",
    },
  ],
};

export default function ContactPage() {
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
      <ContactContent />
    </>
  );
}
