export const metadata = {
  title: "Home Loan EMI Calculator – Calculate Monthly EMI | Property Bouquet",
  description:
    "Use the free Property Bouquet home loan EMI calculator to estimate your monthly instalment, total interest and repayment amount based on loan amount, interest rate and tenure.",
  alternates: {
    canonical: "https://propertybouquet.com/tools/emi-calculator",
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
    title: "Home Loan EMI Calculator – Calculate Monthly EMI | Property Bouquet",
    description:
      "Estimate your monthly home loan EMI, total interest and overall repayment amount with the Property Bouquet EMI calculator.",
    url: "https://propertybouquet.com/tools/emi-calculator",
    siteName: "Property Bouquet",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Home Loan EMI Calculator | Property Bouquet",
    description:
      "Calculate estimated monthly home loan EMI, total interest and total repayment using loan amount, interest rate and tenure.",
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

export default function EMICalculatorLayout({ children }) {
  return children;
}
