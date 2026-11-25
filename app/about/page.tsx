import Footer from "@/components/footer/footer";
import MainFooter from "@/components/footer/mainfooter";
import Timeline from "@/components/about/timeline";
import React from "react";
import Image from "next/image";
import Showcase from "@/components/about/showcase";
import Navbar from "@/components/nav/navbar";
import type { Metadata } from "next";
import { staticImages } from "@/lib/staticImages";

export const metadata: Metadata = {
  title: "About Us | Architecture & Interior Design Firm | Chennai",
  description:
    "Learn about Studio Daivikah — an architectural practice driven by thoughtful craftsmanship, contextual relevance, and the belief that great design must serve and inspire.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Architecture & Interior Design Firm | Chennai | Studio Daivikah",
    description:
      "Learn about Studio Daivikah — an architectural practice driven by thoughtful craftsmanship, contextual relevance, and the belief that great design must serve and inspire.",
    url: "https://studiodaivikah.com/about",
  },
};

const page = () => {
  return (
    <section className="w-full pt-20 flex-col flex-center">
      <Navbar />
      <div className="relative w-full flex-center py-28 min-h-[380px] sm:min-h-[460px] overflow-hidden">
        <Image
          src={staticImages.abtMain.src}
          placeholder="blur"
          blurDataURL={staticImages.abtMain.blurDataURL}
          alt="Studio Daivikah About Header"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50 z-0"
        />
        <h1 className="text-center z-10 text-black font-extrabold text-[38px] sm:text-[54px] md:text-[68px] lg:text-[80px]">
          ABOUT
        </h1>
      </div>
      <div className="flex flex-col my-16 md:my-32 md:flex-row md:justify-between max-w-[1240px] w-full px-5 sm:px-10 gap-8">
        <div className="flex-start flex-col gap-y-3">
          <p className="text-[24px] text-black font-medium">Studio Daivikah</p>
          <p className="text-[18px] sm:ml-20 lg:ml-36 text-black font-normal italic">
            &quot;Concept to Creation&quot;
          </p>
          <p className="text-[16px] sm:text-[18px] max-w-[600px] w-full text-black font-normal leading-relaxed">
            Studio Daivikah is the vision of a passionate architect driven by
            the belief that great design goes beyond beauty—it must serve,
            inspire, and endure. Founded on the core values of thoughtful
            craftsmanship and contextual relevance, the studio is a space where
            creativity and functionality come together in perfect harmony. With
            a keen eye for detail and a deep respect for materials, Studio
            Daivikah creates architectural and interior spaces that are
            timeless, intuitive, and rooted in purpose. Every project is
            approached as a unique narrative—carefully shaped to reflect the
            lifestyle, aspirations, and emotions of those who inhabit it.
            Whether it’s a serene home, a vibrant workspace, or a soulful
            retreat, Studio Daivikah strives to craft environments that not only
            look beautiful but feel deeply connected to the people who use them.
          </p>
        </div>
        <div className="relative w-full h-[300px] sm:h-[400px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-lg overflow-hidden flex-shrink-0">
          <Image
            alt="Studio Daivikah Concept"
            src={staticImages.abtSub.src}
            placeholder="blur"
            blurDataURL={staticImages.abtSub.blurDataURL}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
          />
        </div>
      </div>
      <Timeline />
      <Showcase />
      <MainFooter />
      <Footer />
    </section>
  );
};

export default page;
