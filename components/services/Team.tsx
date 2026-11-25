"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type TeamMember = {
  id: string;
  image: string;
  name?: string;
  role?: string;
  description?: string | null;
  createdAt: string;
};

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team");
      if (!response.ok) {
        console.warn("Team API response error:", response.statusText);
        setTeamMembers([]);
        return;
      }
      const data = await response.json();
      setTeamMembers(data.items || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Handle escape key and body scroll lock for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMember(null);
      }
    };

    if (selectedMember) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMember]);

  return (
    <main className="max-w-[1240px] my-24 w-full flex-start flex-col gap-y-3">
      <h1 className="text-[70px] md:text-[120px] lg:text-[140px] font-bold text-black">
        TEAM
      </h1>
      <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-3 gap-y-14 gap-6 w-full">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="relative overflow-hidden shadow-lg group cursor-pointer rounded-xl bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.image}
              alt={member.name || "Team member"}
              loading="lazy"
              decoding="async"
              className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Name and Role Overlay on Hover (no description on thumbnail as requested) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col justify-end">
              {member.name && (
                <h3 className="text-white font-bold text-xl mb-0.5">
                  {member.name}
                </h3>
              )}
              {member.role && (
                <p className="text-white text-sm font-medium tracking-wide">
                  {member.role}
                </p>
              )}
              <span className="text-[11px] text-gray-300 font-normal mt-2 flex items-center gap-1">
                Click to view details &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Closable Team Member Detail Card / Modal */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedMember(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-gray-100 transform transition-all flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer shadow-md"
              title="Close"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-2/5 relative bg-gray-100 min-h-[300px] md:min-h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedMember.image}
                alt={selectedMember.name || "Team member"}
                className="w-full h-full object-cover object-center absolute inset-0"
              />
            </div>

            {/* Right: Details & Description */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
              <div>
                <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">
                  Studio Daivikah Team
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                  {selectedMember.name || "Team Member"}
                </h2>
                {selectedMember.role && (
                  <p className="text-base font-medium text-gray-600 mt-1 pb-4 border-b border-gray-100">
                    {selectedMember.role}
                  </p>
                )}

                {/* Description Content */}
                <div className="mt-5 space-y-2">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    About / Bio
                  </h4>
                  {selectedMember.description ? (
                    <div className="text-gray-700 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line">
                      {selectedMember.description}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      Dedicated architectural professional contributing to design excellence and innovation at Studio Daivikah.
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Studio Daivikah Practice</span>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Team;
