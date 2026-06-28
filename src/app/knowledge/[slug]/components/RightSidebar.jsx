"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Download,
  FileText,
  Tag,
  CalendarDays,
} from "lucide-react";

const relatedArticles = [
  {
    title: "Home Loan Eligibility Guide",
    image: "/knowledge/related1.jpg",
    category: "Home Loans",
    slug: "#",
  },
  {
    title: "Stamp Duty & Registration Charges",
    image: "/knowledge/related2.jpg",
    category: "Legal",
    slug: "#",
  },
  {
    title: "Complete Property Buying Checklist",
    image: "/knowledge/related3.jpg",
    category: "Buying Guide",
    slug: "#",
  },
];

const popularTopics = [
  "Buying Guide",
  "Luxury Homes",
  "Property Investment",
  "Home Loans",
  "Legal",
  "NRI",
  "Registration",
  "Tax",
];

export default function RightSidebar() {
  return (
    <div className="space-y-8 sticky top-28">

      {/* TALK TO ADVISOR */}

      <div className="rounded-3xl overflow-hidden bg-[#0f3b2e] text-white">

        <div className="relative h-56">

          <Image
            src="/knowledge/advisor.jpg"
            fill
            alt=""
            className="object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0f3b2e] via-[#0f3b2ecc] to-transparent" />

        </div>

        <div className="p-7 -mt-14 relative z-10">

          <h3 className="text-3xl font-serif text-[#d7b05b]">
            Need Expert
            <br />
            Advice?
          </h3>

          <p className="mt-5 text-gray-300 leading-8">

            Speak directly with our luxury
            property advisors for personalised
            investment guidance.

          </p>

          <button
            className="
            mt-7
            w-full
            rounded-xl
            bg-[#c9a64b]
            hover:bg-[#bb9741]
            transition
            py-4
            font-semibold
            flex
            justify-center
            items-center
            gap-3
            text-black
            "
          >

            Talk to an Advisor

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

      {/* DOWNLOAD */}

      <div className="bg-white rounded-3xl border border-[#ebe3d7] p-7">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#0f3b2e] text-white flex items-center justify-center">

            <Download size={22} />

          </div>

          <div>

            <h3 className="font-bold text-[#0f3b2e]">
              Download PDF
            </h3>

            <p className="text-sm text-gray-500">
              Offline Reading
            </p>

          </div>

        </div>

        <p className="mt-5 text-gray-600 leading-7">

          Save this complete guide as a PDF
          and access it anytime.

        </p>

        <button
          className="
          mt-6
          w-full
          rounded-xl
          border
          border-[#0f3b2e]
          py-3
          font-semibold
          text-[#0f3b2e]
          hover:bg-[#0f3b2e]
          hover:text-white
          transition
          "
        >
          Download Now
        </button>

      </div>

      {/* RELATED GUIDES */}

      <div className="bg-white rounded-3xl border border-[#ebe3d7] p-7">

        <div className="flex items-center gap-3 mb-6">

          <FileText
            size={20}
            className="text-[#0f3b2e]"
          />

          <h3 className="font-bold text-xl text-[#0f3b2e]">
            Related Guides
          </h3>

        </div>

        <div className="space-y-5">

          {relatedArticles.map((article, index) => (

            <Link
              key={index}
              href={article.slug}
              className="group flex gap-4"
            >

              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">

                <Image
                  src={article.image}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />

              </div>

              <div>

                <span className="text-xs uppercase tracking-wider text-[#c9a64b]">

                  {article.category}

                </span>

                <h4 className="mt-2 font-semibold text-[#0f3b2e] group-hover:text-[#c9a64b] transition leading-6">

                  {article.title}

                </h4>

              </div>

            </Link>

          ))}

        </div>

      </div>

      {/* POPULAR TOPICS */}

      <div className="bg-white rounded-3xl border border-[#ebe3d7] p-7">

        <div className="flex items-center gap-3 mb-6">

          <Tag
            size={20}
            className="text-[#0f3b2e]"
          />

          <h3 className="font-bold text-xl text-[#0f3b2e]">
            Popular Topics
          </h3>

        </div>

        <div className="flex flex-wrap gap-3">

          {popularTopics.map((topic) => (

            <button
              key={topic}
              className="
              px-4
              py-2
              rounded-full
              bg-[#f5f2ec]
              hover:bg-[#c9a64b]
              hover:text-black
              transition
              text-sm
              "
            >
              {topic}
            </button>

          ))}

        </div>

      </div>

      {/* LAST UPDATED */}

      <div className="rounded-3xl bg-[#f4efe7] p-6 border border-[#e9decd]">

        <div className="flex items-center gap-3">

          <CalendarDays
            size={18}
            className="text-[#0f3b2e]"
          />

          <span className="font-semibold text-[#0f3b2e]">

            Last Updated

          </span>

        </div>

        <p className="mt-3 text-gray-600">

          20 May 2024

        </p>

      </div>

    </div>
  );
}