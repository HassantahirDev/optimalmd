import React from 'react';

type Breadcrumb = {
  label: string;
  href?: string;
};

interface PageBannerProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  backgroundImage: string;
  className?: string;
}

export default function PageBanner({
  title,
  breadcrumbs,
  backgroundImage,
  className = '',
}: PageBannerProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      aria-labelledby="page-banner-title"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
        aria-hidden
      />

      {/* Dark + red gradient overlay to match provided design */}
      <div
        className="absolute inset-0"
        aria-hidden
      >
        {/* Global dark scrim */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Left red sweep */}
        <div className="absolute left-0 top-0 h-full w-[60%] bg-gradient-to-r from-red-900/70 via-red-700/40 to-transparent" />
        {/* Subtle right glow to mirror the screenshot's tint */}
        <div className="absolute right-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-red-500/20 blur-3xl" />
        {/* Additional depth on the far left */}
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-red-700/25 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-8 flex flex-col items-start justify-center text-left">
      <h1
          id="page-banner-title"
          className="text-white font-extrabold text-[36px] sm:text-[44px] md:text-[56px] leading-[1.05] drop-shadow"
        >
          {title}
        </h1>

        {/* Breadcrumbs */}
        <nav className="mt-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm sm:text-base">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={`${crumb.label}-${index}`} className="flex items-center">
                  {crumb.href && !isLast ? (
                    <a
                      href={crumb.href}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-red-500">
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span className="mx-2 text-red-500">/</span>}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}

