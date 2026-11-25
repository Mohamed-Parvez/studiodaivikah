import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://studiodaivikah.com"),
  title: {
    default: "Studio Daivikah | Architecture & Interior Design Firm | Chennai",
    template: "%s | Studio Daivikah",
  },
  description:
    "Studio Daivikah | Architecture & Interior Design Firm | Chennai",
  keywords: [
    "Studio Daivikah",
    "Architectural Design",
    "Interior Design",
    "3D Visualization",
    "3D Modeling",
    "Urban Planning",
    "Project Management",
    "Sustainable Architecture",
    "Chennai Architect",
    "Architecture Studio India",
    "Turnkey Construction",
    "Residential Architecture",
    "Commercial Design",
  ],
  authors: [{ name: "Studio Daivikah", url: "https://studiodaivikah.com" }],
  creator: "Studio Daivikah",
  publisher: "Studio Daivikah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Studio Daivikah | Architecture & Interior Design Firm | Chennai",
    description:
      "Concept to Creation — Studio Daivikah delivers innovative architectural, interior, and 3D visualization design services.",
    url: "https://studiodaivikah.com",
    siteName: "Studio Daivikah",
    images: [
      {
        url: "https://studiodaivikah.com/images/og-share.png",
        width: 1200,
        height: 630,
        alt: "Studio Daivikah Architecture Logo Preview",
        type: "image/png",
      },
      {
        url: "https://studiodaivikah.com/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Studio Daivikah Logo Preview",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Daivikah | Architecture & Interior Design Firm | Chennai",
    description:
      "Concept to Creation — Studio Daivikah delivers innovative architectural, interior, and 3D visualization design services.",
    images: ["https://studiodaivikah.com/images/og-share.png"],
  },
  other: {
    "og:image": "https://studiodaivikah.com/images/og-share.png",
    "og:image:secure_url": "https://studiodaivikah.com/images/og-share.png",
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://studiodaivikah.com/#website",
      url: "https://studiodaivikah.com",
      name: "Studio Daivikah",
      alternateName: [
        "Studio Daivikah Architecture",
        "SDH",
        "Studio Daivikah Chennai",
      ],
      description:
        "Studio Daivikah | Architecture & Interior Design Firm | Chennai",
      publisher: {
        "@id": "https://studiodaivikah.com/#organization",
      },
    },
    {
      "@type": "ArchitecturalStudio",
      "@id": "https://studiodaivikah.com/#organization",
      name: "Studio Daivikah",
      url: "https://studiodaivikah.com",
      logo: {
        "@type": "ImageObject",
        url: "https://studiodaivikah.com/images/logo.png",
      },
      image: "https://studiodaivikah.com/images/preview.png",
      description:
        "Studio Daivikah is an architectural and interior design practice dedicated to creating timeless, functional, and inspiring spaces.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "36, Surapet main road, Puthagaram",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        postalCode: "600099",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-7550237036",
        contactType: "customer service",
        email: "studiodavikah@gmail.com",
      },
      sameAs: [
        "https://www.linkedin.com/company/studio-daivikah/",
        "https://www.instagram.com/studio.daivikah",
        "https://www.facebook.com/share/15spjwC4w9/",
        "https://www.youtube.com/@StudioDaivikah",
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://studiodaivikah.com/#sitenavigation",
      name: "Primary Navigation",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "About Us",
          description:
            "Learn about Studio Daivikah's architectural design philosophy, vision, and team.",
          url: "https://studiodaivikah.com/about",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Services",
          description:
            "Architectural design, interior architecture, 3D visualization, and turnkey project management.",
          url: "https://studiodaivikah.com/services",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Portfolio",
          description:
            "Explore curated residential, commercial, and interior architecture projects.",
          url: "https://studiodaivikah.com/portfolio",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Careers",
          description:
            "Explore career opportunities, internships, and job vacancies at Studio Daivikah.",
          url: "https://studiodaivikah.com/careers",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "Blog",
          description:
            "Read the latest architectural insights, design trends, and project stories.",
          url: "https://studiodaivikah.com/blog",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Contact",
          description:
            "Get in touch with Studio Daivikah to request an architectural consultation or inquire about services.",
          url: "https://studiodaivikah.com/contact",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/images/herobg.webp" type="image/webp" fetchPriority="high" />
        <meta property="og:image" content="https://studiodaivikah.com/images/og-share.png" />
        <meta property="og:image:secure_url" content="https://studiodaivikah.com/images/og-share.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jost.className} min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-white`}>
        <main className="w-full flex flex-col items-center">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
