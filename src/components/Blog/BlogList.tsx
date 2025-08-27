"use client";
import React, { useState } from "react";
import ServiceCard from "@/components/Service/ServiceCard";
import Pagination from "@/components/Generic/Pagination";

const BlogList: React.FC = () => {
  const services = [
    {
      title: "TRT: What to Expect in Your First 90 Days",
      description:
        "Thinking about testosterone therapy? Here’s a quick guide to what the first few months really look like.",
      imageUrl: "/ImageforBlog/TRT.png",
    },
    {
      title: "Hair Loss in Men: Causes & Modern Treatments",
      description:
        "Hair thinning? You’re not alone. We break down why it happens — and what actually works.",
      imageUrl: "/ImageforBlog/Hairloss.png",
    },
    {
      title: "Weight Loss Meds: Are They Right for You?",
      description:
        "GLP-1s like semaglutide are changing the game. See if they could be part of your weight loss plan.",
      imageUrl: "/ImageforBlog/weightloss.png",
    },
    {
      title: "Peptide Therapy 101",
      description:
        "Curious about peptides? This beginner-friendly guide explains what they are and how they support longevity.",
      imageUrl: "/ImageforBlog/peptide.png",
    },
    {
      title: "Telemedicine for Men: How It Works",
      description:
        "No waiting rooms, no awkward convos. Here’s how virtual care can simplify your health journey.",
      imageUrl: "/ImageforBlog/telemedicine.png",
    },
    {
      title: "The Truth About Libido & Hormones",
      description:
        "Low sex drive isn’t just in your head. Learn how hormones affect desire — and how to fix it.",
      imageUrl: "/ImageforBlog/libido.png",
    },
    {
      title: "Longevity Medicine: What It Is & Why It Matters",
      description:
        "Living longer is great — but living better is the goal. Here’s how we help you do both.",
      imageUrl: "/ImageforBlog/longevity.png",
    },
    {
      title: "Supplements for Men's Health: What’s Worth It?",
      description:
        "We cut through the noise and list the top supplements that actually support testosterone, energy, and focus.",
      imageUrl: "/ImageforBlog/supplements.png",
    },
    {
      title: "Lab Testing Explained",
      description:
        "Don’t let lab work intimidate you. We explain what we test for and why it matters for your health.",
      imageUrl: "/ImageforBlog/labtest.png",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = services.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {/* Blog grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentServices.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default BlogList;
