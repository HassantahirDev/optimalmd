"use client";
import React from "react";
import { Quote } from "lucide-react";

const HealthcareTeamSection = () => {
  return (
    <div className="bg-black min-h-screen py-16 px-8 flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white text-center">
        Meet Your Doctor
      </h2>

      {/* Header text */}
      <p className="text-gray-400 text-lg mb-12 text-justify max-w-3xl">
        Dr. Sam Samarrai is a board-certified physician specializing in men's health, weight management, hormone therapy, and longevity medicine. He founded OptimaleMD after seeing how traditional healthcare left men underserved. His goal: to help men reclaim energy, confidence, and performance at every stage of life.
      </p>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Doctor card */}
        <div className="bg-neutral-900 rounded-3xl p-8 shadow-2xl flex flex-col border border-gray-800">
          {/* Doctor photo */}
          <div className="w-full h-80 bg-gray-300 rounded-2xl mb-6 overflow-hidden flex items-center justify-center">
            <img
              src="https://placehold.co/400x320/1C1C1C/FFFFFF?text=Doctor+Image"
              alt="Dr. Sam Samarrai"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Doctor name */}
          <h3 className="text-white text-3xl font-bold mb-4 text-center">
            Dr. Sam Samarrai
          </h3>

          {/* Founder badge */}
          <div className="bg-red-500 text-white text-sm font-bold px-6 py-3 rounded-lg text-center mx-auto mb-4">
            FOUNDER & MEDICAL DIRECTOR
          </div>

          {/* Specialties */}
          <div className="text-gray-400 text-sm text-center space-y-1">
            <p>Board-Certified Physician</p>
            <p>Men's Health & Hormone Therapy Specialist</p>
            <p>Weight Management & Longevity Medicine</p>
          </div>
        </div>

        {/* Quote section */}
        <div className="bg-neutral-900 rounded-3xl p-10 shadow-2xl flex flex-col justify-center border border-gray-800">
          <Quote className="h-12 w-12 text-red-500 mb-6" />
          <blockquote className="text-gray-300 text-lg leading-relaxed mb-6 italic text-justify">
            "For years I struggled to find the kind of personalized, proactive healthcare I wanted for myself, my family, and my patients. The system was rushed, insurance-driven, and outdated. I started OptimaleMD to change that — to create a place where men could get the latest in hormone optimization, weight loss, and longevity medicine in a safe, supportive environment."
          </blockquote>
          <p className="text-white font-semibold text-xl">— Dr. Sam Samarrai</p>
        </div>
      </div>
    </div>
  );
};

export default HealthcareTeamSection;
