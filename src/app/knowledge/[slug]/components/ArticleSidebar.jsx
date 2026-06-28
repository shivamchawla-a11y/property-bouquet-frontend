"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Landmark,
  Globe,
  Scale,
  TrendingUp,
  Building2,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function ArticleSidebar() {
  return (
    <div className="space-y-7">

      {/* KNOWLEDGE MENU */}

      <div className="bg-white rounded-2xl border border-[#ece6db] overflow-hidden shadow-sm">

        <div className="px-6 py-5 border-b bg-[#fbfaf8]">

          <h3 className="font-bold text-lg text-[#0f3b2e]">
            KNOWLEDGE CENTRE
          </h3>

        </div>

        <div>

          {/* BUYING GUIDES */}

          <div>

            <button className="w-full flex items-center justify-between px-6 py-4 bg-[#f4f4ef] border-b hover:bg-[#efefe8] transition">

              <div className="flex items-center gap-3">

                <BookOpen
                  size={18}
                  className="text-[#0f3b2e]"
                />

                <span className="font-semibold text-[#0f3b2e]">
                  Buying Guides
                </span>

              </div>

              <ChevronDown size={18} />

            </button>

            <div className="bg-white">

              <Link
                href="#"
                className="block px-12 py-3 text-gray-600 hover:bg-gray-50"
              >
                Home Buying Process
              </Link>

              <Link
                href="#"
                className="block px-12 py-3 bg-[#f5f5f0] font-semibold text-[#0f3b2e]"
              >
                Documents Required
              </Link>

              <Link
                href="#"
                className="block px-12 py-3 text-gray-600 hover:bg-gray-50"
              >
                Home Loan Guide
              </Link>

              <Link
                href="#"
                className="block px-12 py-3 text-gray-600 hover:bg-gray-50"
              >
                Stamp Duty &
                Registration
              </Link>

              <Link
                href="#"
                className="block px-12 py-3 text-gray-600 hover:bg-gray-50"
              >
                Property Legal Checklist
              </Link>

              <Link
                href="#"
                className="block px-12 py-3 text-gray-600 hover:bg-gray-50"
              >
                Agreement to Possession
              </Link>

            </div>

          </div>

          {/* CATEGORY */}

          {[
            {
              icon: Landmark,
              title: "Investment Guides",
            },
            {
              icon: Globe,
              title: "NRI Corner",
            },
            {
              icon: Scale,
              title: "Legal & RERA",
            },
            {
              icon: TrendingUp,
              title: "Market Insights",
            },
            {
              icon: Building2,
              title: "Developer Insights",
            },
            {
              icon: HelpCircle,
              title: "FAQs",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                className="
                w-full
                flex
                items-center
                justify-between
                px-6
                py-4
                border-t
                hover:bg-gray-50
                transition
                "
              >
                <div className="flex items-center gap-3">

                  <Icon
                    size={18}
                    className="text-[#0f3b2e]"
                  />

                  <span className="font-medium">
                    {item.title}
                  </span>

                </div>

                <ChevronRight size={17} />

              </button>
            );
          })}

        </div>

      </div>

      {/* ADVISOR CARD */}

      <div className="relative overflow-hidden rounded-2xl bg-[#08251d]">

        <Image
          src="/knowledge/sidebar-bg.png"
          alt=""
          fill
          className="object-cover opacity-20"
        />

        <div className="relative p-8">

          <h3 className="text-4xl font-serif text-[#d9b15f] leading-tight">

            Need Expert
            <br />
            Guidance?

          </h3>

          <p className="mt-5 text-gray-200 leading-8">

            Talk to our property experts
            for personalized assistance.

          </p>

          <button
            className="
            mt-8
            w-full
            flex
            items-center
            justify-center
            gap-3
            bg-[#c9a64b]
            hover:bg-[#b9963d]
            transition
            text-black
            font-semibold
            rounded-xl
            py-4
            "
          >

            TALK TO AN ADVISOR

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </div>
  );
}