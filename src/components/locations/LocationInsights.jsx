"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


/* =========================================================
   LOCATION INSIGHTS
   ========================================================= */

export default function LocationInsights() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     EMBLA AUTOPLAY
     ========================================================= */

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
    },
    [autoplay]
  );


  /* =========================================================
     FETCH INSIGHTS
     ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function fetchInsights() {
      try {
        setLoading(true);

        /*
         * IMPORTANT:
         *
         * Your Insights are stored in the NEWS collection.
         *
         * Backend:
         * GET /api/news
         *
         * Query:
         * ?status=published
         *
         * Your controller already applies:
         *
         * isDeleted = false
         *
         * unless all=true or trash=true is supplied.
         */

        const response = await fetch(
          "/api/news?status=published",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch insights"
          );
        }

        const list = Array.isArray(data?.data)
          ? data.data
          : [];

        /*
         * Safety filtering.
         *
         * We still check status/isDeleted on the
         * frontend even though the backend already
         * handles it.
         */

        const publishedInsights = list
          .filter(
            (item) =>
              item &&
              item.status === "published" &&
              item.isDeleted !== true
          )
          .sort((a, b) => {
            const dateA = new Date(
              a?.publishDate ||
                a?.createdAt ||
                0
            ).getTime();

            const dateB = new Date(
              b?.publishDate ||
                b?.createdAt ||
                0
            ).getTime();

            return dateB - dateA;
          });

        if (!cancelled) {
          setArticles(publishedInsights);
        }
      } catch (error) {
        console.error(
          "LOCATION INSIGHTS FETCH ERROR:",
          error
        );

        if (!cancelled) {
          setArticles([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInsights();

    return () => {
      cancelled = true;
    };
  }, []);


  /* =========================================================
     IMAGE URL RESOLVER
     ========================================================= */

  function getImageUrl(article) {
    /*
     * Different versions of your content can potentially
     * use different image field names.
     *
     * We therefore check all likely fields.
     */

    const rawImage =
      article?.image ||
      article?.featuredImage ||
      article?.coverImage ||
      article?.thumbnail ||
      "";

    if (!rawImage) {
      return "";
    }

    const value = String(rawImage).trim();

    if (!value) {
      return "";
    }

    /*
     * Cloudinary / external URL
     */

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    /*
     * Protocol-relative URL
     */

    if (value.startsWith("//")) {
      return `https:${value}`;
    }

    /*
     * Already an API path.
     *
     * Example:
     * /api/uploads/news/image.jpg
     */

    if (value.startsWith("/api/")) {
      return value;
    }

    /*
     * Backend-relative image.
     *
     * Example:
     *
     * /uploads/news/image.jpg
     *
     * becomes:
     *
     * /api/uploads/news/image.jpg
     */

    if (value.startsWith("/")) {
      return `/api${value}`;
    }

    /*
     * Bare relative path
     */

    return `/api/${value}`;
  }


  /* =========================================================
     DATE FORMAT
     ========================================================= */

  function formatDate(date) {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }


  /* =========================================================
     CAROUSEL CONTROLS
     ========================================================= */

  const handlePrevious = () => {
    emblaApi?.scrollPrev();
  };

  const handleNext = () => {
    emblaApi?.scrollNext();
  };


  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <section
        className="
          relative
          overflow-hidden
          bg-[#f7f3ee]
          py-20
          sm:py-24
          lg:py-28
        "
        style={{
          color: "#171717",
        }}
      >
        <div
          className="
            mx-auto
            max-w-[1280px]
            px-5
            sm:px-8
          "
        >
          {/* Header skeleton */}

          <div className="mb-12">
            <div
              className="
                h-3
                w-44
                animate-pulse
                rounded-full
                bg-black/[0.07]
              "
            />

            <div
              className="
                mt-5
                h-12
                w-[380px]
                max-w-full
                animate-pulse
                rounded-xl
                bg-black/[0.07]
              "
            />

            <div
              className="
                mt-3
                h-12
                w-[250px]
                max-w-full
                animate-pulse
                rounded-xl
                bg-black/[0.07]
              "
            />
          </div>


          {/* Card skeletons */}

          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-black/[0.05]
                  bg-white
                "
              >
                <div
                  className="
                    aspect-[16/10]
                    animate-pulse
                    bg-[#e8e1d7]
                  "
                />

                <div className="p-6">
                  <div
                    className="
                      h-2
                      w-24
                      animate-pulse
                      rounded-full
                      bg-black/[0.07]
                    "
                  />

                  <div
                    className="
                      mt-5
                      h-5
                      w-[90%]
                      animate-pulse
                      rounded
                      bg-black/[0.07]
                    "
                  />

                  <div
                    className="
                      mt-2
                      h-5
                      w-[65%]
                      animate-pulse
                      rounded
                      bg-black/[0.07]
                    "
                  />

                  <div
                    className="
                      mt-7
                      h-px
                      w-full
                      bg-black/[0.06]
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }


  /* =========================================================
     EMPTY STATE
     ========================================================= */

  if (!articles.length) {
    return null;
  }


  /* =========================================================
     MAIN SECTION
     ========================================================= */

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#f7f3ee]
        py-20
        sm:py-24
        lg:py-28
      "
      style={{
        color: "#171717",
      }}
    >

      {/* =====================================================
          BACKGROUND DECORATION
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[180px]
          -top-[180px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#c89d58]/[0.075]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-[180px]
          -left-[180px]
          h-[480px]
          w-[480px]
          rounded-full
          bg-[#17382f]/[0.045]
          blur-[120px]
        "
      />

      {/* subtle grid */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
          [background-size:42px_42px]
        "
      />


      {/* =====================================================
          MAIN CONTAINER
          ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1280px]
          px-5
          sm:px-8
          xl:px-10
        "
      >


        {/* ===================================================
            HEADER
            =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mb-10
            flex
            flex-col
            gap-7
            md:mb-12
            md:flex-row
            md:items-end
            md:justify-between
          "
        >

          {/* LEFT */}

          <div className="max-w-[760px]">

            {/* Eyebrow */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  h-px
                  w-9
                  bg-[#b4873d]
                "
              />

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[2.8px]
                  text-[#b4873d]
                "
              >
                PROPERTY BOUQUET INSIGHTS
              </p>
            </div>


            {/* Heading */}

            <h2
              className="
                mt-5
                text-[36px]
                leading-[1.06]
                tracking-[-0.8px]
                text-[#171717]
                sm:text-[44px]
                lg:text-[52px]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              Location & Real Estate
              <br />

              <span className="text-[#b4873d]">
                Insights
              </span>
            </h2>


            {/* Description */}

            <p
              className="
                mt-5
                max-w-[680px]
                text-[12px]
                leading-[1.9]
                text-black/55
                sm:text-[13px]
              "
            >
              Stay informed with curated real estate
              perspectives, market knowledge and
              property insights from Property Bouquet.
            </p>

          </div>


          {/* VIEW ALL */}

          <Link
            href="/insights"
            className="
              group
              inline-flex
              h-11
              shrink-0
              items-center
              gap-2
              self-start
              rounded-full
              border
              border-black/10
              bg-white
              px-5
              text-[10px]
              font-semibold
              uppercase
              tracking-[1.4px]
              text-[#171717]
              shadow-[0_10px_30px_rgba(0,0,0,0.045)]
              transition-all
              duration-300
              hover:border-[#17382f]
              hover:bg-[#17382f]
              hover:text-white
              md:self-auto
            "
          >
            View All Insights

            <ArrowUpRight
              size={15}
              strokeWidth={1.6}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />
          </Link>

        </motion.div>


        {/* ===================================================
            CAROUSEL HEADER / CONTROLS
            =================================================== */}

        <div
          className="
            mb-5
            flex
            items-center
            justify-between
          "
        >

          {/* Count */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#c89d58]
              "
            />

            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[1.8px]
                text-black/40
              "
            >
              {articles.length}{" "}
              {articles.length === 1
                ? "Insight"
                : "Insights"}
            </span>
          </div>


          {/* Arrows */}

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous insights"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.08]
                bg-white
                text-[#171717]
                shadow-[0_8px_25px_rgba(0,0,0,0.045)]
                transition-all
                duration-300
                hover:border-[#c89d58]
                hover:bg-[#c89d58]
                hover:text-white
              "
            >
              <ChevronLeft
                size={17}
                strokeWidth={1.6}
              />
            </button>


            <button
              type="button"
              onClick={handleNext}
              aria-label="Next insights"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.08]
                bg-white
                text-[#171717]
                shadow-[0_8px_25px_rgba(0,0,0,0.045)]
                transition-all
                duration-300
                hover:border-[#c89d58]
                hover:bg-[#c89d58]
                hover:text-white
              "
            >
              <ChevronRight
                size={17}
                strokeWidth={1.6}
              />
            </button>

          </div>

        </div>


        {/* ===================================================
            EMBLA VIEWPORT
            =================================================== */}

        <div
          ref={emblaRef}
          className="
            overflow-hidden
          "
        >

          {/* =================================================
              EMBLA CONTAINER
              ================================================= */}

          <div className="-ml-4 flex">

            {articles.map(
              (article, index) => {

                const title =
                  article?.title ||
                  "Property Insight";

                const imageUrl =
                  getImageUrl(article);

                const articleSlug =
                  article?.slug ||
                  article?._id ||
                  "";

                const category =
                  article?.category ||
                  "REAL ESTATE INSIGHT";

                const date =
                  formatDate(
                    article?.publishDate ||
                      article?.createdAt
                  );

                const description =
                  article?.shortDescription ||
                  article?.metaDescription ||
                  "";


                return (
                  <div
                    key={
                      article?._id ||
                      article?.slug ||
                      index
                    }
                    className="
                      min-w-0
                      flex-[0_0_100%]
                      pl-4
                      sm:flex-[0_0_50%]
                      lg:flex-[0_0_33.3333%]
                      xl:flex-[0_0_25%]
                    "
                  >

                    <motion.article
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      transition={{
                        duration: 0.55,
                        delay:
                          (index % 4) * 0.07,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      className="h-full"
                    >

                      <Link
                        href={
                          articleSlug
                            ? `/insights/${articleSlug}`
                            : "/insights"
                        }
                        className="
                          group
                          block
                          h-full
                        "
                      >

                        <div
                          className="
                            relative
                            flex
                            h-full
                            min-h-[500px]
                            flex-col
                            overflow-hidden
                            rounded-[30px]
                            border
                            border-black/[0.055]
                            bg-white
                            shadow-[0_18px_55px_rgba(0,0,0,0.045)]
                            transition-all
                            duration-500
                            group-hover:-translate-y-2
                            group-hover:shadow-[0_30px_75px_rgba(0,0,0,0.10)]
                          "
                        >

                          {/* =================================================
                              IMAGE
                              ================================================= */}

                          <div
                            className="
                              relative
                              aspect-[16/10]
                              shrink-0
                              overflow-hidden
                              bg-[#e8e1d7]
                            "
                          >

                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={title}
                                loading={
                                  index < 2
                                    ? "eager"
                                    : "lazy"
                                }
                                onError={(event) => {
                                  /*
                                   * Hide broken image instead
                                   * of showing a broken-image
                                   * icon.
                                   */
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                  transition-transform
                                  duration-[900ms]
                                  ease-out
                                  group-hover:scale-[1.07]
                                "
                              />
                            ) : (
                              <div
                                className="
                                  flex
                                  h-full
                                  w-full
                                  items-center
                                  justify-center
                                  bg-gradient-to-br
                                  from-[#eee8df]
                                  to-[#dcd4c8]
                                "
                              >
                                <div
                                  className="
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#c89d58]/30
                                    bg-white/50
                                  "
                                >
                                  <BookOpen
                                    size={25}
                                    strokeWidth={1.2}
                                    className="text-[#b4873d]"
                                  />
                                </div>
                              </div>
                            )}


                            {/* Image overlay */}

                            <div
                              className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/55
                                via-black/[0.05]
                                to-transparent
                              "
                            />



                            {/* Arrow */}

                            <div
                              className="
                                absolute
                                right-5
                                top-5
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/25
                                bg-black/20
                                text-white
                                backdrop-blur-md
                                transition-all
                                duration-300
                                group-hover:border-[#c89d58]
                                group-hover:bg-[#c89d58]
                                group-hover:text-[#17382f]
                              "
                            >
                              <ArrowUpRight
                                size={15}
                                strokeWidth={1.6}
                                className="
                                  transition-transform
                                  duration-300
                                  group-hover:translate-x-0.5
                                  group-hover:-translate-y-0.5
                                "
                              />
                            </div>

                          </div>


                          {/* =================================================
                              CARD CONTENT
                              ================================================= */}

                          <div
                            className="
                              flex
                              flex-1
                              flex-col
                              p-6
                              sm:p-7
                            "
                          >

                            {/* Meta */}

                            <div
                              className="
                                flex
                                min-h-[20px]
                                flex-wrap
                                items-center
                                gap-3
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  gap-1.5
                                  text-[#b4873d]
                                "
                              >
                                <BookOpen
                                  size={12}
                                  strokeWidth={1.5}
                                />

                                <span
                                  className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[1.4px]
                                    text-[#b4873d]
                                  "
                                >
                                  Insight
                                </span>
                              </div>


                              {date && (
                                <>
                                  <span
                                    className="
                                      h-3
                                      w-px
                                      bg-black/10
                                    "
                                  />

                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-1.5
                                      text-black/40
                                    "
                                  >
                                    <CalendarDays
                                      size={11}
                                      strokeWidth={1.4}
                                    />

                                    <span
                                      className="
                                        text-[8px]
                                        font-medium
                                        uppercase
                                        tracking-[1px]
                                        text-black/40
                                      "
                                    >
                                      {date}
                                    </span>
                                  </div>
                                </>
                              )}

                            </div>


                            {/* Title */}

                            <h3
                              className="
                                mt-4
                                line-clamp-2
                                min-h-[54px]
                                text-[20px]
                                leading-[1.3]
                                text-[#171717]
                                transition-colors
                                duration-300
                                group-hover:text-[#8f682e]
                                sm:text-[21px]
                              "
                              style={{
                                fontFamily:
                                  "Georgia, 'Times New Roman', serif",
                              }}
                            >
                              {title}
                            </h3>


                            {/* Description */}

                            <p
                              className="
                                mt-3
                                line-clamp-3
                                min-h-[63px]
                                text-[11px]
                                leading-[1.8]
                                text-black/50
                              "
                            >
                              {description ||
                                "Explore real estate perspectives, market knowledge and property insights from Property Bouquet."}
                            </p>


                            {/* Bottom */}

                            <div
                              className="
                                mt-auto
                                pt-7
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  justify-between
                                  border-t
                                  border-black/[0.065]
                                  pt-4
                                "
                              >

                                <span
                                  className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[1.7px]
                                    text-black/40
                                    transition-colors
                                    duration-300
                                    group-hover:text-[#b4873d]
                                  "
                                >
                                  Read Insight
                                </span>


                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-1
                                    text-[#b4873d]
                                  "
                                >

                                  <span
                                    className="
                                      hidden
                                      text-[9px]
                                      font-semibold
                                      uppercase
                                      tracking-[1px]
                                      sm:inline
                                    "
                                  >
                                    Explore
                                  </span>

                                  <ChevronRight
                                    size={15}
                                    strokeWidth={1.5}
                                    className="
                                      transition-transform
                                      duration-300
                                      group-hover:translate-x-1
                                    "
                                  />

                                </div>

                              </div>

                            </div>

                          </div>


                          {/* =================================================
                              PREMIUM BORDER
                              ================================================= */}

                          <div
                            className="
                              pointer-events-none
                              absolute
                              inset-0
                              rounded-[30px]
                              border
                              border-white/60
                            "
                          />

                        </div>

                      </Link>

                    </motion.article>

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* ===================================================
            BOTTOM CTA
            =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.55,
          }}
          className="
            mt-7
            overflow-hidden
            rounded-[28px]
            border
            border-[#17382f]/10
            bg-[#17382f]
            px-6
            py-6
            sm:px-8
            sm:py-7
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <div>

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[2.2px]
                  text-[#c89d58]
                "
              >
                PROPERTY KNOWLEDGE
              </p>

              <h3
                className="
                  mt-2
                  text-[20px]
                  leading-[1.3]
                  text-white
                  sm:text-[23px]
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Explore more perspectives before
                your next property decision.
              </h3>

            </div>


            <Link
              href="/insights"
              className="
                group
                inline-flex
                h-11
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#c89d58]
                px-5
                text-[9px]
                font-bold
                uppercase
                tracking-[1.5px]
                text-[#17382f]
                transition-all
                duration-300
                hover:bg-[#d5ad6b]
              "
            >
              Explore Insights

              <ArrowUpRight
                size={15}
                strokeWidth={1.7}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>

          </div>

        </motion.div>

      </div>
    </section>
  );
}