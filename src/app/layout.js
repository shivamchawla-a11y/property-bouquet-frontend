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

  title: {
    default:
      "Property Bouquet | Luxury Properties, Apartments & Investment Opportunities",
    template: "%s | Property Bouquet",
  },

  themeColor: "#c89948",

  category: "Real Estate",

  description:
    "Discover luxury apartments, villas, penthouses and premium investment opportunities across Gurgaon, Noida, Delhi NCR and India's leading cities. Explore new launches, ready-to-move homes and exclusive developer projects.",

  keywords: [
    "Luxury Real Estate",
    "Luxury Apartments",
    "Luxury Villas",
    "Property in Gurgaon",
    "Property in Noida",
    "Property in Delhi NCR",
    "Luxury Homes India",
    "New Launch Projects",
    "Ready to Move Apartments",
    "Property Bouquet",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
    title: "Property Bouquet | Luxury Real Estate in India",
    description:
      "Discover luxury apartments, villas, penthouses and premium investment opportunities across Gurgaon, Noida, Delhi NCR and India's leading cities. Explore new launches, ready-to-move homes and exclusive developer projects.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Property Bouquet | Luxury Real Estate in India",
    description:
      "Discover luxury apartments, villas, penthouses and premium investment opportunities across Gurgaon, Noida, Delhi NCR and India's leading cities.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
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