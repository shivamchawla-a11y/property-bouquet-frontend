import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";

const SITE_URL = "https://propertybouquet.com";

// ============================================================
// METADATA
// ============================================================

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title:
    "Privacy Policy | Property Bouquet",

  description:
    "Read the Privacy Policy for Property Bouquet to understand how we collect, use, protect and manage information when you use our luxury real estate platform.",

  keywords: [
    "Property Bouquet privacy policy",
    "privacy policy",
    "Property Bouquet data privacy",
    "real estate privacy policy",
    "property website privacy policy",
    "personal information",
    "data protection",
  ],

  applicationName:
    "Property Bouquet",

  alternates: {
    canonical:
      `${SITE_URL}/privacy`,
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

    url:
      `${SITE_URL}/privacy`,

    siteName:
      "Property Bouquet",

    title:
      "Privacy Policy | Property Bouquet",

    description:
      "Learn how Property Bouquet collects, uses, protects and manages information when you use our luxury real estate platform.",

    images: [
      {
        url:
          `${SITE_URL}/og-image.jpg`,

        width: 1200,

        height: 630,

        alt:
          "Property Bouquet Privacy Policy",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Privacy Policy | Property Bouquet",

    description:
      "Learn how Property Bouquet collects, uses, protects and manages information when you use our luxury real estate platform.",

    images: [
      `${SITE_URL}/og-image.jpg`,
    ],
  },
};

// ============================================================
// JSON-LD
// ============================================================

function safeJsonLd(data) {
  return JSON.stringify(data).replace(
    /</g,
    "\\u003c"
  );
}

// ============================================================
// PAGE
// ============================================================

export default function PrivacyPage() {
  const canonicalUrl =
    `${SITE_URL}/privacy`;

  // ==========================================================
  // BREADCRUMB SCHEMA
  // ==========================================================

  const breadcrumbSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    "@id":
      `${canonicalUrl}#breadcrumb`,

    itemListElement: [
      {
        "@type":
          "ListItem",

        position:
          1,

        name:
          "Home",

        item:
          SITE_URL,
      },

      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "Privacy Policy",

        item:
          canonicalUrl,
      },
    ],
  };

  // ==========================================================
  // WEB PAGE SCHEMA
  // ==========================================================

  const webPageSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "WebPage",

    "@id":
      `${canonicalUrl}#webpage`,

    url:
      canonicalUrl,

    name:
      "Privacy Policy | Property Bouquet",

    headline:
      "Privacy Policy",

    description:
      "Privacy Policy explaining how Property Bouquet collects, uses, protects and manages information when visitors and users use the platform.",

    inLanguage:
      "en-IN",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}#website`,

      name:
        "Property Bouquet",

      url:
        SITE_URL,
    },

    publisher: {
      "@type":
        "Organization",

      "@id":
        `${SITE_URL}/#organization`,

      name:
        "Property Bouquet",

      url:
        SITE_URL,
    },

    dateModified:
      "2026-08-23",
  };

  return (
    <>
      {/* ======================================================
          BREADCRUMB JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              breadcrumbSchema
            ),
        }}
      />

      {/* ======================================================
          WEB PAGE JSON-LD
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              webPageSchema
            ),
        }}
      />

      {/* ======================================================
          PAGE
      ====================================================== */}

      <main className="min-h-screen bg-[#fbfaf7] text-[#18231f]">

        {/* ====================================================
            HERO
        ==================================================== */}

        <Navbar/>

        <section className="relative overflow-hidden border-b border-[#d4af37]/15 bg-[#081c15]">

          {/* Decorative glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-32
              -top-32
              h-80
              w-80
              rounded-full
              bg-[#D4AF37]/10
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-40
              -left-32
              h-96
              w-96
              rounded-full
              bg-[#D4AF37]/5
              blur-3xl
            "
          />

          <div
            className="
              relative
              mx-auto
              max-w-[1200px]
              px-5
              py-20
              sm:px-8
              sm:py-24
              lg:px-10
              lg:py-28
            "
          >

            {/* BACK */}

            <Link
              href="/"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-white/60
                transition-colors
                hover:text-[#D4AF37]
              "
            >
              ← Back to Property Bouquet
            </Link>

            {/* LABEL */}

            <div
              className="
                mt-10
                flex
                items-center
                gap-3
                text-[11px]
                font-semibold
                uppercase
                tracking-[3px]
                text-[#D4AF37]
              "
            >
              <span className="h-px w-8 bg-[#D4AF37]" />

              Legal & Privacy

              <span className="h-px w-8 bg-[#D4AF37]" />
            </div>

            {/* TITLE */}

            <h1
              className="
                mt-6
                max-w-4xl
                font-serif
                text-4xl
                font-medium
                leading-[1.08]
                tracking-tight
                text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              Privacy Policy
            </h1>

            {/* INTRO */}

            <p
              className="
                mt-6
                max-w-3xl
                text-base
                leading-7
                text-white/65
                sm:text-lg
                sm:leading-8
              "
            >
              Your privacy matters to us. This Privacy Policy
              explains how Property Bouquet collects, uses,
              protects and manages information when you browse
              or use our platform.
            </p>

            {/* UPDATED */}

            <p
              className="
                mt-7
                text-xs
                font-medium
                uppercase
                tracking-[1.5px]
                text-white/40
              "
            >
              Last Updated: August 23, 2026
            </p>

          </div>
        </section>

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <section
          className="
            mx-auto
            max-w-[1000px]
            px-5
            py-14
            sm:px-8
            sm:py-20
            lg:px-10
            lg:py-24
          "
        >

          {/* ==================================================
              INTRODUCTION
          ================================================== */}

          <div className="space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              1. Introduction
            </h2>

            <p className="leading-8 text-gray-600">
              Welcome to Property Bouquet. Property Bouquet
              operates a luxury real estate platform that helps
              users discover, explore and enquire about
              residential and commercial properties, projects,
              developers and related real estate information.
            </p>

            <p className="leading-8 text-gray-600">
              This Privacy Policy describes how information may
              be collected, used, stored and protected when you
              visit or interact with
              <strong className="font-semibold text-[#081c15]">
                {" "}propertybouquet.com
              </strong>
              {" "}and related services.
            </p>

            <p className="leading-8 text-gray-600">
              By using the website, you acknowledge that you
              have read and understood this Privacy Policy.
            </p>

          </div>

          {/* ==================================================
              INFORMATION WE COLLECT
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              2. Information We Collect
            </h2>

            <p className="leading-8 text-gray-600">
              Depending on how you interact with Property
              Bouquet, we may collect different categories of
              information.
            </p>

            <h3 className="pt-3 text-xl font-semibold text-[#10251f]">
              2.1 Information You Provide
            </h3>

            <p className="leading-8 text-gray-600">
              When you submit an enquiry, contact request,
              property interest form or other information through
              the website, you may voluntarily provide details
              such as:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Property preferences</li>
              <li>Location preferences</li>
              <li>Budget preferences</li>
              <li>Other information included in your enquiry</li>
            </ul>

            <h3 className="pt-3 text-xl font-semibold text-[#10251f]">
              2.2 Automatically Collected Information
            </h3>

            <p className="leading-8 text-gray-600">
              When you visit the website, certain technical
              information may be collected automatically. This
              may include browser type, device type, operating
              system, approximate location, IP address, pages
              viewed, referring pages, interactions and other
              technical information.
            </p>

          </div>

          {/* ==================================================
              HOW WE USE INFORMATION
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              3. How We Use Information
            </h2>

            <p className="leading-8 text-gray-600">
              Information collected through Property Bouquet
              may be used for purposes including:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
              <li>
                Providing and operating the website and its
                features.
              </li>

              <li>
                Responding to property enquiries and contact
                requests.
              </li>

              <li>
                Helping users discover properties and projects
                relevant to their interests.
              </li>

              <li>
                Connecting users with relevant property,
                developer or sales representatives where
                appropriate.
              </li>

              <li>
                Improving website functionality, performance and
                user experience.
              </li>

              <li>
                Understanding website usage and visitor
                behaviour.
              </li>

              <li>
                Preventing fraud, abuse, security incidents and
                unauthorized activity.
              </li>

              <li>
                Complying with applicable legal and regulatory
                requirements.
              </li>
            </ul>

          </div>

          {/* ==================================================
              PROPERTY ENQUIRIES
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              4. Property Enquiries and Lead Information
            </h2>

            <p className="leading-8 text-gray-600">
              Property Bouquet may provide enquiry and lead
              information to relevant developers, property
              representatives, channel partners or service
              providers when necessary to respond to a request
              submitted by a user.
            </p>

            <p className="leading-8 text-gray-600">
              For example, if you request information about a
              specific property or project, the information
              provided by you may be shared with the appropriate
              representative so that your enquiry can be
              addressed.
            </p>

            <p className="leading-8 text-gray-600">
              By submitting an enquiry, you acknowledge that such
              communication may be necessary to fulfil your
              request.
            </p>

          </div>

          {/* ==================================================
              COOKIES
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              5. Cookies and Similar Technologies
            </h2>

            <p className="leading-8 text-gray-600">
              Property Bouquet may use cookies and similar
              technologies to help operate the website, remember
              preferences, understand website usage and improve
              performance.
            </p>

            <p className="leading-8 text-gray-600">
              Cookies may also be used by third-party services
              integrated into the website for analytics,
              functionality, security or other legitimate
              purposes.
            </p>

            <p className="leading-8 text-gray-600">
              You may be able to control or disable cookies
              through your browser settings. Disabling certain
              cookies may affect some website functionality.
            </p>

          </div>

          {/* ==================================================
              THIRD PARTY SERVICES
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              6. Third-Party Services
            </h2>

            <p className="leading-8 text-gray-600">
              Property Bouquet may use third-party service
              providers for hosting, analytics, communications,
              media storage, security, infrastructure and other
              website-related functions.
            </p>

            <p className="leading-8 text-gray-600">
              These third parties may process information on our
              behalf to provide the services they perform.
              Their handling of information may also be subject
              to their own privacy policies and terms.
            </p>

          </div>

          {/* ==================================================
              DATA SHARING
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              7. When We May Share Information
            </h2>

            <p className="leading-8 text-gray-600">
              Property Bouquet does not intend to sell personal
              information merely because you visit the website.
              Information may, however, be shared when reasonably
              necessary for legitimate business or legal
              purposes, including:
            </p>

            <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-600">
              <li>
                Fulfilling a property enquiry or request.
              </li>

              <li>
                Working with developers and property
                representatives.
              </li>

              <li>
                Working with service providers that support our
                website.
              </li>

              <li>
                Protecting the security and integrity of the
                platform.
              </li>

              <li>
                Complying with legal obligations or lawful
                requests.
              </li>

              <li>
                Protecting the rights, property or safety of
                Property Bouquet, users or others.
              </li>
            </ul>

          </div>

          {/* ==================================================
              DATA SECURITY
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              8. Data Security
            </h2>

            <p className="leading-8 text-gray-600">
              We take reasonable technical and organizational
              measures designed to protect information against
              unauthorized access, loss, misuse, alteration or
              disclosure.
            </p>

            <p className="leading-8 text-gray-600">
              However, no internet transmission, electronic
              storage system or online service can be guaranteed
              to be completely secure. Therefore, we cannot
              guarantee absolute security of information.
            </p>

          </div>

          {/* ==================================================
              DATA RETENTION
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              9. Data Retention
            </h2>

            <p className="leading-8 text-gray-600">
              We may retain information for as long as reasonably
              necessary to fulfil the purposes described in this
              Privacy Policy, provide services, maintain
              appropriate business records, resolve disputes,
              enforce agreements or comply with applicable legal
              obligations.
            </p>

          </div>

          {/* ==================================================
              YOUR CHOICES
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              10. Your Choices and Rights
            </h2>

            <p className="leading-8 text-gray-600">
              Depending on applicable law, you may have rights
              relating to your personal information, including
              the ability to request access, correction,
              deletion or information about how your data is
              processed.
            </p>

            <p className="leading-8 text-gray-600">
              You may also request that we stop or limit certain
              communications where applicable.
            </p>

            <p className="leading-8 text-gray-600">
              Requests can be made using the contact information
              provided below.
            </p>

          </div>

          {/* ==================================================
              CHILDREN
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              11. Children's Privacy
            </h2>

            <p className="leading-8 text-gray-600">
              Property Bouquet is intended for general audiences
              interested in real estate and is not specifically
              directed toward children.
            </p>

            <p className="leading-8 text-gray-600">
              We do not knowingly request or collect personal
              information from children in circumstances where
              such collection is prohibited by applicable law.
            </p>

          </div>

          {/* ==================================================
              EXTERNAL LINKS
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              12. External Links
            </h2>

            <p className="leading-8 text-gray-600">
              Property Bouquet may contain links to third-party
              websites, services or platforms. We are not
              responsible for the privacy practices, content or
              security of third-party websites.
            </p>

            <p className="leading-8 text-gray-600">
              We recommend reviewing the privacy policy of any
              third-party website before providing personal
              information.
            </p>

          </div>

          {/* ==================================================
              CHANGES
          ================================================== */}

          <div className="mt-14 space-y-5">

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              13. Changes to This Privacy Policy
            </h2>

            <p className="leading-8 text-gray-600">
              We may update this Privacy Policy from time to
              time to reflect changes in our services, technology,
              business practices or applicable legal
              requirements.
            </p>

            <p className="leading-8 text-gray-600">
              When changes are made, the updated version will be
              posted on this page with a revised "Last Updated"
              date.
            </p>

          </div>

          {/* ==================================================
              CONTACT
          ================================================== */}

          <div
            className="
              mt-14
              rounded-[28px]
              border
              border-[#D4AF37]/20
              bg-white
              p-7
              shadow-[0_15px_50px_rgba(0,0,0,0.05)]
              sm:p-10
            "
          >

            <h2 className="text-2xl font-bold text-[#081c15] sm:text-3xl">
              14. Contact Us
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              If you have questions, concerns or requests
              regarding this Privacy Policy or the handling of
              your information, please contact Property Bouquet
              through the contact information available on our
              website.
            </p>

            <div className="mt-7">

              <Link
                href="/contact"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#081c15]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#102d23]
                  hover:shadow-lg
                "
              >
                Contact Property Bouquet
              </Link>

            </div>

          </div>

          {/* ==================================================
              DISCLAIMER
          ================================================== */}

          <div className="mt-10 border-t border-gray-200 pt-8">

            <p className="text-sm leading-7 text-gray-500">
              This Privacy Policy is provided for general
              informational purposes and describes the intended
              privacy practices of Property Bouquet. It should
              not be treated as legal advice. You should have
              this policy reviewed and adapted to your specific
              business operations and applicable legal
              requirements.
            </p>

          </div>

        </section>

        {/* ====================================================
            FOOTER NAVIGATION
        ==================================================== */}

        <section className="border-t border-gray-200 bg-white">

          <div
            className="
              mx-auto
              flex
              max-w-[1000px]
              flex-col
              gap-4
              px-5
              py-8
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-8
              lg:px-10
            "
          >

            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Property Bouquet.
              All rights reserved.
            </p>

            <div className="flex flex-wrap gap-5 text-sm">

              <Link
                href="/"
                className="text-gray-500 transition-colors hover:text-[#D4AF37]"
              >
                Home
              </Link>

              <Link
                href="/properties"
                className="text-gray-500 transition-colors hover:text-[#D4AF37]"
              >
                Properties
              </Link>

              <Link
                href="/developers"
                className="text-gray-500 transition-colors hover:text-[#D4AF37]"
              >
                Developers
              </Link>

              <Link
                href="/contact"
                className="text-gray-500 transition-colors hover:text-[#D4AF37]"
              >
                Contact
              </Link>

            </div>

          </div>

        </section>
<Footer/>
      </main>
    </>
  );
}