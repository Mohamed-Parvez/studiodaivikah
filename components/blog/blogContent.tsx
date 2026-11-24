/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  image: string;
  createdAt: string;
  blog?: {
    id: string;
    paragraphs: string[];
    images: string[];
  };
};

const BlogContent = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch all projects once
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/blog?includeBlog=true");
        if (res.ok) {
          const data = await res.json();
          setAllProjects(Array.isArray(data?.projects) ? data.projects : []);
        } else {
          setAllProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setAllProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project click
  const handleProjectClick = (projectId: string) => {
    router.push(`/blog/${projectId}`);
  };

  return (
    <section className="w-full pt-20 flex flex-col items-center">
      <Navbar />

      {/* Main Title */}
      <h1 className="text-center font-extrabold text-[45px] sm:text-[80px] md:text-[110px] lg:text-[130px] text-black tracking-tight my-10">
        BLOG
      </h1>

      {/* Subtitle */}
      <div className="w-full max-w-[1240px] text-center px-5 sm:px-10 mb-16">
        <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-light max-w-4xl mx-auto">
          Insights, architectural musings, and stories from our studio and practice.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="w-full max-w-[1240px] px-5 sm:px-10 mb-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            {/* Spinner */}
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        ) : allProjects.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">No items to display</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {allProjects.map((item) => (
              <div
                key={item.id}
                onClick={() => handleProjectClick(item.id)}
                className="group cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex flex-col"
              >
                <div className="relative overflow-hidden rounded-xl shadow-md h-64 md:h-72 w-full bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4 text-start w-full">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-black transition-colors duration-200 uppercase leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
};

export default BlogContent;
