"use client";

import Image from "next/image";

export default function AboutAuthor({ article }) {
  return (
    <div className="bg-white border border-[#ece7dc] rounded-xl p-7">

      <h3
        className="text-[28px] text-[#163629]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        About the Author
      </h3>

      <div className="mt-6 flex items-center gap-4">

        <div className="w-20 h-20 rounded-full overflow-hidden border">

          {article.authorImage ? (
            <Image
              src={article.authorImage}
              alt={article.author}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-[#143226] text-white flex items-center justify-center text-2xl font-bold">
              {article.author?.charAt(0)}
            </div>
          )}

        </div>

        <div>

          <h4 className="font-semibold text-lg">

            {article.author}

          </h4>

          <p className="text-sm text-gray-500">

            Senior Real Estate Analyst

          </p>

          <p className="text-sm text-gray-500 mt-2 leading-6">

            8+ years of experience in
            real estate market research
            and investment advisory.

          </p>

        </div>

      </div>

      <button
        className="
        mt-7
        w-full
        h-12
        rounded-lg
        border
        border-[#cda05a]
        text-[#143226]
        font-medium
        hover:bg-[#143226]
        hover:text-white
        transition
        "
      >
        VIEW ALL ARTICLES
      </button>

    </div>
  );
}