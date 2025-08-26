import React from "react";
import { ChevronRight } from "lucide-react";

export default function CategoryBrowser() {
  const categories = [
    {
      title: "Men's health",
      color: "bg-red-500",
    },
    {
      title: "Telemedicine tips",
      color: "bg-red-500",
    },
    {
      title: "Wellness guides",
      color: "bg-red-500",
    },
    {
      title: "Healthcare",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
        Browse By Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-lg p-6 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors duration-200"
          >
            <h3 className="text-white text-lg font-medium flex-1 pr-4">
              {category.title}
            </h3>
            <div
              className={`${category.color} rounded-lg p-2 flex items-center justify-center`}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
