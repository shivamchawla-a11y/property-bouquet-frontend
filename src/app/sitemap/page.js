import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calculator,
  ChevronRight,
  Compass,
  Crown,
  Home,
  Landmark,
  MapPin,
  Newspaper,
  Sparkles,
  Waypoints,
} from "lucide-react";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

const SITE_URL = "https://propertybouquet.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Luxury Real Estate Sitemap | Property Bouquet",

  description:
    "Explore the Property Bouquet sitemap to discover luxury properties, leading real estate developers, prime Gurgaon locations, property insights, knowledge resources and real estate tools.",

  keywords: [
    "Property Bouquet sitemap",
    "luxury real estate Gurgaon",
    "luxury properties Gurgaon",
    "Gurgaon real estate",
    "Gurugram properties",
    "real estate developers Gurgaon",
    "Gurgaon property developers",
    "luxury homes Gurgaon",
    "Gurgaon property insights",
    "real estate knowledge",
    "Property Bouquet",
  ],

  alternates: {
    canonical: "/sitemap",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/sitemap`,
    siteName: "Property Bouquet",
    title: "Luxury Real Estate Sitemap | Property Bouquet",
    description:
      "Explore luxury properties, leading developers, prime Gurgaon locations, real estate insights, knowledge resources and tools across Property Bouquet.",
  },

  twitter: {
    card: "summary",
    title: "Luxury Real Estate Sitemap | Property Bouquet",
    description:
      "Explore luxury properties, leading developers, prime Gurgaon locations, insights, knowledge and real estate tools.",
  },

  category: "Real Estate",
};

/* =========================================================
   FETCH PUBLISHED PROPERTIES
========================================================= */

async function getPublishedProperties() {
  try {
    const res = await fetch(`${SITE_URL}/api/properties?all=true`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      return [];
    }

    const result = await res.json();

    const properties = Array.isArray(result?.data)
      ? result.data
      : [];

    return properties
      .filter(
        (property) =>
          property?.status === "published" &&
          property?.isDeleted !== true &&
          property?.isActive !== false &&
          property?.slug
      )
      .sort((a, b) =>
        String(a?.coreDetails?.title || "").localeCompare(
          String(b?.coreDetails?.title || "")
        )
      );
  } catch (error) {
    console.error("Sitemap properties fetch failed:", error);
    return [];
  }
}

/* =========================================================
   HELPERS
========================================================= */

function getDeveloperSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatPropertyTitle(property) {
  return (
    property?.coreDetails?.title ||
    property?.title ||
    "Luxury Property"
  );
}

function groupPropertiesByDeveloper(properties) {
  const grouped = {};

  properties.forEach((property) => {
    const developer =
      property?.coreDetails?.developerName ||
      "Other Properties";

    if (!grouped[developer]) {
      grouped[developer] = [];
    }

    grouped[developer].push(property);
  });

  return Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b)
  );
}

/* =========================================================
   PRIMARY NAVIGATION
========================================================= */

const primaryLinks = [
  {
    title: "Home",
    href: "/",
    description:
      "Discover Property Bouquet and our curated world of luxury real estate.",
    icon: Home,
  },
  {
    title: "Properties",
    href: "/properties",
    description:
      "Explore premium residences, plotted developments and exceptional addresses.",
    icon: Building2,
  },
  {
    title: "Locations",
    href: "/locations",
    description:
      "Discover sought-after destinations and emerging real estate corridors.",
    icon: MapPin,
  },
  {
    title: "Developers",
    href: "/developers",
    description:
      "Explore distinguished developers shaping India's finest communities.",
    icon: Landmark,
  },
  {
    title: "Knowledge Centre",
    href: "/knowledge",
    description:
      "Practical guides and insights to help you make informed property decisions.",
    icon: Sparkles,
  },
  {
    title: "Property Insights",
    href: "/insights",
    description:
      "Stay informed with market intelligence, trends and investment perspectives.",
    icon: Newspaper,
  },
  {
    title: "About Property Bouquet",
    href: "/about",
    description:
      "Learn about our philosophy, expertise and approach to luxury real estate.",
    icon: Crown,
  },
  {
    title: "Contact",
    href: "/contact",
    description:
      "Connect with our advisors for personalised property guidance.",
    icon: Compass,
  },
];

/* =========================================================
   LOCATIONS
========================================================= */

const locations = [
  {
    name: "Dwarka Expressway",
    subtitle: "High-growth corridor",
    href: "/properties?location=Dwarka%20Expressway",
  },
  {
    name: "Golf Course Extension Road",
    subtitle: "Premium residential destination",
    href: "/properties?location=Golf%20Course%20Extension%20Road",
  },
  {
    name: "Golf Course Road",
    subtitle: "Established luxury address",
    href: "/properties?location=Golf%20Course%20Road",
  },
  {
    name: "Sohna",
    subtitle: "Emerging luxury destination",
    href: "/properties?location=Sohna",
  },
  {
    name: "Southern Peripheral Road",
    subtitle: "Strategic growth corridor",
    href: "/properties?location=Southern%20Peripheral%20Road",
  },
  {
    name: "New Gurgaon",
    subtitle: "Next-generation urban living",
    href: "/properties?location=New%20Gurgaon",
  },
  {
    name: "Sector 63A",
    subtitle: "Premium residential enclave",
    href: "/properties?location=Sector%2063A",
  },
  {
    name: "Sector 58",
    subtitle: "Prime Golf Course address",
    href: "/properties?location=Sector%2058",
  },
];

/* =========================================================
   RESOURCES
========================================================= */

const resources = [
  {
    title: "Property Insights",
    description:
      "Market updates, investment analysis, project reviews and real estate perspectives.",
    href: "/insights",
    icon: Newspaper,
  },
  {
    title: "Knowledge Centre",
    description:
      "Buying guides, investment guides, area guides and practical property resources.",
    href: "/knowledge",
    icon: Sparkles,
  },
  {
    title: "Area Converter",
    description:
      "Quickly convert commonly used real estate area measurements.",
    href: "/tools/area-converter",
    icon: Waypoints,
  },
  {
    title: "ROI Calculator",
    description:
      "Evaluate potential returns and make more informed investment decisions.",
    href: "/tools/roi-calculator",
    icon: Calculator,
  },
];

/* =========================================================
   SMALL DECORATIVE COMPONENTS
========================================================= */

function GoldDivider({ centered = false }) {
  return (
    <div
      className={`flex items-center gap-3 ${
        centered ? "justify-center" : ""
      }`}
    >
      <span className="h-px w-12 bg-[#c9a64b]" />

      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className="absolute h-2.5 w-2.5 rotate-45 border border-[#c9a64b]" />
        <span className="h-1 w-1 rounded-full bg-[#c9a64b]" />
      </span>

      <span className="h-px w-12 bg-[#c9a64b]" />
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  light = false,
}) {
  return (
    <div>
      <div
        className={`mb-4 text-[10px] font-medium uppercase tracking-[0.32em] ${
          light ? "text-[#d8b46b]" : "text-[#a47c32]"
        }`}
      >
        {eyebrow}
      </div>

      <h2
        className={`font-serif text-3xl font-light leading-tight tracking-[-0.02em] sm:text-4xl lg:text-[44px] ${
          light ? "text-white" : "text-[#10231f]"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-4 max-w-2xl text-sm leading-7 ${
            light ? "text-white/60" : "text-[#52605b]"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function SitemapPage() {
  const properties = await getPublishedProperties();

  const groupedProperties =
    groupPropertiesByDeveloper(properties);

  const developerCount = groupedProperties.length;


  const sitemapSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/sitemap#webpage`,
        url: `${SITE_URL}/sitemap`,
        name: "Luxury Real Estate Sitemap | Property Bouquet",
        description:
          "Explore the Property Bouquet sitemap covering luxury properties, real estate developers, prime Gurgaon locations, property insights, knowledge resources and real estate tools.",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@type": "Thing",
          name: "Luxury Real Estate",
        },
        breadcrumb: {
          "@id": `${SITE_URL}/sitemap#breadcrumb`,
        },
      },

      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/sitemap#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Sitemap",
            item: `${SITE_URL}/sitemap`,
          },
        ],
      },

      {
        "@type": "ItemList",
        name: "Property Bouquet Website Sections",
        description:
          "Explore the main sections and resources available on Property Bouquet.",
        numberOfItems: primaryLinks.length,
        itemListElement: primaryLinks.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          url: `${SITE_URL}${item.href}`,
        })),
      },
    ],
  };

  return (<>

  <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sitemapSchema),
        }}
      />

  <Navbar/>
    <main className="min-h-screen overflow-hidden bg-[#f8f7f3] text-[#10231f]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#061914]">

        {/* Architectural background */}
        <div className="pointer-events-none absolute inset-0">

          <div className="absolute right-[-10%] top-[-20%] h-[650px] w-[650px] rounded-full bg-[#c9a64b]/10 blur-[130px]" />

          <div className="absolute left-[-15%] bottom-[-30%] h-[500px] w-[500px] rounded-full bg-[#17483b]/50 blur-[100px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "90px 90px",
            }}
          />

          {/* Decorative circles */}
          <div className="absolute right-[8%] top-[18%] h-[340px] w-[340px] rounded-full border border-[#c9a64b]/10" />
          <div className="absolute right-[11%] top-[23%] h-[240px] w-[240px] rounded-full border border-[#c9a64b]/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-32 sm:pt-36 lg:px-8 lg:pb-28 lg:pt-40">

          {/* Breadcrumb */}
          <div className="mb-12 flex items-center gap-2 text-[11px] tracking-wide text-white/45">
            <Link
              href="/"
              className="transition hover:text-[#e0c47c]"
            >
              Home
            </Link>

            <ChevronRight
              size={12}
              className="text-[#c9a64b]/70"
            />

            <span className="text-white/80">
              Sitemap
            </span>
          </div>

          <div className="grid items-end gap-14 lg:grid-cols-[1.25fr_.75fr]">

            {/* Hero copy */}
            <div>

              <div className="mb-7 inline-flex items-center gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#d8b46b]">
                  Property Bouquet
                </span>
              </div>

              <GoldDivider />

              <h1 className="mt-8 max-w-4xl font-serif text-[48px] font-light leading-[1.04] tracking-[-0.035em] text-white sm:text-6xl lg:text-[76px]">
                Discover
                <span className="block text-[#d8b46b]">
                  Every Address.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                Explore the complete Property Bouquet ecosystem —
                from distinguished residences and leading developers
                to prime locations, market intelligence and expert
                property resources.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">

                <Link
                  href="/properties"
                  className="group inline-flex items-center gap-3 rounded-sm bg-[#d8b46b] px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#10231f] transition duration-300 hover:bg-[#efd28c]"
                >
                  Explore Properties

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/developers"
                  className="group inline-flex items-center gap-3 rounded-sm border border-white/20 px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 transition duration-300 hover:border-[#c9a64b]/60 hover:text-white"
                >
                  Explore Developers

                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

              </div>
            </div>

            {/* Hero stats panel */}
            <div className="lg:justify-self-end">

              <div className="relative overflow-hidden border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl sm:p-7">

                <div className="absolute right-0 top-0 h-20 w-20 border-l border-b border-[#c9a64b]/20" />

                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#c9a64b]/30 bg-[#c9a64b]/10">
                    <Compass
                      size={18}
                      strokeWidth={1.3}
                      className="text-[#d8b46b]"
                    />
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                      The Collection
                    </div>

                    <div className="mt-1 font-serif text-lg text-white">
                      Property Bouquet
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 divide-x divide-white/10 border-y border-white/10">

                  <div className="py-5 pr-5">
                    <div className="font-serif text-3xl font-light text-[#e0c47c]">
                      {properties.length}
                    </div>

                    <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/35">
                      Published Properties
                    </div>
                  </div>

                  <div className="py-5 pl-5">
                    <div className="font-serif text-3xl font-light text-[#e0c47c]">
                      {developerCount}
                    </div>

                    <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/35">
                      Developers
                    </div>
                  </div>

                </div>

                <div className="mt-6 flex items-center gap-3 text-xs text-white/45">
                  <span className="h-px w-8 bg-[#c9a64b]" />
                  Curated luxury real estate
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom transition */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8f7f3] to-transparent" />
      </section>


      {/* =====================================================
          MAIN NAVIGATION
      ====================================================== */}

      <section className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

        <SectionIntro
          eyebrow="Explore"
          title="The Property Bouquet Journey"
          description="Every important destination, resource and experience is just a step away."
        />

        <div className="mt-12 grid gap-px overflow-hidden border border-[#d9d6cc] bg-[#d9d6cc] sm:grid-cols-2 lg:grid-cols-4">

          {primaryLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative bg-[#fbfaf7] p-7 transition duration-500 hover:bg-white"
              >

                {/* gold corner */}
                <div className="absolute right-0 top-0 h-8 w-8 border-l border-b border-[#c9a64b]/20 opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center border border-[#c9a64b]/25 bg-[#c9a64b]/[0.06]">
                    <Icon
                      size={19}
                      strokeWidth={1.25}
                      className="text-[#a47c32]"
                    />
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-[#a8aaa3] transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#a47c32]"
                  />

                </div>

                <h3 className="mt-7 font-serif text-[21px] font-light text-[#10231f]">
                  {item.title}
                </h3>

                <p className="mt-3 text-[13px] leading-6 text-[#68716d]">
                  {item.description}
                </p>

                <div className="mt-7 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#a47c32] opacity-0 transition duration-300 group-hover:opacity-100">
                  Explore
                  <ArrowRight size={12} />
                </div>

              </Link>
            );
          })}

        </div>
      </section>


      {/* =====================================================
          PROPERTIES
      ====================================================== */}

      <section className="relative border-y border-[#dedbd2] bg-white">

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <SectionIntro
              eyebrow="The Collection"
              title="Luxury Properties"
              description="Explore every published residence and development currently presented by Property Bouquet."
            />

            <Link
              href="/properties"
              className="group inline-flex w-fit shrink-0 items-center gap-3 border-b border-[#c9a64b] pb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#806125] transition hover:text-[#10231f]"
            >
              View All Properties

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          <div className="mt-14">

            {properties.length > 0 ? (
              <div className="space-y-16">

                {groupedProperties.map(
                  ([developer, developerProperties]) => (
                    <div key={developer}>

                      {/* Developer header */}
                      <div className="mb-7 flex items-center gap-5">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c9a64b]/30 bg-[#c9a64b]/[0.05]">
                          <Building2
                            size={17}
                            strokeWidth={1.25}
                            className="text-[#a47c32]"
                          />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">

                            <h3 className="font-serif text-xl font-light text-[#10231f]">
                              {developer}
                            </h3>

                            <span className="rounded-full border border-[#d9d6cc] px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-[#7a807c]">
                              {developerProperties.length}{" "}
                              {developerProperties.length === 1
                                ? "Property"
                                : "Properties"}
                            </span>

                          </div>

                        </div>

                        <div className="h-px flex-1 bg-[#e2dfd7]" />

                      </div>

                      {/* Properties */}
                      <div className="grid border-l border-[#e2dfd7] sm:grid-cols-2 lg:grid-cols-3">

                        {developerProperties.map(
                          (property) => (
                            <Link
                              key={property.slug}
                              href={`/${property.slug}`}
                              className="group relative border-b border-r border-t border-[#e2dfd7] px-5 py-5 transition duration-300 hover:bg-[#faf8f2]"
                            >

                              <div className="flex items-start justify-between gap-4">

                                <div className="min-w-0">

                                  <span className="block text-[14px] leading-6 text-[#303a36] transition group-hover:text-[#8d6927]">
                                    {formatPropertyTitle(
                                      property
                                    )}
                                  </span>

                                  {property?.categoryData
                                    ?.categoryName && (
                                    <span className="mt-1.5 block text-[9px] uppercase tracking-[0.15em] text-[#929691]">
                                      {
                                        property
                                          .categoryData
                                          .categoryName
                                      }
                                    </span>
                                  )}

                                </div>

                                <ArrowUpRight
                                  size={14}
                                  className="mt-1 shrink-0 text-[#a9aaa4] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#a47c32]"
                                />

                              </div>

                            </Link>
                          )
                        )}

                      </div>
                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="border border-[#dedbd2] bg-[#faf9f5] px-6 py-14 text-center">
                <p className="text-sm text-[#777d78]">
                  Property collection is currently being updated.
                </p>
              </div>
            )}

          </div>
        </div>
      </section>


      {/* =====================================================
          DEVELOPERS
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#f1efe8]">

        <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-[450px] w-[450px] rounded-full border border-[#c9a64b]/10" />

        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          <SectionIntro
            eyebrow="Distinguished Names"
            title="Leading Developers"
            description="Explore the developers behind some of the most recognised residential addresses across Gurgaon."
          />

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {groupedProperties.map(([developer]) => {
              const developerSlug =
                getDeveloperSlug(developer);

              return (
                <Link
                  key={developer}
                  href={`/developers/${developerSlug}`}
                  className="group relative overflow-hidden border border-[#d8d5cb] bg-[#faf9f5] px-6 py-6 transition duration-500 hover:-translate-y-1 hover:border-[#c9a64b]/50 hover:bg-white"
                >

                  <div className="absolute right-0 top-0 h-12 w-12 border-l border-b border-[#c9a64b]/15 transition group-hover:border-[#c9a64b]/40" />

                  <div className="flex items-center justify-between gap-4">

                    <span className="font-serif text-[18px] font-light text-[#24332e] transition group-hover:text-[#8d6927]">
                      {developer}
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-[#9da09a] transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#a47c32]"
                    />

                  </div>

                  <div className="mt-5 h-px w-8 bg-[#c9a64b] transition-all duration-500 group-hover:w-14" />

                  <div className="mt-4 text-[9px] uppercase tracking-[0.18em] text-[#929791]">
                    Explore Developer
                  </div>

                </Link>
              );
            })}

          </div>

          <div className="mt-9">

            <Link
              href="/developers"
              className="group inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#806125] transition hover:text-[#10231f]"
            >
              Explore All Developers

              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>
      </section>


      {/* =====================================================
          LOCATIONS
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#071b16]">

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-[-10%] top-[10%] h-[450px] w-[450px] rounded-full bg-[#c9a64b]/5 blur-[120px]" />

          <div className="absolute right-[-10%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-[#164638]/60 blur-[100px]" />

        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center">

            <div>

              <div className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#d8b46b]">
                <MapPin size={13} />
                Prime Destinations
              </div>

              <GoldDivider />

              <h2 className="mt-7 max-w-md font-serif text-4xl font-light leading-tight text-white sm:text-5xl">
                Explore the
                <span className="block text-[#d8b46b]">
                  Right Location.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
                Discover established luxury addresses and
                high-growth corridors shaping the future of
                Gurgaon real estate.
              </p>

              <Link
                href="/locations"
                className="group mt-8 inline-flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#d8b46b]"
              >
                Explore All Locations

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

            </div>

            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">

              {locations.map((location) => (
                <Link
                  key={location.name}
                  href={location.href}
                  className="group relative bg-[#0a211b] p-6 transition duration-500 hover:bg-[#102c24]"
                >

                  <div className="flex items-start justify-between gap-5">

                    <div>

                      <h3 className="font-serif text-lg font-light text-white transition group-hover:text-[#e0c47c]">
                        {location.name}
                      </h3>

                      <p className="mt-2 text-[10px] uppercase tracking-[0.13em] text-white/30">
                        {location.subtitle}
                      </p>

                    </div>

                    <ArrowUpRight
                      size={15}
                      className="mt-1 shrink-0 text-white/25 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#d8b46b]"
                    />

                  </div>

                  <div className="mt-6 h-px w-6 bg-[#c9a64b]/60 transition-all duration-500 group-hover:w-12" />

                </Link>
              ))}

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          RESOURCES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">

        <SectionIntro
          eyebrow="Knowledge & Intelligence"
          title="Resources for Better Decisions"
          description="Go beyond property discovery with practical tools, market intelligence and expert knowledge."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {resources.map((resource) => {
            const Icon = resource.icon;

            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group relative overflow-hidden border border-[#dcd9d0] bg-white p-7 transition duration-500 hover:-translate-y-1 hover:border-[#c9a64b]/50"
              >

                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#c9a64b]/5 blur-2xl transition duration-500 group-hover:bg-[#c9a64b]/10" />

                <div className="relative flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center border border-[#c9a64b]/25 bg-[#c9a64b]/[0.05]">
                    <Icon
                      size={18}
                      strokeWidth={1.25}
                      className="text-[#a47c32]"
                    />
                  </div>

                  <ArrowUpRight
                    size={15}
                    className="text-[#a7aaa4] transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#a47c32]"
                  />

                </div>

                <h3 className="relative mt-7 font-serif text-xl font-light text-[#182923]">
                  {resource.title}
                </h3>

                <p className="relative mt-3 text-[13px] leading-6 text-[#69716d]">
                  {resource.description}
                </p>

                <div className="relative mt-7 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#9b752f]">
                  Discover

                  <ArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>

              </Link>
            );
          })}

        </div>
      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-6 pb-20 lg:px-8 lg:pb-28">

        <div className="relative mx-auto max-w-7xl overflow-hidden bg-[#071b16]">

          {/* Decorative architecture */}
          <div className="pointer-events-none absolute inset-0">

            <div className="absolute right-[-100px] top-[-100px] h-[350px] w-[350px] rounded-full border border-[#c9a64b]/10" />

            <div className="absolute right-[-50px] top-[-50px] h-[250px] w-[250px] rounded-full border border-[#c9a64b]/10" />

            <div className="absolute left-0 bottom-0 h-[200px] w-[500px] bg-[#c9a64b]/5 blur-[90px]" />

          </div>

          <div className="relative grid items-center gap-10 px-7 py-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-14">

            <div>

              <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-[#d8b46b]">
                Let's Find the Right Property for You
              </div>

              <h2 className="max-w-2xl font-serif text-3xl font-light leading-tight text-white sm:text-4xl">
                A more refined way to
                <span className="text-[#d8b46b]">
                  {" "}
                  find your next address.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/50">
                Speak with our property advisors for personalised
                guidance across Gurgaon’s finest residential
                destinations.
              </p>

            </div>

            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-4 bg-[#d8b46b] px-7 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[#10231f] transition duration-300 hover:bg-[#efd28c]"
            >
              Talk to an Advisor

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </section>

    </main>
      <Footer/>
      </>
  );
}