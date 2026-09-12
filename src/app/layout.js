import "./globals.css";

import Script from "next/script";
import { Toaster } from "react-hot-toast";

import {
  Playfair_Display,
  Montserrat,
} from "next/font/google";

import FloatingContact from "@/components/common/FloatingContact";
import ConditionalTimedLeadPopup from "@/components/common/ConditionalTimedLeadPopup";

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

// ============================================================
// SITE METADATA
// ============================================================

export const metadata = {
  metadataBase: new URL("https://propertybouquet.com"),

  title:
    "Property Bouquet | Luxury Properties, Apartments & Investment Opportunities",

  description:
    "Property Bouquet is India's luxury real estate platform helping buyers discover premium apartments, villas, penthouses, new launches and investment opportunities across Gurgaon, Noida, Delhi NCR and other leading cities.",

  applicationName: "Property Bouquet",

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
    canonical: "https://propertybouquet.com",
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

  // ==========================================================
  // OPEN GRAPH
  // ==========================================================

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
        url: "/logo.webp",
        width: 512,
        height: 512,
        alt: "Property Bouquet Luxury Real Estate",
      },
    ],
  },

  // ==========================================================
  // TWITTER / X
  // ==========================================================

  twitter: {
    card: "summary",

    title:
      "Property Bouquet | Luxury Real Estate in India",

    description:
      "Property Bouquet is India's luxury real estate platform helping buyers discover premium apartments, villas, penthouses, new launches and investment opportunities across Gurgaon, Noida, Delhi NCR and other leading cities.",

    images: ["/logo.webp"],

    imageAlt: "Property Bouquet Luxury Real Estate",
  },
};

// ============================================================
// ROOT LAYOUT
// ============================================================

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable}`}
    >
      <body>
        {/* ==================================================
            GOOGLE ANALYTICS 4
        ================================================== */}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YQQKE9JP9L"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'G-YQQKE9JP9L');
          `}
        </Script>

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        {children}

        {/* ==================================================
            GLOBAL TIMED LEAD POPUP
            Excluded automatically on:
            /admin/*
            /login
            /auth/*
            /forgot-password
            /forget-password
            /reset-password
        ================================================== */}

        <ConditionalTimedLeadPopup />

        {/* ==================================================
            FLOATING WHATSAPP + CALL BUTTONS
        ================================================== */}

        <FloatingContact />

        {/* ==================================================
            GLOBAL TOASTER
        ================================================== */}

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