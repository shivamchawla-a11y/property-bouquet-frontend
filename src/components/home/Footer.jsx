"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGem,
  FaShieldAlt,
  FaUser,
  FaKey,
  FaBuilding,
  FaLock,
  FaArrowRight,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronDown,
  FaWhatsapp,
} from "react-icons/fa";

const exploreLinks = [
  { label: "Properties", href: "/properties" },
  { label: "Locations", href: "/locations" },
  { label: "Developers", href: "/developers" },
  { label: "New Launches", href: "/properties" },
  { label: "Luxury Homes", href: "/properties" },
  { label: "Commercial", href: "/properties" },
  { label: "Plots & Land", href: "/properties" },
  { label: "Farmhouses", href: "/properties" },
];

const knowledgeLinks = [
  "Buying Guides",
  "Investment Guides",
  "Area Guides",
  "Legal & RERA",
  "Home Loans",
  "NRI Corner",
  "Tax & Finance",
  "Real Estate Dictionary",
];

const insightLinks = [
  "Market Updates",
  "Infrastructure News",
  "Investment Analysis",
  "Project Reviews",
  "Luxury Living",
  "Expert Opinions",
  "Research Reports",
  "Podcast & Videos",
];

const featureCards = [
  {
    icon: <FaGem />,
    title: "Curated",
    subtitle: "Properties",
  },
  {
    icon: <FaShieldAlt />,
    title: "Trusted",
    subtitle: "Advisory",
  },
  {
    icon: <FaUser />,
    title: "Client",
    subtitle: "First",
  },
  {
    icon: <FaKey />,
    title: "Expert",
    subtitle: "Guidance",
  },
  {
    icon: <FaBuilding />,
    title: "Market",
    subtitle: "Insights",
  },
  {
    icon: <FaLock />,
    title: "Secure",
    subtitle: "& Transparent",
  },
];

