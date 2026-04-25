import "./globals.css";

export const metadata = {
  title: "Property Bouquet",
  description: "Admin Dashboard",
  icons: {
    icon: "/logo.png", // path from public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}