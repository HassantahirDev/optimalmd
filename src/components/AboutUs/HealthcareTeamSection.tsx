"use client";
import React from "react";

const HealthcareTeamSection = () => {
  return (
    <div className="bg-black-100 min-h-screen p-8 flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
        Meet Our Team
      </h2>

      {/* Header text */}
      <p className="text-gray-400 text-lg mb-12 text-center max-w-2xl">
        We're a team of passionate healthcare professionals dedicated to helping
        people
      </p>

      {/* Doctor card */}
      <div className="bg-black rounded-3xl p-8 w-[400px] h-[555px] shadow-2xl flex flex-col">
        {/* Doctor photo */}
        <div className="w-full h-64 bg-gray-300 rounded-2xl mb-6 overflow-hidden">
          <img
            src="/doctor.png"
            alt="Dr. Sam Samarrai"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Doctor name */}
        <h3 className="text-white text-2xl font-semibold mb-4 text-center">
          Dr. Sam Samarrai
        </h3>

        {/* Founder badge */}
        <div className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-md text-center mx-auto mb-4">
          FOUNDER & MEDICAL DIRECTOR
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed text-center">
          Board-certified in Internal Medicine, Dr. Carter leads our clinical
          team with over 12 years of experience in hormone health & preventive
          care.
        </p>
      </div>
    </div>
  );
};

export default HealthcareTeamSection;
