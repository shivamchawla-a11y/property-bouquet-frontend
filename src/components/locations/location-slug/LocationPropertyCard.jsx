"use client";

import Link from "next/link";
import {
  ArrowRight,
  MapPin,
} from "lucide-react";

import { formatPrice } from "@/utils/formatPrice";

export default function LocationPropertyCard({
  property,
}) {
  const propertySlug =
    property?.slug;

  const propertyTitle =
    property?.coreDetails?.title ||
    "Luxury property";

  const heroImage =
    property?.media?.heroImageUrl ||
    "/placeholder.jpg";

  const locationName =
    property?.locationData
      ?.locationName ||
    property?.locationData
      ?.customLocation ||
    "Prime Location";

  const price =
    property?.coreDetails
      ?.priceOnRequest
      ? "On Request"
      : property?.coreDetails
          ?.startingPrice
      ? `₹${formatPrice(
          property.coreDetails
            .startingPrice
        )}`
      : property?.unitConfigurations?.[0]
          ?.price
      ? `₹${formatPrice(
          property.unitConfigurations[0]
            .price
        )}`
      : "Price Unavailable";

  const bedrooms =
    property?.unitConfigurations?.[0]
      ?.bedrooms;

  const bathrooms =
    property?.unitConfigurations?.[0]
      ?.bathrooms;

  const area =
    property?.unitConfigurations?.[0]
      ?.area;

  return (
    <Link
      href={
        propertySlug
          ? `/${propertySlug}`
          : "#"
      }
      aria-label={`View ${propertyTitle}`}
      className="
        group
        relative
        block
        overflow-hidden
        rounded-[32px]
        border
        border-gray-100
        bg-white
        shadow-lg
        transition-all
        duration-500
        hover:shadow-2xl
      "
    >

      {/* ==================================================
          IMAGE
      ================================================== */}

      <div
        className="
          relative
          h-[320px]
          overflow-hidden
        "
      >

        <img
          src={heroImage}
          alt={propertyTitle}
          className="
            h-full
            w-full
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
            from-black/90
            via-black/10
            to-transparent
          "
        />

        {/* PRICE */}

        <div
          className="
            absolute
            right-5
            top-5
            rounded-full
            bg-[#081c15]
            px-5
            py-2
            text-sm
            font-bold
            text-white
            shadow-2xl
          "
        >
          {price}
        </div>

        {/* IMAGE CONTENT */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            p-6
            text-white
          "
        >

          <h3
            className="
              text-2xl
              font-black
              leading-tight
            "
          >
            {propertyTitle}
          </h3>

          <div
            className="
              mt-3
              flex
              items-center
              gap-2
              text-white/80
            "
          >

            <MapPin size={16} />

            <span
              className="
                truncate
                text-sm
              "
            >
              {locationName}
            </span>

          </div>

        </div>

      </div>

      {/* ==================================================
          CARD DETAILS
      ================================================== */}

      <div className="p-6">

        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            text-sm
            text-black/60
          "
        >

          <span>
            {bedrooms
              ? `${bedrooms} Beds`
              : "Luxury"}
          </span>

          <span>
            {bathrooms
              ? `${bathrooms} Baths`
              : "Residence"}
          </span>

          <span>
            {area
              ? `${area} Sq.Ft.`
              : "Premium"}
          </span>

        </div>

        {/* CTA */}

        <div
          className="
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-3
            rounded-2xl
            bg-[#081c15]
            font-bold
            text-white
            transition-all
            duration-300
            hover:bg-[#1b4332]
          "
        >

          Explore Property

          <ArrowRight
            size={18}
            className="
              transition
              group-hover:translate-x-1
            "
          />

        </div>

      </div>

    </Link>
  );
}