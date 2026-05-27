import "./globals.css";

import { Toaster } from "react-hot-toast";

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
  title: "Property Bouquet",
  description: "Luxury Real Estate Platform",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable}`}
    >
      <body>
        {children}

        {/* 🔥 GLOBAL TOAST SYSTEM */}
        <Toaster
          position="top-right"
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