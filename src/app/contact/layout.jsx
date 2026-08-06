const SITE_URL = "https://propertybouquet.com";

export const metadata = {
  title:
    "Contact Property Bouquet | Luxury Real Estate Consultants in Gurugram",

  description:
    "Contact Property Bouquet for expert guidance on luxury apartments, villas, commercial spaces and premium real estate investments in Gurugram. Speak with our advisors today.",

  keywords: [
    "Contact Property Bouquet",
    "Luxury Real Estate Gurugram",
    "Property Consultants Gurgaon",
    "Luxury Property Advisors",
    "Real Estate Experts",
    "Property Investment",
    "Premium Homes",
    "Commercial Property",
  ],

  alternates: {
    canonical: `${SITE_URL}/contact`,
  },

  openGraph: {
    title:
      "Contact Property Bouquet | Luxury Real Estate Consultants",

    description:
      "Connect with Property Bouquet for personalised luxury real estate advisory and premium property investments.",

    url: `${SITE_URL}/contact`,

    siteName: "Property Bouquet",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: `${SITE_URL}/contact/contact-hero.webp`,
        width: 1200,
        height: 630,
        alt: "Property Bouquet Contact",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Contact Property Bouquet | Luxury Real Estate Consultants",

    description:
      "Speak with our luxury property experts for personalised guidance and premium investment opportunities.",

    images: [`${SITE_URL}/contact/contact-hero.webp`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}) {
  return children;
}