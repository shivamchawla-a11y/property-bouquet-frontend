import Script from "next/script";

const SITE_URL = "https://propertybouquet.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    absolute: "About Property Bouquet | Luxury Real Estate Platform",
  },

  description:
    "Discover Property Bouquet, a luxury real estate platform connecting buyers with curated properties, trusted developers and exceptional locations across Gurgaon and India's leading real estate destinations.",

  keywords: [
    "Property Bouquet",
    "About Property Bouquet",
    "luxury real estate Gurgaon",
    "luxury properties Gurgaon",
    "Gurgaon real estate",
    "Gurugram real estate",
    "luxury homes Gurgaon",
    "premium properties Gurgaon",
    "real estate developers Gurgaon",
    "property advisory Gurgaon",
    "Gurgaon property platform",
    "luxury property platform India",
  ],

  alternates: {
    canonical: "/about",
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

    url: `${SITE_URL}/about`,

    siteName: "Property Bouquet",

    title:
      "About Property Bouquet | Luxury Real Estate Platform",

    description:
      "Discover Property Bouquet's philosophy, expertise and approach to curated luxury real estate, trusted developers and exceptional property destinations.",

    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Property Bouquet — Luxury Real Estate",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "About Property Bouquet | Luxury Real Estate Platform",

    description:
      "Discover Property Bouquet's approach to curated luxury real estate, trusted developers and exceptional property destinations.",

    images: [`${SITE_URL}/og-image.jpg`],
  },

  category: "Real Estate",
};

const aboutPageSchema = {
  "@context": "https://schema.org",

  "@graph": [
    {
      "@type": "WebPage",

      "@id": `${SITE_URL}/about#webpage`,

      url: `${SITE_URL}/about`,

      name:
        "About Property Bouquet | Luxury Real Estate Platform",

      description:
        "Discover Property Bouquet, a luxury real estate platform connecting buyers with curated properties, trusted developers and exceptional locations across Gurgaon and India's leading real estate destinations.",

      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },

      about: {
        "@type": "Organization",

        "@id": `${SITE_URL}/#organization`,
      },

      breadcrumb: {
        "@id": `${SITE_URL}/about#breadcrumb`,
      },

      inLanguage: "en-IN",

      primaryImageOfPage: {
        "@type": "ImageObject",

        url: `${SITE_URL}/og-image.jpg`,
      },
    },

    {
      "@type": "BreadcrumbList",

      "@id": `${SITE_URL}/about#breadcrumb`,

      itemListElement: [
        {
          "@type": "ListItem",

          position: 1,

          name: "Home",

          item: `${SITE_URL}/`,
        },

        {
          "@type": "ListItem",

          position: 2,

          name: "About",

          item: `${SITE_URL}/about`,
        },
      ],
    },
  ],
};

export default function AboutLayout({ children }) {
  return (
    <>
      {children}

      <Script
        id="about-page-schema"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(aboutPageSchema)}
      </Script>
    </>
  );
}