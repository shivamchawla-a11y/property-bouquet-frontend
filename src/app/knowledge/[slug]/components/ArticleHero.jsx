"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Clock3,
  CalendarDays,
  Star,
  ChevronRight,
} from "lucide-react";

export default function ArticleHero() {
  return (
    <section className="relative bg-[#faf8f4]">

      <div className="max-w-[1450px] mx-auto">

        <div className="grid lg:grid-cols-2 min-h-[540px]">

          {/* LEFT */}

          <div className="flex items-center">

            <div className="px-6 lg:px-10 py-14 w-full">

              {/* Breadcrumb */}

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">

                <Link
                  href="/"
                  className="hover:text-[#0f3b2e]"
                >
                  Home
                </Link>

                <ChevronRight size={15} />

                <Link
                  href="/knowledge"
                  className="hover:text-[#0f3b2e]"
                >
                  Knowledge Centre
                </Link>

                <ChevronRight size={15} />

                <Link
                  href="/knowledge"
                  className="hover:text-[#0f3b2e]"
                >
                  Buying Guides
                </Link>

                <ChevronRight size={15} />

                <span className="text-[#0f3b2e] font-medium">
                  Documents Required
                </span>

              </div>

              {/* Badge */}

              <span
                className="
                inline-flex
                items-center
                px-4
                py-1.5
                rounded-full
                bg-[#0f3b2e]
                text-white
                text-xs
                uppercase
                tracking-[2px]
                font-semibold
                "
              >
                Buying Guide
              </span>

              {/* Heading */}

              <h1
                className="
                mt-6
                text-[54px]
                leading-[1.1]
                font-serif
                text-[#0f3b2e]
                max-w-[650px]
                "
              >
                Documents Required
                <br />
                to Buy Property in India
              </h1>

              {/* Description */}

              <p
                className="
                mt-7
                text-lg
                text-gray-600
                leading-8
                max-w-[650px]
                "
              >
                A complete checklist of all documents
                required for buying a property in India.
                Stay prepared and make your property
                buying process smooth and hassle-free.
              </p>

              {/* Meta */}

              <div className="flex flex-wrap gap-8 mt-10">

                <div className="flex items-center gap-3 text-gray-600">

                  <Clock3
                    size={18}
                    className="text-[#c9a64b]"
                  />

                  <span>
                    12 Min Read
                  </span>

                </div>

                <div className="flex items-center gap-3 text-gray-600">

                  <Star
                    size={18}
                    className="text-[#c9a64b]"
                  />

                  <span>
                    Beginner Friendly
                  </span>

                </div>

                <div className="flex items-center gap-3 text-gray-600">

                  <CalendarDays
                    size={18}
                    className="text-[#c9a64b]"
                  />

                  <span>
                    Last Updated:
                    {" "}
                    May 20, 2024
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div className="relative h-[540px]">

            <Image
              src="/knowledge/article-hero.jpg"
              alt="Knowledge Hero"
              fill
              priority
              className="object-cover"
            />

            <div
              className="
              absolute
              inset-0
              bg-gradient-to-l
              from-transparent
              via-transparent
              to-[#faf8f4]
              "
            />

          </div>

        </div>

      </div>

    </section>
  );
}