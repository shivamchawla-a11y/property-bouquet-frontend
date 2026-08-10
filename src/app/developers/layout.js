import Script from "next/script";

const SITE_URL = "https://propertybouquet.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "Luxury Real Estate Developers in India | Property Bouquet",
    template:
      "%s | Property Bouquet",
  },

  description:
    "Explore India's leading real estate developers and discover premium residential projects, luxury homes, apartments and plots from trusted developers with Property Bouquet.",

  keywords: [
    "real estate developers in India",
    "top real estate developers in India",
    "luxury real estate developers",
    "property developers in India",
    "real estate companies in India",
    "luxury property developers",
    "residential property developers",
    "real estate developers Gurgaon",
    "property developers Gurgaon",
    "luxury developers Gurgaon",
    "real estate developers Delhi NCR",
    "Property Bouquet developers",
  ],

  alternates: {
    canonical: "/developers",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/developers`,
    siteName: "Property Bouquet",

    title:
      "Luxury Real Estate Developers in India | Property Bouquet",

    description:
      "Explore leading real estate developers and discover premium residential projects, luxury homes, apartments and plots from trusted developers on Property Bouquet.",

    images: [
      {
        url: `${SITE_URL}/developers/og-image.jpg`,
        width: 1200,
        height: 630,
        alt:
          "Luxury Real Estate Developers - Property Bouquet",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Luxury Real Estate Developers in India | Property Bouquet",

    description:
      "Discover leading real estate developers and premium property projects across India with Property Bouquet.",

    images: [
      `${SITE_URL}/developers/og-image.jpg`,
    ],
  },

  category: "Real Estate",

  applicationName: "Property Bouquet",

  creator: "Property Bouquet",
  publisher: "Property Bouquet",
};

export default function DevelopersLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",

    "@id": `${SITE_URL}/#organization`,

    name: "Property Bouquet",

    url: SITE_URL,

    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.webp`,
    },

    description:
      "Property Bouquet is a luxury real estate platform helping buyers and investors discover premium residential properties, projects and trusted developers.",

    sameAs: [
      // Add your official social URLs here when available.
      // "https://www.instagram.com/...",
      // "https://www.facebook.com/...",
      // "https://www.linkedin.com/company/...",
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    "@id": `${SITE_URL}/developers#webpage`,

    url: `${SITE_URL}/developers`,

    name:
      "Luxury Real Estate Developers in India | Property Bouquet",

    headline:
      "Luxury Real Estate Developers in India",

    description:
      "Explore India's leading real estate developers and discover premium residential projects, luxury homes, apartments and plots from trusted developers with Property Bouquet.",

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Property Bouquet",
      url: SITE_URL,
    },

    about: {
      "@type": "Thing",
      name: "Real Estate Developers",
    },

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },

    inLanguage: "en-IN",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Developers",
        item: `${SITE_URL}/developers`,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",

    "@id": `${SITE_URL}/#website`,

    url: SITE_URL,

    name: "Property Bouquet",

    description:
      "Luxury real estate discovery platform for premium properties, projects and trusted developers.",

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },

    inLanguage: "en-IN",
  };

  return (
    <>
      <Script
        id="developers-organization-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(organizationSchema)}
      </Script>

      <Script
        id="developers-website-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(websiteSchema)}
      </Script>

      <Script
        id="developers-webpage-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(webPageSchema)}
      </Script>

      <Script
        id="developers-breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      {children}
    </>
  );
}