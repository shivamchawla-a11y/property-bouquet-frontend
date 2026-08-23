import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

const SITE_URL = "https://propertybouquet.com";

// ============================================================
// SEO METADATA
// ============================================================

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Terms of Use | Property Bouquet",

  description:
    "Read the Terms of Use for Property Bouquet covering website access, property listings, user enquiries, intellectual property, third-party content, acceptable use and your responsibilities.",

  alternates: {
    canonical: `${SITE_URL}/terms-of-use`,
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
    url: `${SITE_URL}/terms-of-use`,
    siteName: "Property Bouquet",

    title: "Terms of Use | Property Bouquet",

    description:
      "Read the Terms of Use governing access to and use of the Property Bouquet website and its property information services.",

    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Property Bouquet Terms of Use",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Terms of Use | Property Bouquet",

    description:
      "Terms governing access to and use of Property Bouquet and its property discovery services.",

    images: [`${SITE_URL}/og-image.jpg`],
  },
};

// ============================================================
// PAGE
// ============================================================

export default function TermsOfUsePage() {
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
        {/* ===================================================
            HERO
        =================================================== */}

        <section className="relative overflow-hidden bg-[#081c15]">
          {/* Background */}

          <div className="absolute inset-0 bg-gradient-to-br from-[#081c15] via-[#10251f] to-[#081c15]" />

          {/* Gold Glow */}

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-3xl" />

          {/* Hero Content */}

          <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-[#D4AF37]">
                Legal Information
              </p>

              <h1 className="font-serif text-4xl font-medium leading-tight text-white sm:text-5xl md:text-6xl">
                Terms of Use
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                Please read these Terms of Use carefully before accessing or
                using Property Bouquet. They explain the rules and conditions
                that apply to your use of our website and services.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <section className="mx-auto max-w-[1000px] px-5 py-14 sm:px-6 md:py-20">
          <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.06)] sm:p-8 md:p-12">
            {/* =================================================
                INTRODUCTION
            ================================================= */}

            <div>
              <p className="text-sm font-semibold uppercase tracking-[2px] text-[#b58b45]">
                Property Bouquet
              </p>

              <h2 className="mt-3 font-serif text-2xl font-semibold text-[#081c15] md:text-3xl">
                Terms and Conditions of Use
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-gray-600">
                These Terms of Use ("Terms", "Terms of Use") govern your
                access to and use of the Property Bouquet website
                ("Website"), operated by Property Bouquet ("Property Bouquet",
                "we", "us", or "our").
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                By accessing, browsing or using the Website, you acknowledge
                that you have read, understood and agreed to be bound by these
                Terms of Use. If you do not agree with these Terms, please do
                not use the Website.
              </p>
            </div>

            <div className="my-10 h-px bg-gray-200" />

            {/* =================================================
                1
            ================================================= */}

            <section>
              <h2 className="text-xl font-bold text-[#081c15]">
                1. About Property Bouquet
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet is a real estate discovery and information
                platform designed to help users explore residential and
                commercial properties, projects, developers, locations,
                amenities, configurations, pricing information and related
                property details.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                The Website may display information relating to properties and
                projects from developers, sellers, marketing partners and
                other third parties.
              </p>
            </section>

            {/* =================================================
                2
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                2. Eligibility and Use of the Website
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                You may use Property Bouquet only for lawful purposes and in
                accordance with these Terms of Use.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                By using the Website, you represent that you are legally
                capable of entering into an agreement under applicable law and
                that the information you provide to us, where applicable, is
                accurate and truthful.
              </p>
            </section>

            {/* =================================================
                3
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                3. Property Listings and Information
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property listings may contain information including property
                names, project descriptions, prices, locations, floor plans,
                configurations, images, amenities, developer information,
                specifications and other related details.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                We make reasonable efforts to maintain accurate and useful
                information; however, property information may change without
                notice.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                You should independently verify important information with the
                relevant developer, seller, broker or authorized representative
                before making any property-related decision.
              </p>
            </section>

            {/* =================================================
                4
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                4. Prices and Availability
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Prices, inventory, availability, offers, discounts, payment
                plans, specifications and other property-related information
                may change at any time.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Unless expressly confirmed by the relevant developer, seller
                or authorized representative, information displayed on the
                Website should not be treated as a final quotation, offer or
                guarantee of availability.
              </p>
            </section>

            {/* =================================================
                5
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                5. User Enquiries and Communications
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet may provide enquiry forms, contact buttons,
                telephone options, messaging options or other communication
                methods that allow users to request information about
                properties or projects.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Submitting an enquiry does not create a reservation, booking,
                purchase agreement, agency relationship or guarantee that a
                property will remain available.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                By submitting an enquiry, you agree that Property Bouquet or
                relevant property representatives may contact you regarding
                your enquiry, subject to applicable law and our Privacy Policy.
              </p>
            </section>

            {/* =================================================
                6
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                6. Acceptable Use
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                You agree not to misuse the Website or use it for unlawful or
                unauthorized purposes.
              </p>

              <ul className="mt-4 space-y-3 pl-5 text-[15px] leading-8 text-gray-600">
                <li className="list-disc">
                  Do not use the Website for fraudulent, unlawful or deceptive
                  activities.
                </li>

                <li className="list-disc">
                  Do not attempt to gain unauthorized access to any part of
                  the Website, server or related systems.
                </li>

                <li className="list-disc">
                  Do not introduce viruses, malicious code or other harmful
                  material.
                </li>

                <li className="list-disc">
                  Do not scrape, copy, reproduce or systematically collect
                  Website data without authorization.
                </li>

                <li className="list-disc">
                  Do not interfere with the operation, security or performance
                  of the Website.
                </li>

                <li className="list-disc">
                  Do not use Website content to create a competing database,
                  service or property platform without our permission.
                </li>
              </ul>
            </section>

            {/* =================================================
                7
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                7. Intellectual Property
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Unless otherwise stated, the Website and its original content,
                including text, branding, logos, graphics, layouts, design
                elements, software, user interface elements and other
                materials, are owned by or licensed to Property Bouquet and
                are protected by applicable intellectual property laws.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                You may access and use Website content for personal,
                non-commercial property research purposes. You may not
                reproduce, distribute, modify, publish, sell, transmit or
                commercially exploit our proprietary content without prior
                written permission.
              </p>
            </section>

            {/* =================================================
                8
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                8. Third-Party Content and Services
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                The Website may include information, content, links, services
                or integrations provided by third parties.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet does not control third-party websites,
                services or content and is not responsible for their
                availability, accuracy, policies, practices or actions.
              </p>
            </section>

            {/* =================================================
                9
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                9. No Professional Advice
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Information available on Property Bouquet is provided for
                general informational purposes and does not constitute legal,
                financial, investment, tax or other professional advice.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                You should consult an appropriately qualified professional
                before making decisions involving significant financial,
                legal, tax or investment considerations.
              </p>
            </section>

            {/* =================================================
                10
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                10. No Guarantee of Transactions
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet does not guarantee that any property,
                project, developer or seller displayed on the Website will
                enter into a transaction with you.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Any property purchase, sale, lease, booking or other
                transaction is solely subject to the agreement between the
                relevant parties and the applicable contractual and legal
                documentation.
              </p>
            </section>

            {/* =================================================
                11
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                11. Website Availability
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                We aim to keep Property Bouquet available and functioning
                properly, but we do not guarantee that the Website will
                always be uninterrupted, secure, error-free or available at
                all times.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                The Website may occasionally be unavailable because of
                maintenance, technical issues, updates, network failures or
                circumstances outside our reasonable control.
              </p>
            </section>

            {/* =================================================
                12
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                12. Disclaimer of Warranties
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                To the extent permitted by applicable law, Property Bouquet
                provides the Website and its content on an "as is" and "as
                available" basis.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                We do not guarantee that information on the Website will
                always be accurate, complete, current, reliable or suitable
                for your particular requirements.
              </p>
            </section>

            {/* =================================================
                13
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                13. Limitation of Liability
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                To the maximum extent permitted by applicable law, Property
                Bouquet shall not be liable for any direct, indirect,
                incidental, consequential or other losses arising from or
                related to your use of the Website, reliance on Website
                information, third-party content, property listings or
                property-related decisions.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Nothing in these Terms is intended to exclude or limit any
                liability that cannot lawfully be excluded or limited under
                applicable law.
              </p>
            </section>

            {/* =================================================
                14
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                14. Privacy
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Your use of the Website may involve the collection and
                processing of certain information. Our handling of personal
                information is governed by our Privacy Policy.
              </p>
            </section>

            {/* =================================================
                15
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                15. Changes to These Terms
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Property Bouquet may update or modify these Terms of Use from
                time to time to reflect changes to our services, Website,
                business practices or applicable legal requirements.
              </p>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                Any updated version will be published on this page. Your
                continued use of the Website after changes are published
                constitutes your acceptance of the updated Terms.
              </p>
            </section>

            {/* =================================================
                16
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                16. Suspension or Termination
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                We reserve the right to restrict, suspend or terminate access
                to the Website, or any part of it, where reasonably necessary,
                including in cases of misuse, unauthorized activity,
                violation of these Terms or security concerns.
              </p>
            </section>

            {/* =================================================
                17
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                17. Severability
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                If any provision of these Terms is determined to be invalid,
                unlawful or unenforceable, that provision shall be interpreted
                or modified to the extent necessary to make it enforceable,
                while the remaining provisions shall continue in full force
                and effect.
              </p>
            </section>

            {/* =================================================
                18
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                18. Entire Agreement
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                These Terms of Use, together with the Privacy Policy,
                Disclaimer and any other policies or terms expressly
                incorporated by reference, constitute the terms governing
                your use of the Website, subject to applicable law.
              </p>
            </section>

            {/* =================================================
                19
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                19. Governing Law
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                These Terms shall be governed by and interpreted in accordance
                with the laws applicable to Property Bouquet and its
                operations, subject to the jurisdiction of the appropriate
                courts and applicable law.
              </p>
            </section>

            {/* =================================================
                20
            ================================================= */}

            <section className="mt-10">
              <h2 className="text-xl font-bold text-[#081c15]">
                20. Contact Us
              </h2>

              <p className="mt-4 text-[15px] leading-8 text-gray-600">
                If you have questions regarding these Terms of Use or the use
                of Property Bouquet, you may contact us through the contact
                information provided on our Website.
              </p>
            </section>

            {/* =================================================
                LAST UPDATED
            ================================================= */}

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