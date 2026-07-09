import "./globals.css";

import { Toaster } from "react-hot-toast";
import { siteSchema } from "@/lib/schema/siteSchema";

import {
  Playfair_Display,
  Montserrat,
} from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://propertybouquet.com"),

  title:
    "Property Bouquet | Luxury Properties, Apartments & Investment Opportunities",

  applicationName: "Property Bouquet",

  manifest: "/site.webmanifest",

  category: "Real Estate",

  creator: "Property Bouquet",

  publisher: "Property Bouquet",

  authors: [
    {
      name: "Property Bouquet",
      url: "https://propertybouquet.com",
    },
  ],

  verification: {
    google: "gz3uH-bqlngIa4CXwx2YOcYylDepDJZZpvqGVRyY4dQ",
  },

  description:
    "Property Bouquet is India's luxury real estate platform helping buyers discover premium apartments, villas, penthouses, new launches and investment opportunities across Gurgaon, Noida, Delhi NCR and other leading cities.",

  keywords: [
    "Property Bouquet",
    "Luxury Real Estate",
    "Luxury Apartments",
    "Luxury Villas",
    "Luxury Homes India",
    "Property in Gurgaon",
    "Property in Noida",
    "Property in Delhi NCR",
    "Luxury Property India",
    "Premium Apartments",
    "New Launch Projects",
    "Ready to Move Homes",
    "Investment Properties",
    "Real Estate Platform",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://propertybouquet.com",
    siteName: "Property Bouquet",
    title:
      "Property Bouquet | Luxury Real Estate in India",
    description:
      "Property Bouquet is India's luxury real estate platform helping buyers discover premium apartments, villas, penthouses, new launches and investment opportunities across Gurgaon, Noida, Delhi NCR and other leading cities.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Property Bouquet Luxury Real Estate",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Property Bouquet | Luxury Real Estate in India",
    description:
      "Property Bouquet is India's luxury real estate platform helping buyers discover premium apartments, villas, penthouses, new launches and investment opportunities across Gurgaon, Noida, Delhi NCR and other leading cities.",
    images: ["/og-image.jpg"],
    imageAlt: "Property Bouquet Luxury Real Estate",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],

    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteSchema),
          }}
        />

        {children}

        <Toaster
          position="top-right"
          containerStyle={{
            zIndex: 2147483647,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f1f1f",
              color: "#fff",
              border: "1px solid #333",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}