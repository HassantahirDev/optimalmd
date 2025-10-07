type Breadcrumb = {
  label: string;
  href?: string;
};

interface PageBannerProps {
  title: string;
  subHeadline?: string;
  breadcrumbs: Breadcrumb[];
  backgroundImage: string;
  className?: string;
  ctaButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
}

export default function PageBanner({
  title,
  subHeadline,
  breadcrumbs,
  backgroundImage,
  className = "",
  ctaButton,
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
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute left-0 top-0 h-full w-[60%] bg-gradient-to-r from-red-900/70 via-red-700/40 to-transparent" />
        <div className="absolute right-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full bg-red-700/25 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto h-full px-6 sm:px-8 flex flex-col items-start justify-center text-left">
        <h1
          id="page-banner-title"
          className="text-white font-extrabold text-[36px] sm:text-[44px] md:text-[56px] leading-[1.05] drop-shadow"
        >
          {title}
        </h1>

        {/* Sub-headline */}
        {subHeadline && (
          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl text-justify">
            {subHeadline}
          </p>
        )}

        {/* CTA Button */}
        {ctaButton && (
          <div className="mt-6">
            {ctaButton.href ? (
              <a
                href={ctaButton.href}
                className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {ctaButton.text}
              </a>
            ) : (
              <button
                onClick={ctaButton.onClick}
                className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {ctaButton.text}
              </button>
            )}
          </div>
        )}

        {/* Breadcrumbs */}
        <nav className="mt-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm sm:text-base">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li
                  key={`${crumb.label}-${index}`}
                  className="flex items-center"
                >
                  {crumb.href && !isLast ? (
                    <a
                      href={crumb.href}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-red-500">{crumb.label}</span>
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
