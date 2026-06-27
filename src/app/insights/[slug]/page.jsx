"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/home/Navbar";
import "@/app/insights/article.css";

import {
  ChevronRight,
  CalendarDays,
  Clock3,
  Link2,
} from "lucide-react";

import { FaFacebook } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import AboutAuthor from "../components/AboutAuthor";
import TableOfContents from "../components/TableOfContents";
import LatestInsightsSidebar from "../components/LatestInsightsSidebar";
import CTAAdvisor from "../components/CTAAdvisor";
import TagsCard from "../components/TagsCard";
import Footer from "@/components/home/Footer";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://property-bouquet-backend.onrender.com";

export default function InsightDetailPage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchArticle();
  }, [slug]);

  async function fetchArticle() {
    try {
      const res = await fetch(
        `${API}/api/news?status=published`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error("Unable to fetch article");
      }

      const allArticles = data.data || [];

      setArticles(allArticles);

      const current = allArticles.find(
        (item) => item.slug === slug
      );

      if (!current) {
        notFound();
        return;
      }

      setArticle(current);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <section className="bg-[#faf8f4] min-h-screen">

          <div className="max-w-[1320px] mx-auto px-6 py-20">

            <div className="animate-pulse">

              <div className="w-40 h-3 rounded bg-gray-200 mb-8" />

              <div className="w-28 h-8 rounded bg-gray-200 mb-8" />

              <div className="w-3/4 h-14 rounded bg-gray-200 mb-5" />

              <div className="w-2/3 h-14 rounded bg-gray-200 mb-10" />

              <div className="w-1/2 h-5 rounded bg-gray-200 mb-3" />

              <div className="w-1/3 h-5 rounded bg-gray-200 mb-12" />

              <div className="rounded-3xl h-[600px] bg-gray-200" />

            </div>

          </div>

        </section>
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />

        <section className="py-40 bg-[#faf8f4]">

          <div className="max-w-6xl mx-auto text-center">

            <h2
              className="text-5xl text-[#163629]"
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              Article Not Found
            </h2>

            <p className="mt-6 text-gray-500">

              The requested article doesn't exist.

            </p>

            <Link
              href="/property-insights"
              className="
              inline-flex
              mt-10
              rounded-full
              bg-[#163629]
              px-8
              py-3
              text-white
              "
            >
              Back to Insights
            </Link>

          </div>

        </section>
      </>
    );
  }

  return (
    <>
      <Navbar forceSolid />

      <main
  className="
    bg-[#faf8f4]
    overflow-x-hidden
    pt-28
    lg:pt-32
    min-h-screen
    text-[#222]
  "
>

        <section className="py-8">

          <div className="max-w-[1320px] mx-auto px-5 lg:px-8">

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,780px)_360px] gap-16">

              {/* ===========================
                  LEFT COLUMN
              ============================ */}

              <div>

                {/* Breadcrumb */}

                <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#888]">

                  <Link
                    href="/"
                    className="hover:text-[#163629]"
                  >
                    Home
                  </Link>

                  <ChevronRight size={14} />

                  <Link
                    href="/property-insights"
                    className="hover:text-[#163629]"
                  >
                    Property Insights
                  </Link>

                  <ChevronRight size={14} />

                  <span>{article.category}</span>

                  <ChevronRight size={14} />

                  <span className="truncate">

                    {article.title}

                  </span>

                </div>

                {/* Category */}

                <div className="mt-8">

                  <span
                    className="
                    inline-flex
                    items-center
                    rounded
                    bg-[#f5ede1]
                    text-[#bb8735]
                    uppercase
                    tracking-[2px]
                    text-[11px]
                    font-semibold
                    px-3
                    py-1.5
                    "
                  >
                    {article.category}
                  </span>

                </div>

                {/* Title */}

                <h1
                  className="
                  mt-6
                  text-[56px]
                  leading-[64px]
                  text-[#163629]
                  font-normal
                  max-w-[760px]
                  "
                  style={{
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {article.title}
                </h1>

                {/* Description */}

                <p
                  className="
                  mt-6
                  max-w-[720px]
                  text-[19px]
                  leading-9
                  text-[#5c5c5c]
                  "
                >
                  {article.shortDescription}
                </p>

                {/* Meta Row starts here in Part 2 */}
                {/* ==========================================
    META ROW
========================================== */}

<div className="mt-8 border-b border-[#ece7dc] pb-8">

  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

    {/* Left */}

    <div className="flex flex-wrap items-center gap-8">

      {/* Author */}

      <div className="flex items-center gap-3">

        <div
          className="
          h-12
          w-12
          rounded-full
          bg-[#163629]
          flex
          items-center
          justify-center
          text-white
          font-semibold
          "
        >
          {article.author?.charAt(0)}
        </div>

        <div>

          <p className="font-semibold text-[15px] text-[#222]">

            {article.author}

          </p>

          <p className="text-[13px] text-[#777]">

            Property Bouquet Research Team

          </p>

        </div>

      </div>

      {/* Date */}

      <div className="flex items-center gap-2 text-[#777]">

        <CalendarDays size={16} />

        <span className="text-[14px]">

          {new Date(article.publishDate).toLocaleDateString(
            "en-US",
            {
              month: "long",
              day: "numeric",
              year: "numeric",
            }
          )}

        </span>

      </div>

      {/* Reading */}

      <div className="flex items-center gap-2 text-[#777]">

        <Clock3 size={16} />

        <span className="text-[14px]">

          {article.readTime} min read

        </span>

      </div>

    </div>

    {/* Share */}

    <div className="flex items-center gap-3">

      <span className="text-sm text-[#777]">

        Share

      </span>

      <button
        className="
        h-10
        w-10
        rounded-full
        border
        border-[#ddd]
        flex
        items-center
        justify-center
        hover:bg-[#163629]
        hover:text-white
        transition
        "
      >
        <FaFacebook size={15} />
      </button>

      <button
        className="
        h-10
        w-10
        rounded-full
        border
        border-[#ddd]
        flex
        items-center
        justify-center
        hover:bg-[#163629]
        hover:text-white
        transition
        "
      >
        <FaXTwitter size={14} />
      </button>

      <button
        className="
        h-10
        w-10
        rounded-full
        border
        border-[#ddd]
        flex
        items-center
        justify-center
        hover:bg-[#163629]
        hover:text-white
        transition
        "
      >
        <FaLinkedinIn size={15} />
      </button>

      <button
        className="
        h-10
        w-10
        rounded-full
        border
        border-[#ddd]
        flex
        items-center
        justify-center
        hover:bg-[#163629]
        hover:text-white
        transition
        "
      >
        <Link2 size={16} />
      </button>

    </div>

  </div>

</div>

{/* ==========================================
    FEATURED IMAGE
========================================== */}

<div className="mt-10 overflow-hidden rounded-2xl">

  <Image
    src={
      article.featuredImage ||
      "/placeholder-news.jpg"
    }
    alt={article.title}
    width={1600}
    height={900}
    priority
    className="
    w-full
    h-[560px]
    object-cover
    transition
    duration-500
    hover:scale-[1.03]
    "
  />

</div>

{/* ==========================================
    ARTICLE
========================================== */}

<article className="mt-14 text-[#333]">

  <div
    className="
    article-content
    luxury-article
    text-[#444]
    "
    dangerouslySetInnerHTML={{
      __html: article.content,
    }}
  />

  {/* Author Quote */}

  <div
    className="
    mt-14
    rounded-2xl
    border
    border-[#ece7dc]
    bg-[#fcfaf6]
    p-8
    "
  >

    <div className="flex gap-5">

      <div
        className="
        w-16
        h-16
        rounded-full
        bg-[#163629]
        flex
        items-center
        justify-center
        text-white
        font-semibold
        text-xl
        "
      >

        {article.author?.charAt(0)}

      </div>

      <div>

        <p
          className="
          text-[24px]
          leading-10
          italic
          text-[#1d1d1d]
          "
          style={{
            fontFamily: "Georgia, serif",
          }}
        >

          “Knowledge-backed real estate
          decisions create long-term wealth.
          Invest with research, not emotions.”

        </p>

        <p className="mt-6 font-semibold">

          — {article.author}

        </p>

        <p className="text-sm text-gray-500">

          Property Research Expert

        </p>

      </div>

    </div>

  </div>

  {/* Helpful section continues in Part 3 */}
    {/* ==========================================
      WAS THIS HELPFUL
  ========================================== */}

  <div
    className="
    mt-12
    rounded-2xl
    border
    border-[#ece7dc]
    bg-white
    p-7
    "
  >

    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

      <div>

        <h3
          className="text-[30px] text-[#163629]"
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Was this article helpful?
        </h3>

        <p className="mt-2 text-[#777]">

          We'd love to hear your feedback.

        </p>

      </div>

      <div className="flex gap-3">

        <button
          className="
          px-7
          h-11
          rounded-lg
          border
          border-[#d8d3ca]
          hover:bg-[#163629]
          hover:text-white
          transition
          "
        >
          👍 Yes
        </button>

        <button
          className="
          px-7
          h-11
          rounded-lg
          border
          border-[#d8d3ca]
          hover:bg-[#163629]
          hover:text-white
          transition
          "
        >
          👎 No
        </button>

      </div>

    </div>

  </div>

  {/* ==========================================
      PREVIOUS / NEXT
  ========================================== */}

  <div className="mt-16 pt-10 border-t border-[#ece7dc]">

    <div className="grid md:grid-cols-2 gap-10">

      <div>

        <p
          className="
          uppercase
          tracking-[2px]
          text-[11px]
          text-gray-400
          "
        >
          Previous Article
        </p>

        <h3
          className="
          mt-3
          text-[28px]
          leading-9
          text-[#163629]
          hover:text-[#b88638]
          transition
          cursor-pointer
          "
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Previous Article
        </h3>

      </div>

      <div className="text-left md:text-right">

        <p
          className="
          uppercase
          tracking-[2px]
          text-[11px]
          text-gray-400
          "
        >
          Next Article
        </p>

        <h3
          className="
          mt-3
          text-[28px]
          leading-9
          text-[#163629]
          hover:text-[#b88638]
          transition
          cursor-pointer
          "
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          Next Article
        </h3>

      </div>

    </div>

  </div>

</article>

{/* ============================
    RIGHT SIDEBAR
============================= */}

</div>

<aside
  className="
  hidden
  lg:block
  sticky
  top-24
  self-start
  space-y-6
  "
>

  <AboutAuthor
    article={article}
  />

  <TableOfContents
    article={article}
  />

  <LatestInsightsSidebar
    articles={articles}
    currentSlug={article.slug}
  />

  <CTAAdvisor />

  <TagsCard
    article={article}
  />

</aside>

</div>

</div>

</section>

</main>
<Footer/>
</>
);
}