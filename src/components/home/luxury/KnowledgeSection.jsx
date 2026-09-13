"use client";

import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function LuxuryInsightsSection({
  onConsultationClick,
}) {
  const [investment, setInvestment] = useState(100000000);
  const [years, setYears] = useState(5);
  const [appreciation, setAppreciation] = useState(20);

  const [latestInsights, setLatestInsights] = useState([]);
  const [knowledgeArticles, setKnowledgeArticles] =
    useState([]);

  // ============================================================
  // INVESTMENT CALCULATIONS
  // ============================================================

  const projectedValue =
    investment *
    Math.pow(
      1 + appreciation / 100,
      years
    );

  const totalReturns =
    projectedValue - investment;

  const roi =
    ((projectedValue - investment) /
      investment) *
    100;

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹ ${(value / 10000000).toFixed(2)} Cr`;
    }

    if (value >= 100000) {
      return `₹ ${(value / 100000).toFixed(2)} L`;
    }

    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  // ============================================================
  // EMBLA AUTOPLAY
  // ============================================================

  const autoplay = Autoplay({
    delay: 3500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] =
    useEmblaCarousel(
      {
        loop: true,
        align: "start",
        slidesToScroll: 1,
      },
      [autoplay]
    );

  // ============================================================
  // CAROUSEL ARROWS
  // ============================================================

  const handlePrev = () => {
    emblaApi?.scrollPrev();
  };

  const handleNext = () => {
    emblaApi?.scrollNext();
  };

  // ============================================================
  // FETCH INSIGHTS
  // ============================================================

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch(
          "/api/news",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (res.ok) {
          const latest =
            data.data
              ?.filter(
                (item) =>
                  item.status === "published" &&
                  !item.isDeleted
              )
              .sort(
                (a, b) =>
                  new Date(b.createdAt) -
                  new Date(a.createdAt)
              )
              .slice(0, 3) || [];

          setLatestInsights(latest);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInsights();
  }, []);

  // ============================================================
  // FETCH KNOWLEDGE ARTICLES
  // ============================================================

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch(
          "/api/knowledge",
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (data.success) {
          const published =
            data.data
              ?.filter(
                (item) =>
                  item.status === "published" &&
                  !item.isDeleted
              ) || [];

          setKnowledgeArticles(
            published.slice(0, 5)
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchKnowledge();
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="px-5 md:px-8 xl:px-10 py-6">
      <div className="max-w-[1440px] mx-auto">

        <div
          className="
            relative
            overflow-hidden
            rounded-[40px]
            border
            border-white/30
            bg-[#f8f5ef]
            shadow-[0_35px_100px_rgba(0,0,0,0.08)]
          "
        >

          {/* ==================================================
              BACKGROUND GLOWS
          ================================================== */}

          <div
            className="
              absolute
              -top-32
              -left-32
              w-[420px]
              h-[420px]
              bg-[#c89d58]/10
              rounded-full
              blur-3xl
            "
          />

          <div
            className="
              absolute
              bottom-[-180px]
              right-[-120px]
              w-[420px]
              h-[420px]
              bg-emerald-950/10
              rounded-full
              blur-3xl
            "
          />

          {/* ==================================================
              GRID LINES
          ================================================== */}

          <div
            className="
              absolute
              inset-0
              opacity-[0.03]
              bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
              bg-[size:38px_38px]
            "
          />

          {/* ==================================================
              TOP CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-10
              text-center
              px-6
              md:px-10
              pt-16
              md:pt-20
              pb-14
            "
          >

            {/* BADGE */}

            <div
              className="
                inline-flex
                items-center
                gap-3
                px-5
                py-2.5
                rounded-full
                bg-white/60
                backdrop-blur-2xl
                border
                border-white
                shadow-[0_10px_30px_rgba(0,0,0,0.05)]
              "
            >

              <div className="relative">

                <div
                  className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-[#c89d58]
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    rounded-full
                    bg-[#c89d58]
                    animate-ping
                    opacity-60
                  "
                />

              </div>

              <p
                className="
                  text-[10px]
                  tracking-[3px]
                  uppercase
                  text-black/55
                  font-semibold
                "
              >
                Real Estate Decoded
              </p>

            </div>

            {/* HEADING */}

            <h2
              className="
                mt-8
                text-[40px]
                md:text-[58px]
                xl:text-[66px]
                leading-[1.05]
                tracking-[-2px]
                text-[#161616]
              "
              style={{
                fontFamily:
                  "Georgia, Times New Roman, serif",
              }}
            >
              Clarity. Knowledge.
              <br />

              <span className="text-[#b98b3c]">
                Better Decisions
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-7
                max-w-[760px]
                mx-auto
                text-[14px]
                md:text-[15px]
                leading-[2]
                text-black/55
              "
            >
              Discover premium insights, luxury investment
              strategies, high-growth micro-markets and
              curated advisory content crafted for modern
              wealth creators and elite investors.
            </p>

            {/* BUTTON */}

            <Link
              href="/knowledge"
              className="
                group
                relative
                overflow-hidden
                mt-9
                inline-flex
                items-center
                gap-4
                h-[56px]
                px-8
                rounded-full
                bg-[#081512]
                text-white
                text-[12px]
                tracking-[2px]
                uppercase
                font-semibold
                shadow-[0_18px_45px_rgba(0,0,0,0.18)]
                hover:scale-[1.03]
                transition-all
                duration-500
              "
            >

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#c89d58]/20
                  via-transparent
                  to-[#c89d58]/10
                  opacity-0
                  group-hover:opacity-100
                  transition
                  duration-500
                "
              />

              <span className="relative z-10">
                Explore All Articles
              </span>

              <div
                className="
                  relative
                  z-10
                  w-8
                  h-8
                  rounded-full
                  bg-[#c89d58]
                  flex
                  items-center
                  justify-center
                  group-hover:translate-x-1
                  transition
                  duration-300
                "
              >
                <ArrowRight size={14} />
              </div>

            </Link>

          </div>

          {/* ==================================================
              ARTICLE CAROUSEL
          ================================================== */}

          <div
            className="
              relative
              z-10
              px-6
              md:px-10
              pb-12
            "
          >

            {/* ==================================================
                CAROUSEL ARROWS
            ================================================== */}

            <div
              className="
                flex
                justify-end
                gap-3
                mb-5
              "
            >

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous articles"
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-white
                  text-black
                  flex
                  items-center
                  justify-center
                  border
                  border-black/5
                  shadow-[0_8px_25px_rgba(0,0,0,0.06)]
                  hover:bg-[#c89d58]
                  hover:text-white
                  hover:border-[#c89d58]
                  transition-all
                  duration-300
                "
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next articles"
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-white
                  text-black
                  flex
                  items-center
                  justify-center
                  border
                  border-black/5
                  shadow-[0_8px_25px_rgba(0,0,0,0.06)]
                  hover:bg-[#c89d58]
                  hover:text-white
                  hover:border-[#c89d58]
                  transition-all
                  duration-300
                "
              >
                <ChevronRight size={18} />
              </button>

            </div>

            {/* ==================================================
                EMBLA VIEWPORT
            ================================================== */}

            <div
              ref={emblaRef}
              className="
                overflow-hidden
                w-full
              "
            >

              {/* ==================================================
                  EMBLA CONTAINER
              ================================================== */}

              <div className="flex -ml-4">

                {/* ==================================================
                    KNOWLEDGE ARTICLES
                ================================================== */}

                {knowledgeArticles.map(
                  (item, index) => (
                    <Link
                      key={
                        item._id ||
                        item.slug ||
                        index
                      }
                      href={`/knowledge/${item.slug}`}
                      className="
                        min-w-0
                        flex-[0_0_100%]
                        sm:flex-[0_0_50%]
                        lg:flex-[0_0_33.3333%]
                        xl:flex-[0_0_25%]
                        pl-4
                        block
                      "
                    >

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 40,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.5,
                          delay:
                            index * 0.07,
                        }}
                        viewport={{
                          once: true,
                        }}
                        whileHover={{
                          y: -10,
                          scale: 1.015,
                        }}
                        className={`
                          group
                          relative
                          overflow-hidden
                          rounded-[30px]
                          border
                          backdrop-blur-2xl
                          transition-all
                          duration-700
                          h-full
                          ${
                            index === 0
                              ? "bg-gradient-to-br from-[#041e19]/95 via-[#072922]/95 to-[#03110d]/95 border-[#c89d58]/20 shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
                              : "bg-white/55 border-white/70 shadow-[0_20px_55px_rgba(0,0,0,0.06)] hover:bg-white/75"
                          }
                        `}
                      >

                        {/* CARD GLOW */}

                        <div
                          className="
                            absolute
                            -top-16
                            -right-16
                            w-36
                            h-36
                            rounded-full
                            bg-[#c89d58]/10
                            blur-3xl
                            opacity-80
                            group-hover:scale-150
                            transition
                            duration-700
                          "
                        />

                        {/* SHINE EFFECT */}

                        <div
                          className="
                            absolute
                            top-0
                            -left-[130%]
                            w-[70%]
                            h-full
                            bg-gradient-to-r
                            from-transparent
                            via-white/15
                            to-transparent
                            rotate-[18deg]
                            group-hover:left-[150%]
                            transition-all
                            duration-[1300ms]
                          "
                        />

                        {/* ==================================================
                            CARD CONTENT
                        ================================================== */}

                        <div
                          className="
                            relative
                            z-10
                            flex
                            flex-col
                            h-full
                          "
                        >

                          {/* IMAGE */}

                          <div
                            className="
                              relative
                              aspect-[16/10]
                              overflow-hidden
                            "
                          >

                            <Image
                              src={
                                item.featuredImage ||
                                "/knowledge-placeholder.jpg"
                              }
                              alt={
                                item.title ||
                                "Knowledge article"
                              }
                              fill
                              className="
                                object-cover
                                transition
                                duration-700
                                group-hover:scale-110
                              "
                            />

                            <div
                              className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/60
                                via-black/10
                                to-transparent
                              "
                            />

                          </div>

                          {/* ==================================================
                              CONTENT
                          ================================================== */}

                          <div
                            className="
                              flex-1
                              p-6
                              flex
                              flex-col
                            "
                          >

                            {/* GOLD LINE */}

                            <div
                              className={`
                                w-12
                                h-[2px]
                                mb-6
                                ${
                                  index === 0
                                    ? "bg-[#c89d58]"
                                    : "bg-[#c89d58]/70"
                                }
                              `}
                            />

                            {/* TITLE */}

                            <h3
                              className={`
                                text-[20px]
                                leading-[1.35]
                                font-semibold
                                line-clamp-2
                                min-h-[56px]
                                ${
                                  index === 0
                                    ? "text-white"
                                    : "text-[#171717]"
                                }
                              `}
                            >
                              {item.title}
                            </h3>

                            {/* DESCRIPTION */}

                            <p
                              className={`
                                mt-5
                                text-[14px]
                                leading-7
                                line-clamp-3
                                ${
                                  index === 0
                                    ? "text-white/65"
                                    : "text-black/55"
                                }
                              `}
                            >
                              {item.shortDescription ||
                                item.metaDescription ||
                                "Luxury insights, investment opportunities and expert real estate guidance for premium buyers."}
                            </p>

                            {/* DATE + ARROW */}

                            <div
                              className="
                                mt-8
                                flex
                                items-center
                                justify-between
                              "
                            >

                              <span
                                className={`
                                  text-[11px]
                                  uppercase
                                  tracking-[2px]
                                  ${
                                    index === 0
                                      ? "text-white/45"
                                      : "text-black/45"
                                  }
                                `}
                              >
                                {new Date(
                                  item.createdAt
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>

                              <div
                                className={`
                                  w-11
                                  h-11
                                  rounded-full
                                  flex
                                  items-center
                                  justify-center
                                  transition-all
                                  duration-300
                                  ${
                                    index === 0
                                      ? "bg-[#c89d58] text-black"
                                      : "bg-[#f3ece0] text-[#b98b3c] group-hover:bg-[#c89d58] group-hover:text-white"
                                  }
                                `}
                              >
                                <ChevronRight
                                  size={17}
                                  className="
                                    group-hover:translate-x-1
                                    transition
                                  "
                                />
                              </div>

                            </div>

                          </div>

                        </div>

                        {/* CARD BORDER */}

                        <div
                          className="
                            absolute
                            inset-0
                            rounded-[30px]
                            border
                            border-white/10
                            pointer-events-none
                          "
                        />

                      </motion.div>

                    </Link>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}