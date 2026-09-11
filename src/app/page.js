import HomePageClient from "./HomePageClient";
import { siteSchema } from "@/lib/schema/siteSchema";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteSchema),
        }}
      />

      <HomePageClient />
    </>
  );
}