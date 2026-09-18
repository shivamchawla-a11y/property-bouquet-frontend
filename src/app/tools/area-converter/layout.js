import React from "react";

export const metadata = {
  title:
    "Area Converter – Convert Sq Ft, Sq Yd, Sq M & More | Property Bouquet",

  description:
    "Free area converter for real estate and land measurements. Convert square feet, square yards, square metres, acres, hectares, bigha, gaj and other common property area units instantly.",

  alternates: {
    canonical: "https://propertybouquet.com/tools/area-converter",
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
    title:
      "Area Converter – Convert Sq Ft, Sq Yd, Sq M & More | Property Bouquet",

    description:
      "Convert property and land area measurements instantly between square feet, square yards, square metres, acres, hectares, bigha, gaj and other common units.",

    url: "https://propertybouquet.com/tools/area-converter",

    siteName: "Property Bouquet",

    locale: "en_IN",

    type: "website",
  },

  twitter: {
    card: "summary",

    title:
      "Area Converter – Convert Sq Ft, Sq Yd, Sq M & More | Property Bouquet",

    description:
      "Free property area converter for square feet, square yards, square metres, acres, hectares, bigha, gaj and more.",
  },

  category: "Real Estate Tools",

  applicationName: "Property Bouquet",

  creator: "Property Bouquet",

  publisher: "Property Bouquet",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function AreaConverterLayout({ children }) {
  return children;
}
