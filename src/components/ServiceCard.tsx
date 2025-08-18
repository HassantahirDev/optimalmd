'use client'
import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  whatsIncluded: string;
  eligibility: string;
  pricing: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  whatsIncluded, 
  eligibility, 
  pricing 
}) => {
  return (
    <div className="bg-black rounded-2xl p-6 max-w-md mx-auto text-white font-sans">
      {/* Header Image Section */}
      <div className="relative mb-6 h-32 bg-gradient-to-r from-gray-300 to-gray-200 rounded-xl overflow-hidden">
        {/* Molecular/Scientific Graphics Background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Hexagonal molecular structures */}
            <g fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <polygon points="50,30 70,20 90,30 90,50 70,60 50,50" />
              <polygon points="120,50 140,40 160,50 160,70 140,80 120,70" />
              <polygon points="200,25 220,15 240,25 240,45 220,55 200,45" />
              <polygon points="280,45 300,35 320,45 320,65 300,75 280,65" />
            </g>
            {/* Connecting lines */}
            <g stroke="rgba(255,255,255,0.4)" strokeWidth="1">
              <line x1="90" y1="40" x2="120" y2="60" />
              <line x1="160" y1="60" x2="200" y2="35" />
              <line x1="240" y1="35" x2="280" y2="55" />
            </g>
            {/* Circular nodes */}
            <g fill="rgba(255,200,100,0.7)">
              <circle cx="70" cy="40" r="4" />
              <circle cx="140" cy="60" r="4" />
              <circle cx="220" cy="35" r="4" />
              <circle cx="300" cy="55" r="4" />
            </g>
          </svg>
        </div>
        
        {/* DNA Helix or Flowing Element */}
        <div className="absolute right-8 top-4">
          <svg width="80" height="100" viewBox="0 0 80 100">
            <defs>
              <linearGradient id="helixGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            <path d="M20 10 Q40 30 20 50 Q40 70 20 90" 
                  fill="none" 
                  stroke="url(#helixGradient)" 
                  strokeWidth="3" 
                  opacity="0.8"/>
            <path d="M60 10 Q40 30 60 50 Q40 70 60 90" 
                  fill="none" 
                  stroke="url(#helixGradient)" 
                  strokeWidth="3" 
                  opacity="0.6"/>
          </svg>
        </div>
        
        {/* Professional Woman */}
        <div className="absolute right-2 bottom-0 w-24 h-32">
          <div className="w-full h-full bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-full relative">
            {/* Face */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-14 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full">
              {/* Hair */}
              <div className="absolute -top-2 -left-2 w-16 h-12 bg-gradient-to-br from-amber-900 to-amber-800 rounded-full"></div>
              {/* Eyes */}
              <div className="absolute top-4 left-2 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
              <div className="absolute top-4 right-2 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
              {/* Lips */}
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-300 rounded-full"></div>
            </div>
            {/* Professional attire suggestion */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Title */}
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      
      {/* Description */}
      <p className="text-gray-300 text-sm mb-6 leading-relaxed">
        {description}
      </p>
      
      {/* What's Included */}
      <div className="mb-4">
        <span className="text-red-400 font-semibold text-sm">What's Included: </span>
        <span className="text-gray-300 text-sm">
          {whatsIncluded}
        </span>
      </div>
      
      {/* Eligibility */}
      <div className="mb-4">
        <span className="text-red-400 font-semibold text-sm">Eligibility: </span>
        <span className="text-gray-300 text-sm">
          {eligibility}
        </span>
      </div>
      
      {/* Pricing */}
      <div>
        <span className="text-red-400 font-semibold text-sm">Pricing: </span>
        <span className="text-gray-300 text-sm">
          {pricing}
        </span>
      </div>
    </div>
  );
};

export default ServiceCard;