import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const SITE_URL = "https://propertybouquet.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Disclaimer | Property Bouquet",

  description:
    "Read the Property Bouquet disclaimer covering property information, pricing, availability, third-party content, listings, links and general use of the website.",

  alternates: {
    canonical: `${SITE_URL}/disclaimer`,
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/disclaimer`,
    siteName: "Property Bouquet",

    title: "Disclaimer | Property Bouquet",

    description:
      "Important information about property listings, pricing, availability, third-party content and the use of Property Bouquet.",

    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Property Bouquet Disclaimer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Disclaimer | Property Bouquet",

    description:
      "Important information about property listings, pricing, availability and the use of Property Bouquet.",

    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#081c15]">
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <Navbar />

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#081c15]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#081c15] via-[#10251f] to-[#081c15]" />

          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />

          <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#D4AF37]">
                Legal Information
              </p>

              <h1 className="font-serif text-4xl font-medium leading-tight text-white sm:text-5xl md:text-6xl">
                Disclaimer
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                Important information regarding the use of Property Bouquet,
                property listings, pricing, availability and other information
                published on this website.
              </p>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="mx-auto max-w-[1000px] px-5 py-14 sm:px-6 md:py-20">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.06)] sm:p-8 md:p-12">
            {/* INTRODUCTION */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[2px] text-[#b58b45]">
                Property Bouquet
              </p>

              <h2 className="mt-3 font-serif text-2xl font-semibold text-[#081c15] md:text-3xl">
                Website Disclaimer
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-gray-600">
                The information provided on Property Bouquet
                ("Property Bouquet", "we", "us", or "our") is published for
                general informational and property-discovery purposes. By
                accessing or using this website, you acknowledge and agree to
                the terms and limitations described in this Disclaimer.
              </p>
            </div>

            <div className="my-10 h-px bg-gray-200" />

            {/* 1 */}
            <section>
              <h2 className="text-xl font-bold text-[#081c15]">
                1. General Information
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet provides information about residential and
                commercial real estate projects, properties, developers,
                locations, amenities, configurations, prices, floor plans,
                images and related services.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                While we make reasonable efforts to keep the information on
                this website accurate and up to date, we do not guarantee that
                all information is complete, current, accurate or free from
                errors.
              </p>
            </section>

            {/* 2 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                2. Property Prices and Availability
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property prices, inventory, availability, specifications,
                payment plans, offers, discounts and other commercial terms
                may change at any time without prior notice.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Any price displayed on Property Bouquet should be considered
                indicative unless expressly confirmed by the relevant
                developer, seller or authorized representative.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Users should independently verify the current price,
                availability, applicable charges, taxes, registration costs,
                maintenance charges and other financial obligations before
                making any decision.
              </p>
            </section>

            {/* 3 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                3. Developer and Project Information
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Information relating to developers, builders, projects and
                properties may be obtained from developers, marketing
                representatives, publicly available sources or other
                third-party sources.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet does not independently guarantee every
                statement, representation, specification, claim or promise
                made by a developer, seller, broker, marketing partner or
                other third party.
              </p>
            </section>

            {/* 4 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                4. Images, Floor Plans and Visual Material
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Images, photographs, renders, floor plans, maps, illustrations
                and other visual material displayed on the website may be
                representative, illustrative or digitally generated.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Actual construction, finishes, dimensions, views, landscaping,
                interiors, amenities and other features may differ from the
                images or representations shown on the website.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Users should verify actual specifications and deliverables
                directly with the relevant developer or authorized seller.
              </p>
            </section>

            {/* 5 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                5. No Investment or Financial Advice
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Information published on Property Bouquet is not intended to
                constitute financial, investment, legal, tax or professional
                advice.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property investments involve financial and market risks.
                Users should conduct their own due diligence and seek
                appropriate professional advice before entering into any
                property transaction or investment.
              </p>
            </section>

            {/* 6 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                6. Third-Party Websites and Services
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet may contain links, references, contact
                options or integrations relating to third-party websites,
                developers, brokers, service providers or other external
                platforms.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                We do not control third-party websites or services and are not
                responsible for their content, availability, privacy
                practices, accuracy, policies or actions.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Visiting or interacting with a third-party website or service
                is at your own discretion and risk.
              </p>
            </section>

            {/* 7 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                7. No Guarantee of Transaction
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet is a property discovery and information
                platform. Displaying a property, developer or project on the
                website does not constitute a guarantee that a transaction
                will take place.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet does not guarantee the suitability of any
                property for a particular user, financial objective, personal
                requirement or investment strategy.
              </p>
            </section>

            {/* 8 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                8. User Due Diligence
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Before purchasing, booking, investing in or otherwise entering
                into an agreement relating to any property, users should
                independently verify all relevant information.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                This may include ownership, title, approvals, registrations,
                licenses, development status, construction status, RERA
                registration where applicable, floor plans, specifications,
                pricing, payment schedules, taxes, charges and contractual
                terms.
              </p>
            </section>

            {/* 9 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                9. No Warranty
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                To the extent permitted by applicable law, Property Bouquet
                provides the website and its information on an "as available"
                and "as is" basis without warranties or guarantees regarding
                accuracy, completeness, reliability, availability or
                suitability for a particular purpose.
              </p>
            </section>

            {/* 10 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                10. Limitation of Responsibility
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet shall not be responsible, to the maximum
                extent permitted by applicable law, for losses or damages
                arising from reliance on information published on the website,
                inaccuracies in third-party information, changes in property
                availability or pricing, or decisions made by users based on
                website content.
              </p>
            </section>

            {/* 11 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                11. Changes to Website Information
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet may update, modify, remove or replace website
                content, property listings, prices, descriptions, images,
                project information and other material at any time without
                prior notice.
              </p>
            </section>

            {/* 12 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                12. Contact and Enquiries
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Submitting an enquiry through Property Bouquet does not create
                a binding agreement, reservation, purchase commitment or
                guarantee of property availability.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Any transaction or agreement is subject to the terms agreed
                between the relevant parties and the applicable legal and
                contractual documentation.
              </p>
            </section>

            {/* 13 */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                13. Acceptance of This Disclaimer
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                By accessing and using Property Bouquet, you acknowledge that
                you have read, understood and agreed to this Disclaimer.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                If you do not agree with any part of this Disclaimer, you
                should discontinue use of the website.
              </p>
            </section>

            {/* LAST UPDATED */}
            <div className="mt-12 rounded-2xl border border-[#D4AF37]/20 bg-[#fbfaf7] p-5">
              <p className="text-xs font-semibold uppercase tracking-[2px] text-[#b58b45]">
                Last Updated
              </p>

              <p className="mt-2 text-sm text-gray-600">
                August 2026
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <Footer />
    </div>
  );
}