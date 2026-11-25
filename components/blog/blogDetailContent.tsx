/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/nav/navbar";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Project = {
  id: string;
  type: string;
  title: string;
  image: string;
  createdAt: string;
};

type BlogContent = {
  id: string;
  projectId: string;
  paragraphs: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
};

const BlogDetailContent = () => {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [blog, setBlog] = useState<BlogContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectAndBlog = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        // Fetch project details
        const projectRes = await fetch(`/api/blog/${params.id}`);
        if (!projectRes.ok) {
          throw new Error("Project not found");
        }
        const projectData = await projectRes.json();
        setProject(projectData);

        // Fetch blog content
        try {
          const blogRes = await fetch(`/api/blog/${params.id}/blog`);
          if (blogRes.ok) {
            const blogData = await blogRes.json();
            setBlog(blogData);
          }
        } catch (blogError) {
          console.log("No blog content found for this project", blogError);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndBlog();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The article you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // Get first paragraph as subtitle and remaining paragraphs
  const subtitle = blog?.paragraphs?.[0] || "";
  const remainingParagraphs = blog?.paragraphs?.slice(1) || [];
  const firstImage = blog?.images?.[0] || "";
  const remainingImages = blog?.images?.slice(1) || [];

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full max-w-[1240px] px-5 sm:px-8 xl:px-0 flex-col justify-between flex bg-white overflow-x-hidden mx-auto">
        {/* Hero Section */}
        <div className="pt-20">
          {/* Back Button */}
          <div className="w-full py-6">
            <button
              onClick={() => router.back()}
              className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </button>
          </div>

          {/* Project Header - Full Width */}
          <div className="w-full py-4 sm:py-6">
            <div className="w-full space-y-5">
              {/* Project Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words leading-tight w-full text-black">
                {project.title && project.title.toUpperCase()}
              </h1>

              {/* Subtitle (First Paragraph) */}
              {subtitle && (
                <div className="text-gray-700 text-base sm:text-lg leading-relaxed font-normal w-full">
                  {subtitle.split("\n").map((line, index) => (
                    <p key={index} className="mb-4">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {/* First Image (Hero Image if present) */}
              {firstImage && (
                <div className="w-full my-6 flex justify-center">
                  <div className="max-w-md sm:max-w-lg md:max-w-xl w-full flex justify-center bg-gray-50/60 rounded-2xl border border-gray-100/80 overflow-hidden p-2">
                    <img
                      src={firstImage}
                      alt={project.title}
                      className="w-auto h-auto max-h-[380px] sm:max-h-[420px] rounded-xl shadow-sm object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Content - Remaining Paragraphs */}
        {remainingParagraphs.length > 0 && (
          <div className="w-full py-4 sm:py-6">
            <div className="w-full">
              {remainingParagraphs.map((paragraph, index) => (
                <div key={index + 1} className="mb-6 w-full">
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 break-words">
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remaining Images Gallery */}
        {remainingImages.length > 0 && (
          <div className="w-full mt-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {remainingImages.map((image, index) => (
                <div key={index + 1} className="group cursor-pointer w-full">
                  <div className="relative overflow-hidden rounded-lg shadow-lg w-full">
                    <img
                      src={image}
                      alt={`Gallery image ${index + 2}`}
                      className="w-full max-w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default BlogDetailContent;
