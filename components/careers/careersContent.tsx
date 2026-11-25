/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/nav/navbar";
import Footer from "@/components/footer/footer";
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  Filter,
  X,
  ChevronRight,
  Send,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Building2,
  Award,
  Link as LinkIcon,
  Phone,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  experience: string;
  salary?: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  isOpen: boolean;
  isHidden: boolean;
  createdAt: string;
}

export default function CareersContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Modal States
  const [selectedJobDetails, setSelectedJobDetails] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "0-1 Years",
    portfolioUrl: "",
    resumeUrl: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/careers");
        const data = await res.json();
        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      } catch (err) {
        console.error("Error fetching careers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter options dynamically extracted from data
  const departments = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => set.add(j.department));
    return Array.from(set);
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => set.add(j.jobType));
    return Array.from(set);
  }, [jobs]);

  const experienceLevels = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => set.add(j.experience));
    return Array.from(set);
  }, [jobs]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => set.add(j.location));
    return Array.from(set);
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Must be open
      if (!job.isOpen) return false;

      // Search query matches title, description, or department
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          job.title.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.department.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Department filter
      if (selectedDepartment !== "all" && job.department !== selectedDepartment) {
        return false;
      }

      // Job Type filter
      if (selectedJobType !== "all" && job.jobType !== selectedJobType) {
        return false;
      }

      // Experience filter
      if (selectedExperience !== "all" && job.experience !== selectedExperience) {
        return false;
      }

      // Location filter
      if (selectedLocation !== "all" && job.location !== selectedLocation) {
        return false;
      }

      return true;
    });
  }, [
    jobs,
    searchQuery,
    selectedDepartment,
    selectedJobType,
    selectedExperience,
    selectedLocation,
  ]);

  const hasActiveFilters =
    searchQuery ||
    selectedDepartment !== "all" ||
    selectedJobType !== "all" ||
    selectedExperience !== "all" ||
    selectedLocation !== "all";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("all");
    setSelectedJobType("all");
    setSelectedExperience("all");
    setSelectedLocation("all");
  };

  const handleOpenApply = (job: Job) => {
    setApplyingJob(job);
    setSubmitSuccess(false);
    setSubmitError(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      experience: job.experience || "0-1 Years",
      portfolioUrl: "",
      resumeUrl: "",
      message: "",
    });
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: applyingJob.id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError(data.error || "Failed to submit application. Please try again.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmitError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-neutral-50 min-h-screen flex flex-col items-center pt-20">
      <Navbar />

      {/* Hero Banner */}
      <section className="w-full bg-black text-white py-14 sm:py-20 px-5 sm:px-10 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs tracking-wider uppercase font-semibold text-gray-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            We Are Hiring Creative Minds
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight">
            JOIN OUR TEAM
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Be part of an innovative studio shaping spaces through context, culture, and sustainable architecture. Discover opportunities that challenge and inspire you.
          </p>

          {/* Naukri-style Search Bar */}
          <div className="pt-6 w-full max-w-3xl mx-auto">
            <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border border-gray-100">
              <div className="flex items-center gap-2 px-3 flex-1 w-full text-gray-700">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 text-sm bg-transparent text-gray-900 focus:outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="hidden sm:block w-px h-8 bg-gray-200" />

              <div className="flex items-center gap-2 px-3 w-full sm:w-auto text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="py-2.5 text-sm bg-transparent text-gray-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Naukri-style Grid with Sidebar Filters */}
      <main className="w-full max-w-[1280px] px-4 sm:px-8 py-10 flex-1">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-semibold text-gray-800">
            {filteredJobs.length} Job{filteredJobs.length === 1 ? "" : "s"} Found
          </span>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg"
          >
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* SIDEBAR: Naukri-Style Filter Panel (Desktop) */}
          <aside className="hidden lg:block w-[280px] shrink-0 space-y-6 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-neutral-700" /> All Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-neutral-600 hover:text-black font-semibold transition-colors"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Department
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="dept"
                    checked={selectedDepartment === "all"}
                    onChange={() => setSelectedDepartment("all")}
                    className="w-4 h-4 text-black focus:ring-0 cursor-pointer"
                  />
                  <span>All Departments</span>
                </label>
                {departments.map((dept) => (
                  <label
                    key={dept}
                    className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-black"
                  >
                    <input
                      type="radio"
                      name="dept"
                      checked={selectedDepartment === dept}
                      onChange={() => setSelectedDepartment(dept)}
                      className="w-4 h-4 text-black focus:ring-0 cursor-pointer"
                    />
                    <span className="truncate">{dept}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Experience Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Experience
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="exp"
                    checked={selectedExperience === "all"}
                    onChange={() => setSelectedExperience("all")}
                    className="w-4 h-4 text-black focus:ring-0 cursor-pointer"
                  />
                  <span>Any Experience</span>
                </label>
                {experienceLevels.map((exp) => (
                  <label
                    key={exp}
                    className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-black"
                  >
                    <input
                      type="radio"
                      name="exp"
                      checked={selectedExperience === exp}
                      onChange={() => setSelectedExperience(exp)}
                      className="w-4 h-4 text-black focus:ring-0 cursor-pointer"
                    />
                    <span>{exp}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            {/* Job Type / Work Mode */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                Work Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-black">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedJobType === "all"}
                    onChange={() => setSelectedJobType("all")}
                    className="w-4 h-4 text-black focus:ring-0 cursor-pointer"
                  />
                  <span>All Types</span>
                </label>
                {jobTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-black"
                  >
                    <input
                      type="radio"
                      name="type"
                      checked={selectedJobType === type}
                      onChange={() => setSelectedJobType(type)}
                      className="w-4 h-4 text-black focus:ring-0 cursor-pointer"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* MOBILE FILTER DRAWER */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end lg:hidden">
              <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-gray-500 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-gray-800">
                    Department
                  </span>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-gray-800">
                    Experience
                  </span>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="all">Any Experience</option>
                    {experienceLevels.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-gray-800">
                    Work Type
                  </span>
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="all">All Types</option>
                    {jobTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="flex-1 py-2 text-xs border rounded-lg font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 py-2 text-xs bg-black text-white rounded-lg font-semibold"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MAIN JOBS LIST */}
          <section className="flex-1 space-y-4">
            {/* Results Header */}
            <div className="hidden lg:flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800">
                Showing {filteredJobs.length} open position{filteredJobs.length === 1 ? "" : "s"}
              </span>
              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Filtered by active criteria</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-black font-semibold underline hover:opacity-80"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-24 text-center">
                <div className="h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-gray-500">Loading current openings...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center space-y-3">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto opacity-50" />
                <h3 className="text-lg font-bold text-gray-900">
                  No matching jobs found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Try adjusting your keywords, department, or experience filters to find other openings.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:opacity-90 inline-block"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobDetails(job)}
                    className="group bg-white p-6 rounded-2xl border border-gray-200/80 hover:border-gray-400 hover:shadow-md transition-all duration-200 cursor-pointer space-y-4"
                  >
                    {/* Top Row: Title, Company, Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-black transition-colors flex items-center gap-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="font-semibold text-gray-700">Studio Daivikah</span>
                          <span>&bull;</span>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-medium">
                            {job.department}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-500/20">
                          Active Hiring
                        </span>
                      </div>
                    </div>

                    {/* Naukri-Style Attributes Row: Experience, Salary, Location, Type */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-gray-600 border-y border-gray-100 py-3">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{job.jobType}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1.5 font-medium text-gray-900">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Highlights tags if any */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-50 border border-gray-200/60 rounded-md text-[11px] text-gray-600"
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="text-[11px] text-gray-400 self-center">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer Row: Posted Date & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJobDetails(job);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenApply(job);
                          }}
                          className="px-5 py-2 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          Apply Now <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* MODAL 1: FULL JOB DETAILS */}
      {selectedJobDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-5 gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
                  {selectedJobDetails.department}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                  {selectedJobDetails.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" /> Studio Daivikah
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {selectedJobDetails.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> {selectedJobDetails.jobType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" /> {selectedJobDetails.experience}
                  </span>
                  {selectedJobDetails.salary && (
                    <span className="flex items-center gap-1 font-semibold text-gray-900">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> {selectedJobDetails.salary}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedJobDetails(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-lg shrink-0 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Role Overview */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                About the Role
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {selectedJobDetails.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            {selectedJobDetails.responsibilities &&
              selectedJobDetails.responsibilities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Key Responsibilities
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                    {selectedJobDetails.responsibilities.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Requirements & Qualifications */}
            {selectedJobDetails.requirements &&
              selectedJobDetails.requirements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Requirements & Qualifications
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                    {selectedJobDetails.requirements.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Benefits & Perks */}
            {selectedJobDetails.benefits &&
              selectedJobDetails.benefits.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    What We Offer
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                    {selectedJobDetails.benefits.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Footer Buttons */}
            <div className="pt-5 border-t flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedJobDetails(null)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const job = selectedJobDetails;
                  setSelectedJobDetails(null);
                  handleOpenApply(job);
                }}
                className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow"
              >
                Apply for this Position <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLICATION FORM ("APPLY NOW") */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-5">
            {submitSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Application Submitted!
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you for applying for <strong>{applyingJob.title}</strong> at Studio Daivikah. A confirmation email has been dispatched to <strong>{formData.email}</strong>. Our team will review your application and be in touch soon.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setApplyingJob(null);
                      setSubmitSuccess(false);
                    }}
                    className="px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Apply for {applyingJob.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {applyingJob.department} &bull; {applyingJob.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setApplyingJob(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  {/* Candidate Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>
                  </div>

                  {/* Candidate Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                      Experience Level *
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none bg-white"
                    >
                      <option value="Fresher / 0-1 Years">Fresher / 0-1 Years</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>

                  {/* Resume Link */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                      Resume / CV Link *
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        required
                        placeholder="Google Drive, Dropbox, or LinkedIn PDF URL"
                        value={formData.resumeUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, resumeUrl: e.target.value })
                        }
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Ensure the sharing link is set to &ldquo;Anyone with the link can view&rdquo;.
                    </p>
                  </div>

                  {/* Portfolio Link */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                      Portfolio / Work Link (Optional)
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        placeholder="Behance, Issuu, Website, or Drive link"
                        value={formData.portfolioUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, portfolioUrl: e.target.value })
                        }
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                      />
                    </div>
                  </div>

                  {/* Cover Letter / Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                      Cover Note / Message (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us briefly why you'd love to join Studio Daivikah..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3 flex items-center justify-end gap-3 border-t">
                    <button
                      type="button"
                      onClick={() => setApplyingJob(null)}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2 disabled:opacity-50 shadow cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
