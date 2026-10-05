"use client";

import Link from "next/link";
import {
  MapPin,
  ArrowRight,
} from "lucide-react";

import { formatPrice } from "@/utils/formatPrice";

const PROPERTY_IMAGE_WIDTH = 700;

function optimizeImageUrl(src, width) {
  if (!src) {
    return "";
  }

  const value = String(src);

  if (
    value.includes("res.cloudinary.com") &&
    value.includes("/image/upload/")
  ) {
    return value.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,w_${width},c_limit/`
    );
  }

  return value;
}

export default function DeveloperProjectCard({
  property,
}) {
  if (!property) {
    return null;
  }

  const propertySlug = property?.slug;

  const propertyTitle =
    property?.coreDetails?.title ||
    "Luxury property";

  const propertyImage = optimizeImageUrl(
    property?.media?.heroImageUrl ||
      "/placeholder.jpg",
    PROPERTY_IMAGE_WIDTH
  );

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
        text-[#081c15]
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
          src={propertyImage}
          alt={propertyTitle}
          width={700}
          height={500}
          loading="lazy"
          decoding="async"
          className="
            h-full
            w-full
            object-cover
            transition
            duration-700
            group-hover:scale-110
          "
        />

        {/* IMAGE OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/90
            via-black/10
            to-transparent
          "
          aria-hidden="true"
        />

        {/* ==================================================
            PRICE
        ================================================== */}

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
          {property?.coreDetails?.priceOnRequest ? (
            "On Request"
          ) : property?.coreDetails?.startingPrice ? (
            <>
              ₹
              {formatPrice(
                property.coreDetails.startingPrice
              )}
            </>
          ) : property?.unitConfigurations?.[0]
              ?.price ? (
            <>
              ₹
              {formatPrice(
                property.unitConfigurations[0].price
              )}
            </>
          ) : (
            "Price Unavailable"
          )}
        </div>

        {/* ==================================================
            IMAGE CONTENT
        ================================================== */}

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
            {property?.coreDetails?.title}
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
            <MapPin
              size={16}
              aria-hidden="true"
            />

            <span className="truncate text-sm">
              {property?.locationData?.locationName ||
                property?.locationData?.customLocation ||
                "Prime Location"}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          BOTTOM CONTENT
      ================================================== */}

      <div
        className="
          p-6
          text-[#081c15]
        "
      >
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
            {property
              ?.unitConfigurations?.[0]
              ?.bedrooms
              ? `${property.unitConfigurations[0].bedrooms} Beds`
              : "Luxury"}
          </span>

          <span>
            {property
              ?.unitConfigurations?.[0]
              ?.bathrooms
              ? `${property.unitConfigurations[0].bathrooms} Baths`
              : "Residence"}
          </span>

          <span>
            {property
              ?.unitConfigurations?.[0]
              ?.area
              ? `${property.unitConfigurations[0].area} Sq.Ft.`
              : "Premium"}
          </span>
        </div>

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
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}