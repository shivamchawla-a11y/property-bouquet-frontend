"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import "@/app/insights/article.css";

import {
  ChevronRight,
  CalendarDays,
  Clock3,
  Link2,
} from "lucide-react";

import { FaFacebook, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import AboutAuthor from "../components/AboutAuthor";
import TableOfContents from "../components/TableOfContents";
import LatestInsightsSidebar from "../components/LatestInsightsSidebar";
import CTAAdvisor from "../components/CTAAdvisor";
import TagsCard from "../components/TagsCard";

const API = "https://propertybouquet.com/api";

export default function InsightDetailPage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const articleRef = useRef(null);

  useEffect(() => {
    if (!slug) return;
    fetchArticle();
  }, [slug]);

  async function fetchArticle() {
    try {
      const res = await fetch(
        `${API}/news?status=published`,
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
      <section className="min-h-screen bg-[#f7f4ee] pt-40">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="animate-pulse rounded-[36px] bg-white h-[900px]" />
        </div>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f7f4ee]">
        <h2
          className="text-5xl text-[#163629]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Article Not Found
        </h2>
      </section>
    );
  }

  return (
    <>
      <Navbar forceSolid/>

      <main className="bg-gradient-to-b from-[#f7f4ee] to-[#fcfbf8] pt-28 pb-24">

        <section className="max-w-[1400px] mx-auto px-5 lg:px-8">

          <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-10 items-start">

            {/* LEFT COLUMN */}

            <div className="bg-white rounded-[34px] border border-[#ece7dc] shadow-[0_30px_80px_rgba(0,0,0,.06)] overflow-hidden">

              <div className="px-8 lg:px-20 pt-14 lg:pt-20 pb-20">

                {/* Breadcrumb */}

                <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#8b8b8b]">

                  <Link href="/" className="hover:text-[#163629]">
                    Home
                  </Link>

                  <ChevronRight size={14} />

                  <Link
                    href="/insights"
                    className="hover:text-[#163629]"
                  >
                    Property Insights
                  </Link>

                  <ChevronRight size={14} />

                  <span>{article.category}</span>

                </div>

                {/* Category */}

                <div className="mt-8">

                  <span className="inline-flex items-center rounded-full bg-[#f5ede1] text-[#b88638] px-5 py-2 uppercase tracking-[2px] text-[11px] font-semibold">

                    {article.category}

                  </span>

                </div>

                {/* Title */}

                <h1
                  className="mt-7 text-4xl md:text-5xl xl:text-6xl leading-tight tracking-[-1px] text-[#163629] max-w-[900px]"
                  style={{
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {article.title}
                </h1>

                {/* Description */}

                <p className="mt-8 max-w-[820px] text-[21px] leading-10 text-[#666]">

                  {article.shortDescription}

                </p>

                {/* Meta */}

                <div
  className="
    mt-12
    rounded-3xl
    border
    border-[#ece7dc]
    bg-[#faf8f4]
    p-8
    !text-[#163629]
    xl:flex
    xl:justify-between
    flex
    flex-col
    gap-8
  "
>

                  <div className="flex flex-wrap items-center gap-8">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-full bg-[#163629] text-white flex items-center justify-center font-semibold text-lg">

                        {article.author?.charAt(0)}

                      </div>

                      <div>

                        <p className="font-semibold">

                          {article.author}

                        </p>

                        <p className="text-sm text-[#888]">

                          Property Bouquet Research Team

                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2 text-[#666]">

                      <CalendarDays size={16} />

                      <span>

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

                    <div className="flex items-center gap-2 text-[#666]">

                      <Clock3 size={16} />

                      <span>

                        {article.readTime} min read

                      </span>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="text-sm text-[#777]">
                      Share
                    </span>

                    {[FaFacebook, FaXTwitter, FaLinkedinIn].map(
  (Icon, index) => (
    <button
      key={index}
      className="
      w-11
      h-11
      rounded-full
      border
      border-[#d9d2c7]
      bg-white
      text-[#163629]
      hover:bg-[#163629]
      hover:text-white
      transition-all
      duration-300
      flex
      items-center
      justify-center
      shadow-sm
      "
    >
      <Icon size={16} />
    </button>
  )
)}
                    <button
className="
w-11
h-11
rounded-full
border
border-[#d9d2c7]
bg-white
text-[#163629]
hover:bg-[#163629]
hover:text-white
transition-all
duration-300
flex
items-center
justify-center
shadow-sm
"
>

                      <Link2 size={17} />

                    </button>

                  </div>

                </div>

                {/* Hero Image */}

<div className="mt-16">

  <figure
    className="
    relative
    overflow-hidden
    rounded-[36px]
    border
    border-[#e8e1d5]
    bg-[#f7f4ee]
    shadow-[0_40px_90px_rgba(0,0,0,.12)]
    "
  >

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
      h-auto
      max-h-[700px]
      object-contain
      bg-[#f7f4ee]
      transition-transform
      duration-700
      hover:scale-[1.02]
      "
    />

  </figure>

</div>

                {/* ARTICLE CONTENT STARTS HERE */}
{/* ==========================================
    ARTICLE BODY
========================================== */}

{/* ==========================================
ARTICLE BODY
========================================== */}

<br />
<br />

<div className="max-w-[760px] mx-auto">

    <div
  ref={articleRef}
  className="article-content mt-16"
  dangerouslySetInnerHTML={{
    __html: (article.content || "")
      .replace(/&nbsp;/g, " ")
      .replace(/\u00A0/g, " "),
  }}
/>

</div>
{/* ==========================================
AUTHOR QUOTE
========================================== */}

<div
  className="
  mt-24
  rounded-[34px]
  bg-gradient-to-br
  from-[#163629]
  to-[#214a39]
  text-white
  p-10
  lg:p-14
  flex
  flex-col
  lg:flex-row
  gap-8
  items-start
  "
>

  <div
    className="
    w-20
    h-20
    rounded-full
    bg-[#b88638]
    flex
    items-center
    justify-center
    text-3xl
    font-semibold
    shrink-0
    "
  >
    {article.author?.charAt(0)}
  </div>

  <div>

    <p
  className="
  text-[30px]
  leading-[50px]
  italic
  "
  style={{
    fontFamily: "Georgia, serif",
  }}
>
  {article.authorQuote ||
    "Knowledge-backed real estate decisions create long-term wealth. Invest with research, not emotions."}
</p>

    <div className="mt-10">

      <h4 className="text-xl font-semibold">

        {article.author ||
  "Property Bouquet Research Team"}

      </h4>

      <p className="text-white/70 mt-2">
  {article.authorDesignation ||
    "Property Bouquet Research Expert"}
</p>

    </div>

  </div>

</div>

{/* ==========================================
WAS THIS HELPFUL
========================================== */}

<div
  className="
  mt-24
  rounded-[32px]
  border
  border-[#ece7dc]
  bg-[#faf8f4]
  p-10
  flex
  flex-col
  lg:flex-row
  justify-between
  items-center
  gap-8
  "
>

  <div>

    <h3
      className="text-[36px] text-[#163629]"
      style={{
        fontFamily: "Georgia, serif",
      }}
    >
      Was this article helpful?
    </h3>

    <p className="mt-3 text-[#777]">

      We'd love your feedback.

    </p>

  </div>

  <div className="flex gap-4">

<button
  className="
    h-12
    px-8
    rounded-full
    border
    border-[#d7d1c7]
    bg-white
    text-[#163629]
    font-medium
    hover:bg-[#163629]
    hover:text-white
    transition-all
    duration-300
  "
>
  👍 Yes
</button>

<button
  className="
    h-12
    px-8
    rounded-full
    border
    border-[#d7d1c7]
    bg-white
    text-[#163629]
    font-medium
    hover:bg-[#163629]
    hover:text-white
    transition-all
    duration-300
  "
>
  👎 No
</button>

  </div>

</div>

{/* ==========================================
PREVIOUS / NEXT
========================================== */}

<div className="mt-24 grid md:grid-cols-2 gap-8">

  <div
    className="
    rounded-[30px]
    border
    border-[#ece7dc]
    p-10
    hover:-translate-y-1
    hover:shadow-xl
    transition-all
    duration-300
    cursor-pointer
    "
  >

    <p className="uppercase tracking-[3px] text-[11px] text-[#999]">

      Previous Article

    </p>

    <h3
      className="
      mt-6
      text-[30px]
      leading-10
      text-[#163629]
      "
      style={{
        fontFamily: "Georgia, serif",
      }}
    >
      Previous Article

    </h3>

  </div>

  <div
    className="
    rounded-[30px]
    border
    border-[#ece7dc]
    p-10
    text-right
    hover:-translate-y-1
    hover:shadow-xl
    transition-all
    duration-300
    cursor-pointer
    "
  >

    <p className="uppercase tracking-[3px] text-[11px] text-[#999]">

      Next Article

    </p>

    <h3
      className="
      mt-6
      text-[30px]
      leading-10
      text-[#163629]
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
          </div>

            {/* ==========================
    LUXURY RIGHT SIDEBAR
========================== */}

<aside
  className="
  hidden
  lg:block
  sticky
  top-28
  self-start
  "
>

  <div
    className="
    space-y-8
    rounded-[36px]
    "
  >
    <TableOfContents
  article={article}
  articleRef={articleRef}
/>

    <AboutAuthor
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

  </div>

</aside>
          </div>

        </section>

      </main>

      {/* ==========================================
          LUXURY BOTTOM CTA
      ========================================== */}

      <section className="relative overflow-hidden bg-[#163629]">

        <div
          className="
          absolute
          -top-24
          -right-24
          w-80
          h-80
          rounded-full
          bg-[#b88638]/10
          blur-3xl
          "
        />

        <div
          className="
          absolute
          -bottom-20
          -left-20
          w-72
          h-72
          rounded-full
          bg-white/5
          blur-3xl
          "
        />

        <div className="relative max-w-[1280px] mx-auto px-8 py-28">

          <div className="max-w-[760px]">

            <span
              className="
              inline-block
              uppercase
              tracking-[4px]
              text-[#b88638]
              text-xs
              font-semibold
              "
            >
              Property Bouquet
            </span>

            <h2
              className="
              mt-6
              text-5xl
              md:text-6xl
              leading-tight
              text-white
              "
              style={{
                fontFamily: "Georgia, serif",
              }}
            >
              Discover India's Finest Luxury
              Properties With Confidence.
            </h2>

            <p
              className="
              mt-8
              text-xl
              leading-9
              text-white/75
              max-w-[640px]
              "
            >
              Exclusive residences, investment advisory,
              off-market opportunities and market intelligence
              curated for discerning buyers.
            </p>

            <div className="mt-12 flex flex-wrap gap-5">

              <Link
                href="/contact"
                className="
                inline-flex
                items-center
                justify-center
                h-14
                px-10
                rounded-full
                bg-[#b88638]
                text-black
                font-semibold
                hover:scale-105
                transition-all
                duration-300
                "
              >
                Book Private Consultation
              </Link>

              <Link
                href="/properties"
                className="
                inline-flex
                items-center
                justify-center
                h-14
                px-10
                rounded-full
                border
                border-white/20
                text-white
                hover:bg-white
                hover:text-[#163629]
                transition-all
                duration-300
                "
              >
                Explore Properties
              </Link>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </>

  );

}

