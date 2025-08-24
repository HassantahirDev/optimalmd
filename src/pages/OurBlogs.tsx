"use client";
import React from "react";
import BlogList from "@/components/Blog/BlogList";
import PageBanner from "@/components/HowItWork/Pagebanner";
import Footer from "@/components/LandingPage/Footer";
import Navigation from "@/components/LandingPage/Navigation";

const BlogPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navigation />
      <PageBanner
        title="Our Blog"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        backgroundImage="/bd.png"
        className="h-[320px]"
      />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-center">
            Our Latest Blogs
          </h2>
          <BlogList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