export default function Footer() {
  const [collections, setCollections] = useState([]);
  const [showCollections, setShowCollections] = useState(false);
  const [collectionsLoading, setCollectionsLoading] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  // =====================================================
  // FETCH QUALIFYING COLLECTION PAGES
  // =====================================================

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setCollectionsLoading(true);

        const res = await fetch("/api/landing-pages", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        const pages = Array.isArray(data?.data) ? data.data : [];

        const qualifyingCollections = pages
          .filter(
            (page) =>
              page?.status === "published" &&
              page?.isDeleted !== true &&
              page?.ignoreGeneration !== true &&
              Number(page?.propertyCount || 0) >= 5
          )
          .sort(
            (a, b) =>
              Number(b.propertyCount || 0) -
              Number(a.propertyCount || 0)
          );

        setCollections(qualifyingCollections);
      } catch (error) {
        console.error("Failed to fetch collection pages:", error);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // =====================================================
  // NEWSLETTER SUBSCRIPTION
  // =====================================================

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (newsletterLoading) return;

    const email = newsletterEmail.trim().toLowerCase();

    if (!email) {
      setNewsletterMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }

    try {
      setNewsletterLoading(true);
      setNewsletterMessage("");

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "Website Footer",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Subscription failed");
      }

      setNewsletterMessage(
        result.duplicate
          ? "You're already subscribed."
          : "You're subscribed. Thank you!"
      );

      setNewsletterEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      setNewsletterMessage(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="border-t border-[#8e6b2e]/40 bg-[#07140F] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:px-14 lg:py-20">

        {/* ================= TOP SECTION ================= */}

        <div className="grid gap-12 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">

          {/* BRAND / LOGO */}

          <div className="border-r-0 pr-0 lg:border-r lg:border-[#8e6b2e]/40 lg:pr-10">

            {/* Logo with subtle background for contrast */}

            <Link
              href="/"
              aria-label="Property Bouquet home"
              className="
                inline-flex
                h-[62px]
                w-[245px]
                max-w-full
                items-center
                justify-center
                overflow-hidden
                rounded-md
                border
                border-[#C89B4F]/25
                bg-[#F7F3EE]
                px-3
                py-2
                shadow-[0_4px_18px_rgba(0,0,0,0.16)]
                transition-all
                duration-300
                hover:border-[#C89B4F]/60
              "
            >
              <Image
                src="/logowhole.webp"
                alt="Property Bouquet"
                width={1809}
                height={599}
                priority
                sizes="245px"
                className="block h-full w-full object-contain"
              />
            </Link>

            <p className="mt-7 max-w-[520px] text-[13px] leading-[1.85] text-white/75">
              Property Bouquet is a luxury real estate platform offering
              curated properties, expert insights &amp; intelligent tools
              to help you make confident decisions.
            </p>

            {/* SOCIAL LINKS */}

            <div className="mt-10 flex gap-4 sm:mt-14 sm:gap-6">

              <a
                href="https://www.facebook.com/profile.php?id=61592435707356"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Property Bouquet on Facebook"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full border border-[#B58A44]
                  text-lg text-[#C89B4F]
                  transition-all duration-300
                  hover:bg-[#C89B4F] hover:text-black
                  sm:h-12 sm:w-12
                "
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/propertybouquet/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Property Bouquet on Instagram"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full border border-[#B58A44]
                  text-lg text-[#C89B4F]
                  transition-all duration-300
                  hover:bg-[#C89B4F] hover:text-black
                  sm:h-12 sm:w-12
                "
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="
                  flex h-11 w-11 items-center justify-center
                  rounded-full border border-[#B58A44]
                  text-lg text-[#C89B4F]
                  transition-all duration-300
                  hover:bg-[#C89B4F] hover:text-black
                  sm:h-12 sm:w-12
                "
              >
                <FaYoutube />
              </a>

            </div>
          </div>

          {/* EXPLORE */}

          <div className="border-r-0 pr-0 lg:border-r lg:border-[#8e6b2e]/40 lg:pr-8">

            <h3 className="text-[11px] font-medium uppercase tracking-[3px] text-[#C89B4F]">
              Explore
            </h3>

            <div className="mb-7 mt-4 h-[2px] w-8 bg-[#C89B4F]" />

            <ul className="space-y-3 text-[12px] leading-[1.8] text-white/80">

              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors duration-300 hover:text-[#C89B4F]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* KNOWLEDGE CENTRE */}

          <div className="border-r-0 pr-0 lg:border-r lg:border-[#8e6b2e]/40 lg:pr-8">

            <h3 className="text-[11px] font-medium uppercase tracking-[3px] text-[#C89B4F]">
              Knowledge Centre
            </h3>

            <div className="mb-7 mt-4 h-[2px] w-8 bg-[#C89B4F]" />

            <ul className="space-y-3 text-[12px] leading-[1.8] text-white/80">

              {knowledgeLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="/knowledge"
                    className="transition-colors duration-300 hover:text-[#C89B4F]"
                  >
                    {item}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* PROPERTY INSIGHTS */}

          <div>

            <h3 className="text-[11px] font-medium uppercase tracking-[3px] text-[#C89B4F]">
              Property Insights
            </h3>

            <div className="mb-7 mt-4 h-[2px] w-8 bg-[#C89B4F]" />

            <ul className="space-y-3 text-[12px] leading-[1.8] text-white/80">

              {insightLinks.map((item) => (
                <li key={item}>
                  <Link
                    href="/insights"
                    className="transition-colors duration-300 hover:text-[#C89B4F]"
                  >
                    {item}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

        </div>

        {/* ================= FEATURES STRIP ================= */}

        <div className="mt-14 overflow-hidden rounded-xl border border-[#8e6b2e]/60 sm:mt-16">

          <div className="grid grid-cols-2 divide-x divide-y divide-[#8e6b2e]/30 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">

            {featureCards.map((item, index) => (
              <div
                key={index}
                className="
                  flex items-center gap-3 px-4 py-5
                  transition-colors duration-300
                  hover:bg-[#0b1c15]
                  sm:gap-4 sm:px-5 sm:py-6
                "
              >
                <div className="shrink-0 text-lg text-[#C89B4F] sm:text-xl">
                  {item.icon}
                </div>

                <div className="min-w-0">
                  <h4 className="text-[10px] uppercase tracking-[1.5px] text-white/90 sm:text-[11px] sm:tracking-[2px]">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-[9px] uppercase tracking-[1px] text-white/70 sm:text-[10px]">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* ================= LOWER SECTION ================= */}

        <div className="mt-14 grid gap-12 sm:mt-20 lg:grid-cols-[1.25fr_1.2fr_1.15fr_0.9fr]">

          {/* AMETHYST LANDBASE */}

          <div className="border-r-0 pr-0 lg:border-r lg:border-[#8e6b2e]/30 lg:pr-8">

            <p className="text-[11px] font-medium uppercase tracking-[3px] text-[#C89B4F]">
              A Brand By
            </p>

            <h3 className="mt-5 text-[18px] font-light tracking-wide text-white lg:text-[20px]">
              AMETHYST LANDBASE
            </h3>

            <div className="mb-7 mt-6 h-[2px] w-14 bg-[#C89B4F]" />

            <p className="text-[13px] leading-[1.9] text-white/70">
              Luxury Property Advisory &nbsp; | &nbsp; 5+ Years of Trust
              <br />
              1000+ Families Served &nbsp; | &nbsp; ₹1000+ Cr Advisory Value
            </p>
          </div>

          {/* NEWSLETTER */}

          <div className="border-r-0 pr-0 lg:border-r lg:border-[#8e6b2e]/30 lg:pr-8">

            <h3 className="text-[11px] font-medium uppercase tracking-[3px] text-[#C89B4F]">
              Stay Updated
            </h3>

            <p className="mt-6 text-[13px] leading-[1.8] text-white/70">
              Insights on luxury real estate, market trends, and exclusive
              opportunities.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-8">

              <div className="flex h-[50px] sm:h-[52px]">

                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  autoComplete="email"
                  disabled={newsletterLoading}
                  className="
                    min-w-0 flex-1 border border-[#8e6b2e]/50
                    bg-transparent px-3 text-[12px] text-white
                    outline-none placeholder:text-white/40
                    focus:border-[#C89B4F] disabled:opacity-50
                    sm:px-5 sm:text-[13px]
                  "
                />

                <button
                  type="submit"
                  disabled={newsletterLoading}
                  aria-label="Subscribe to newsletter"
                  className="
                    flex w-12 shrink-0 items-center justify-center
                    bg-[#C89B4F] text-black duration-300
                    hover:bg-[#d7ae63]
                    disabled:cursor-not-allowed disabled:opacity-50
                    sm:w-16
                  "
                >
                  {newsletterLoading ? (
                    <span
                      className="
                        h-4 w-4 animate-spin rounded-full
                        border-2 border-black/30 border-t-black
                      "
                    />
                  ) : (
                    <FaArrowRight />
                  )}
                </button>

              </div>

              {newsletterMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-[12px] leading-5 text-[#C89B4F]"
                >
                  {newsletterMessage}
                </p>
              )}

            </form>
          </div>

          {/* CONTACT */}

          <div>

            <h3 className="text-[11px] font-medium uppercase tracking-[3px] text-[#C89B4F]">
              Contact Us
            </h3>

            <div className="mt-8 space-y-5 text-[13px] leading-[1.8] text-white/80">

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-[#C89B4F]" />

                <a
                  href="tel:+919090106101"
                  className="transition-colors hover:text-[#C89B4F]"
                >
                  +91 9090 106 101
                </a>
              </div>

              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-1 shrink-0 text-[#C89B4F]" />

                <a
                  href="mailto:propertybouquet@gmail.com"
                  className="break-all transition-colors hover:text-[#C89B4F]"
                >
                  propertybouquet@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-[#C89B4F]" />

                <a
                  href="https://maps.app.goo.gl/fF46yKyzBrB5ajDb9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#C89B4F]"
                >
                  Suncity Success Tower, Golf Course Ext Road, Sector-65,
                  Gurugram, Haryana 122101
                </a>
              </div>

            </div>
          </div>

          {/* WHATSAPP CARD */}

          <a
            href="https://wa.me/919090106101?text=Hi%20Property%20Bouquet%2C%20I%27m%20interested%20in%20a%20property.%20Please%20assist%20me."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact a Property Expert on WhatsApp"
            className="
              flex h-full flex-col justify-between rounded-xl
              border border-[#8e6b2e]/60 p-5
              transition-all duration-300
              hover:border-[#C89B4F] hover:bg-[#0b1c15]
              sm:p-7
            "
          >

            <div className="flex items-start gap-4">

              <div
                className="
                  flex h-12 w-12 shrink-0 items-center justify-center
                  rounded-full border border-[#C89B4F]
                  text-2xl text-[#C89B4F]
                  transition-all duration-300
                  hover:bg-[#C89B4F] hover:text-black
                  sm:h-14 sm:w-14
                "
              >
                <FaWhatsapp />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-[10px] font-medium uppercase tracking-[2px] text-[#C89B4F] sm:text-[11px] sm:tracking-[3px]">
                  Talk to our
                </p>

                <h4 className="mt-1 text-[17px] font-light text-white sm:text-[18px]">
                  Property Expert
                </h4>

                <p className="mt-2 text-[13px] leading-6 text-white/60">
                  Get instant assistance on WhatsApp
                </p>

              </div>
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">

              <span className="text-[13px] text-white/80 sm:text-[14px]">
                +91 90901 06101
              </span>

              <FaArrowRight className="shrink-0 text-[#C89B4F] transition-transform duration-300 group-hover:translate-x-1" />

            </div>

          </a>

        </div>

        {/* ================= MORE COLLECTIONS ================= */}

        {collections.length > 0 && (
          <div className="mt-14 border-t border-[#8e6b2e]/30 pt-8 sm:mt-16">

            <div className="flex justify-center">

              <button
                type="button"
                onClick={() => setShowCollections((prev) => !prev)}
                aria-expanded={showCollections}
                className="
                  group inline-flex items-center gap-3 rounded-full
                  border border-[#8e6b2e]/60 px-6 py-3
                  text-[10px] font-medium uppercase tracking-[2px]
                  text-[#C89B4F] transition-all duration-300
                  hover:border-[#C89B4F] hover:bg-[#C89B4F]
                  hover:text-black sm:px-7 sm:text-[11px]
                  sm:tracking-[3px]
                "
              >
                <span>
                  {showCollections ? "Hide Collections" : "More Collections"}
                </span>

                <FaChevronDown
                  className={`text-[10px] transition-transform duration-300 ${
                    showCollections ? "rotate-180" : ""
                  }`}
                />
              </button>

            </div>

            {showCollections && (
              <div className="mt-8">

                <div className="mb-7 text-center">
                  <p className="text-[10px] uppercase tracking-[3px] text-[#C89B4F]">
                    Explore More
                  </p>

                  <h3 className="mt-2 text-[20px] font-light text-white">
                    Curated Property Collections
                  </h3>

                  <p className="mt-2 text-[12px] text-white/50">
                    Explore collections featuring at least 5 properties.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                  {collections.map((page) => (
                    <Link
                      key={page._id}
                      href={`/${page.slug}`}
                      className="
                        group rounded-xl border border-[#8e6b2e]/40
                        bg-[#091a14] px-5 py-4
                        transition-all duration-300
                        hover:border-[#C89B4F] hover:bg-[#0d2119]
                      "
                    >
                      <div className="flex items-center justify-between gap-4">

                        <div className="min-w-0">
                          <h4
                            className="
                              truncate text-[13px] font-medium text-white
                              transition-colors group-hover:text-[#C89B4F]
                            "
                          >
                            {page.title}
                          </h4>

                          <p className="mt-1 text-[11px] text-white/45">
                            {Number(page.propertyCount)} properties
                          </p>
                        </div>

                        <FaArrowRight
                          className="
                            shrink-0 text-[11px] text-[#C89B4F]
                            transition-transform group-hover:translate-x-1
                          "
                        />

                      </div>
                    </Link>
                  ))}

                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= BOTTOM BAR ================= */}

        <div className="mt-14 border-t border-[#8e6b2e]/30 pt-8 sm:mt-20">

          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-8">

            {/* COPYRIGHT */}

            <p className="text-center text-[12px] leading-[1.9] text-white/60 lg:text-left lg:text-[13px]">
              © {new Date().getFullYear()} Property Bouquet. All Rights Reserved.
            </p>

            {/* LEGAL LINKS */}

            <div className="flex flex-wrap items-center justify-center">

              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Use", href: "/terms-of-use" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "Sitemap", href: "/sitemap" },
              ].map((item, index, array) => (
                <div key={item.label} className="flex items-center">

                  <Link
                    href={item.href}
                    className="
                      px-3 py-2 text-[11px] text-white/65
                      transition-colors duration-300
                      hover:text-[#C89B4F]
                      sm:px-4 sm:text-[12px] lg:px-6
                    "
                  >
                    {item.label}
                  </Link>

                  {index !== array.length - 1 && (
                    <span className="text-[#8e6b2e]/50">|</span>
                  )}

                </div>
              ))}

            </div>

            {/* SECURITY */}

            <div className="flex items-center justify-center gap-3 text-white/65">

              <FaLock className="shrink-0 text-[#C89B4F]" />

              <span className="text-center text-[12px] sm:text-[13px]">
                Your data is 100% safe and secure
              </span>

            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}
