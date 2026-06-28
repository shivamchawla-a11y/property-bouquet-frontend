"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "How to Choose the Right Luxury Apartment",
    category: "Buying Guide",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900",
    readTime: "6 min read",
  },
  {
    id: 2,
    title: "Complete Guide to Home Loan Approval",
    category: "Home Loans",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Luxury Real Estate Investment Strategy",
    category: "Investment",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900",
    readTime: "7 min read",
  },
];

export default function RelatedArticles() {
  return (
    <section className="mt-24">

      <div className="flex items-center justify-between mb-8">

        <div>
          <p className="uppercase tracking-[0.35em] text-xs text-[#b9974b] font-semibold">
            Continue Reading
          </p>

          <h2 className="text-4xl font-light text-[#123026] mt-2">
            Related Knowledge
          </h2>
        </div>

        <Link
          href="/knowledge"
          className="hidden md:flex items-center gap-2 text-[#123026] font-medium hover:gap-3 transition-all"
        >
          View All
          <ArrowRight size={18} />
        </Link>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {articles.map((article) => (
          <Link
            key={article.id}
            href="#"
            className="group"
          >
            <article className="overflow-hidden rounded-[28px] bg-white shadow-sm border border-[#ede7dc]">

              <div className="overflow-hidden">

                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 object-cover transition duration-700 group-hover:scale-105"
                />

              </div>

              <div className="p-7">

                <span className="inline-block px-3 py-1 rounded-full bg-[#f8f2e4] text-[#b9974b] text-xs font-semibold uppercase tracking-wider">
                  {article.category}
                </span>

                <h3 className="mt-5 text-2xl font-light text-[#123026] leading-snug group-hover:text-[#b9974b] transition-colors">
                  {article.title}
                </h3>

                <div className="mt-6 flex items-center justify-between">

                  <span className="text-sm text-gray-500">
                    {article.readTime}
                  </span>

                  <span className="flex items-center gap-2 text-[#123026] font-medium">
                    Read
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>

                </div>

              </div>

            </article>
          </Link>
        ))}

      </div>

    </section>
  );
}