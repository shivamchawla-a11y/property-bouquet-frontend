import "./globals.css";

export const metadata = {
  title: "Property Bouquet",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}