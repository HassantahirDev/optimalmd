"use client";
import React from "react";

interface ServiceCardProps {
  title?: string;
  description?: string;
  whatsIncluded?: string;
  eligibility?: string;
  pricing?: string;
  link?: string;
  author?: string;
  date?: string;
  readTime?: string;
  buttonText?: string;
  imageUrl?: string; // ✅ new field
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  whatsIncluded,
  eligibility,
  pricing,
  link,
  author,
  date,
  readTime,
  buttonText,
  imageUrl,
}) => {
  return (
    <div className="bg-black text-white rounded-2xl overflow-hidden flex flex-col p-6 gap-4 shadow-lg border border-gray-800">
      {/* ✅ Service Image */}
      {imageUrl && (
        <div className="w-full h-48 relative rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={title || "Service Image"}
            className="object-cover"
          />
        </div>
      )}

      {/* Title */}
      {title && <h2 className="text-xl font-bold">{title}</h2>}

      {/* Description */}
      {description && <p className="text-gray-300">{description}</p>}

      {/* Whats Included */}
      {whatsIncluded && (
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">What's Included:</span>{" "}
          {whatsIncluded}
        </p>
      )}

      {/* Eligibility */}
      {eligibility && (
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">Eligibility:</span>{" "}
          {eligibility}
        </p>
      )}

      {/* Pricing */}
      {pricing && (
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">Pricing:</span> {pricing}
        </p>
      )}

      {/* Author / Date / ReadTime */}
      {(author || date || readTime) && (
        <div className="text-xs text-gray-500 flex flex-wrap gap-x-2 mt-2">
          {author && <span>👤 {author}</span>}
          {date && <span>• {date}</span>}
          {readTime && <span>• {readTime}</span>}
        </div>
      )}

      {/* Button */}
      {buttonText && (
        <a
          href={link || "#"}
          className="mt-4 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-center transition"
        >
          {buttonText}
        </a>
      )}
    </div>
  );
};

export default ServiceCard;
