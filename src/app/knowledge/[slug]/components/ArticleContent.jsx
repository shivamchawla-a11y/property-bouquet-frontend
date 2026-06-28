"use client";

import {
  Lightbulb,
  ShieldCheck,
  User,
  MapPin,
  CreditCard,
  Camera,
  Landmark,
  Home,
} from "lucide-react";

const buyerDocuments = [
  {
    icon: User,
    title: "1. Identity Proof",
    description:
      "Aadhaar Card, Passport, Voter ID, PAN Card or any government-issued identity proof.",
  },
  {
    icon: MapPin,
    title: "2. Address Proof",
    description:
      "Aadhaar Card, Passport, Driving License, Utility Bill or Bank Statement.",
  },
  {
    icon: CreditCard,
    title: "3. PAN Card",
    description:
      "Mandatory for property transactions above ₹10 lakhs.",
  },
  {
    icon: Camera,
    title: "4. Passport Photograph",
    description:
      "Recent passport-size photographs of all buyers.",
  },
  {
    icon: Landmark,
    title: "5. Bank Statements / ITR",
    description:
      "Last 6 months' bank statements and Income Tax Returns for loan processing.",
  },
];

const sellerDocuments = [
  {
    icon: Home,
    title: "1. Title Deed",
    description:
      "Original ownership documents proving legal ownership.",
  },
  {
    icon: ShieldCheck,
    title: "2. Encumbrance Certificate",
    description:
      "Shows the property has no outstanding legal liabilities.",
  },
  {
    icon: Landmark,
    title: "3. Property Tax Receipts",
    description:
      "Latest tax payment receipts issued by the municipality.",
  },
  {
    icon: Home,
    title: "4. Approved Building Plan",
    description:
      "Building approval issued by the local authority.",
  },
  {
    icon: ShieldCheck,
    title: "5. Occupancy Certificate",
    description:
      "Completion/Occupancy certificate wherever applicable.",
  },
];

function Table({ rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7e0d5] mt-6">

      <div className="grid grid-cols-2 bg-[#0f3b2e] text-white">

        <div className="px-6 py-4 font-semibold">
          DOCUMENT
        </div>

        <div className="px-6 py-4 font-semibold">
          DESCRIPTION
        </div>

      </div>

      {rows.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="grid grid-cols-2 border-t"
          >
            <div className="flex items-center gap-4 px-6 py-5">

              <Icon
                size={22}
                className="text-[#0f3b2e]"
              />

              <span className="font-semibold">
                {item.title}
              </span>

            </div>

            <div className="px-6 py-5 text-gray-600 leading-7">
              {item.description}
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default function ArticleContent() {
  return (
    <article>

      {/* Overview */}

      <h2 className="text-4xl font-serif text-[#0f3b2e]">
        Overview
      </h2>

      <p className="mt-6 text-gray-600 leading-9 text-lg">
        Buying a property is a significant financial
        decision. Having the right documents in
        place ensures a smooth transaction and
        protects you from legal complications in
        the future.
      </p>

      {/* Key Takeaway */}

      <div className="mt-8 rounded-2xl border bg-[#fbfaf8] border-[#e8dfd2] p-8">

        <div className="flex gap-5">

          <div className="w-14 h-14 rounded-full bg-[#0f3b2e] flex items-center justify-center">

            <Lightbulb
              className="text-[#d3ac59]"
              size={28}
            />

          </div>

          <div>

            <p className="uppercase tracking-[2px] text-xs font-bold text-[#0f3b2e]">
              Key Takeaway
            </p>

            <p className="mt-2 text-gray-700 leading-8">
              Having the right documents ready
              ensures a legally safe property
              purchase and helps avoid delays in
              registration and loan approval.
            </p>

          </div>

        </div>

      </div>

      {/* Buyer */}

      <section className="mt-14">

        <h2 className="text-4xl font-serif text-[#0f3b2e]">
          1. Documents Required from the Buyer
        </h2>

        <p className="mt-5 text-gray-600 text-lg leading-8">
          These documents are required from the
          buyer to verify identity, address and
          financial capability.
        </p>

        <Table rows={buyerDocuments} />

      </section>

      {/* Seller */}

      <section className="mt-16">

        <h2 className="text-4xl font-serif text-[#0f3b2e]">
          2. Documents Required from the Seller
        </h2>

        <p className="mt-5 text-gray-600 text-lg leading-8">
          These documents help verify ownership,
          legal status and compliance of the
          property.
        </p>

        <Table rows={sellerDocuments} />

      </section>

      {/* Future HTML */}

      <section className="mt-20">

        <div
          className="
          prose
          prose-lg
          max-w-none
          prose-headings:font-serif
          prose-headings:text-[#0f3b2e]
          prose-p:text-gray-700
          prose-li:text-gray-700
          prose-a:text-[#c9a64b]
          prose-img:rounded-2xl
          "
        >
          {/* Later replace with:

          <div
             dangerouslySetInnerHTML={{
                __html: knowledge.content
             }}
          />

          */}
        </div>

      </section>

    </article>
  );
}