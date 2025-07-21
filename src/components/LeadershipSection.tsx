import Navigation from "./Navigation";
import Footer from "./Footer";

const founderImage = "https://images.unsplash.com/photo-1698510047345-ff32de8a3b74?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDA%3D";
const cofounderImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=face";

const LeadershipSection = () => (
  <>
    <Navigation />
    <section className="section-padding bg-black min-h-screen flex flex-col justify-center">
      <div className="container-custom max-w-5xl mx-auto px-6 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Quote and Bio */}
        <div className="flex flex-col gap-8">
          <div className="flex items-start gap-3">
            <span className="text-5xl text-red-600 font-bold">&#8220;</span>
            <p className="text-2xl lg:text-3xl text-white font-medium leading-snug">
              Over time, I found it incredibly difficult to get medical oversight for myself and my family that reflected the most cutting-edge literature, and that was preventative—that’s why I started OptimaleMD.
            </p>
          </div>
          <div className="mt-2 text-2xl text-gray-400 font-semibold">- Dr. Sam Samarrai, MD</div>
          <div className="mt-8 bg-black/80 border border-gray-400 rounded-xl p-6">
            <h2 className="text-2xl text-red-500 font-extrabold mb-2 uppercase tracking-wide">FOUNDER</h2>
            <h3 className="text-2xl text-white font-semibold mb-2">Dr. Sam Samarrai, MD</h3>
            <p className="text-md text-gray-300">
              Dr. Sam Samarrai is a board-certified family medicine physician dedicated to optimizing health through personalized, science-based healthcare solutions, including advanced diagnostics and expert consultations.
            </p>
          </div>
        </div>
        {/* Right: Image */}
        <div className="flex justify-center items-center">
          <img src={founderImage} alt="Dr. Sam Samarrai, MD" className="rounded-2xl object-cover w-full max-w-md shadow-2xl" />
        </div>
      </div>
      {/* Modern separator between founder and cofounder */}
      <div className="flex items-center justify-center my-8">
        <div className="w-2/3 h-0.5 bg-gradient-to-r from-red-500 via-black to-red-500 rounded-full shadow-lg relative">
          <span className="absolute left-1/2 -translate-x-1/2 -top-5 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-red-500">
            <span className="text-primary-foreground font-bold text-2xl">O</span>
          </span>
        </div>
      </div>
      {/* Co-Founder Section Below */}
      <div className="container-custom max-w-5xl mx-auto px-6 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Quote and Bio */}
        <div className="flex flex-col gap-8">
          <div className="flex items-start gap-3">
            <span className="text-5xl text-red-600 font-bold">&#8220;</span>
            <p className="text-2xl lg:text-3xl text-white font-medium leading-snug">
              My passion is transforming digital processes and user experiences to make healthcare more accessible and effective for everyone.
            </p>
          </div>
          <div className="mt-2 text-2xl text-gray-400 font-semibold">- Saad</div>
          <div className="mt-8 bg-black/80 border border-gray-400 rounded-xl p-6">
            <h2 className="text-2xl text-red-500 font-extrabold mb-2 uppercase tracking-wide">CO-FOUNDER</h2>
            <h3 className="text-2xl text-white font-semibold mb-2">Saad</h3>
            <p className="text-md text-gray-300">
              Saad is the Chief Digital Officer and cofounder of OptimaleMD, with a diverse background in Energy, Big Tech, and Healthcare. He is dedicated to optimizing health through digital innovation and user-focused solutions.
            </p>
          </div>
        </div>
        {/* Right: Image */}
        <div className="flex justify-center items-center">
          <img src={cofounderImage} alt="Saad, Chief Digital Officer & Co-Founder" className="rounded-2xl object-cover w-full max-w-md shadow-2xl" />
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default LeadershipSection;