/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  FileText,
  Mail,
  Phone,
  Calendar,
  Layers,
  MapPin,
  Award,
} from "lucide-react";

export interface JobItem {
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
  updatedAt: string;
  _count?: {
    applications: number;
  };
}

export interface ApplicationItem {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  portfolioUrl?: string | null;
  resumeUrl?: string | null;
  message?: string | null;
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | string;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
}

const DEPARTMENTS = [
  "Architecture",
  "Interior Design",
  "3D Visualization",
  "Urban Planning & Design",
  "Landscape Architecture",
  "Project Management",
  "Site Engineering",
  "Business & Operations",
];

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];

const EXPERIENCE_LEVELS = [
  "0-1 Years (Fresher)",
  "1-3 Years",
  "3-5 Years",
  "5+ Years",
];

export default function AdminCareers() {
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");

  // Jobs state
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    type: "job" | "application";
    id: string;
    title: string;
  }>({
    show: false,
    type: "job",
    id: "",
    title: "",
  });

  // Job form fields
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Architecture",
    location: "Chennai (On-site)",
    jobType: "Full-time",
    experience: "0-1 Years (Fresher)",
    salary: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    isOpen: true,
    isHidden: false,
  });

  // Applications state
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState<boolean>(false);
  const [appFilterJobId, setAppFilterJobId] = useState<string>("all");
  const [appFilterStatus, setAppFilterStatus] = useState<string>("all");
  const [appSearch, setAppSearch] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  // Fetch Jobs
  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch("/api/careers?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Fetch Applications
  const fetchApplications = async () => {
    setIsLoadingApps(true);
    try {
      const params = new URLSearchParams();
      if (appFilterJobId !== "all") params.append("jobId", appFilterJobId);
      if (appFilterStatus !== "all") params.append("status", appFilterStatus);
      if (appSearch) params.append("search", appSearch);

      const res = await fetch(`/api/careers/applications?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.applications)) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab, appFilterJobId, appFilterStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  // Reset Job form
  const resetJobForm = () => {
    setJobForm({
      title: "",
      department: "Architecture",
      location: "Chennai (On-site)",
      jobType: "Full-time",
      experience: "0-1 Years (Fresher)",
      salary: "",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      isOpen: true,
      isHidden: false,
    });
    setEditingJob(null);
  };

  const openAddJobModal = () => {
    resetJobForm();
    setShowJobModal(true);
  };

  const openEditJobModal = (job: JobItem) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      jobType: job.jobType,
      experience: job.experience,
      salary: job.salary || "",
      description: job.description,
      responsibilities: (job.responsibilities || []).join("\n"),
      requirements: (job.requirements || []).join("\n"),
      benefits: (job.benefits || []).join("\n"),
      isOpen: job.isOpen,
      isHidden: job.isHidden,
    });
    setShowJobModal(true);
  };

  // Submit Job (Create or Update)
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: jobForm.title,
        department: jobForm.department,
        location: jobForm.location,
        jobType: jobForm.jobType,
        experience: jobForm.experience,
        salary: jobForm.salary || null,
        description: jobForm.description,
        responsibilities: jobForm.responsibilities
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: jobForm.requirements
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        benefits: jobForm.benefits
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        isOpen: jobForm.isOpen,
        isHidden: jobForm.isHidden,
      };

      let res;
      if (editingJob) {
        res = await fetch(`/api/careers/${editingJob.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowJobModal(false);
        resetJobForm();
        fetchJobs();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to save job");
      }
    } catch (err) {
      console.error("Error saving job", err);
      alert("Error saving job. Please check connection.");
    }
  };

  // Toggle isHidden or isOpen
  const handleToggleJob = async (
    id: string,
    field: "isHidden" | "isOpen",
    currentValue: boolean
  ) => {
    try {
      const res = await fetch(`/api/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      if (res.ok) {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === id ? { ...job, [field]: !currentValue } : job
          )
        );
      }
    } catch (err) {
      console.error(`Failed to toggle ${field}`, err);
    }
  };

  // Delete Job or Application
  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirm.type === "job") {
        const res = await fetch(`/api/careers/${deleteConfirm.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setJobs((prev) => prev.filter((j) => j.id !== deleteConfirm.id));
        }
      } else {
        const res = await fetch(
          `/api/careers/applications?id=${deleteConfirm.id}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          setApplications((prev) =>
            prev.filter((a) => a.id !== deleteConfirm.id)
          );
          if (selectedApp?.id === deleteConfirm.id) setSelectedApp(null);
        }
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleteConfirm({ show: false, type: "job", id: "", title: "" });
    }
  };

  // Update Application Status
  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/careers/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === appId ? { ...app, status: newStatus } : app
          )
        );
        if (selectedApp?.id === appId) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SHORTLISTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <UserCheck className="w-3.5 h-3.5" /> Shortlisted
          </span>
        );
      case "REVIEWED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <UserX className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto py-6">
      {/* Top Header / Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-neutral-800 dark:text-neutral-200" />
            Careers & Job Openings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage open job listings, unique job attributes, and view candidate applications.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-gray-100 dark:bg-neutral-900 p-1 rounded-xl border border-gray-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "jobs"
                ? "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "applications"
                ? "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Applications ({applications.length || jobs.reduce((sum, j) => sum + (j._count?.applications || 0), 0)})
          </button>
        </div>
      </div>

      {/* TAB 1: JOBS */}
      {activeTab === "jobs" && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{jobs.length}</span> positions
            </div>
            <button
              onClick={openAddJobModal}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Post New Job
            </button>
          </div>

          {isLoadingJobs ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              Loading jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-20 border border-dashed border-gray-300 dark:border-neutral-800 rounded-2xl text-center bg-gray-50/50 dark:bg-neutral-900/40">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                No jobs posted yet
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Create your first job posting with custom attributes like department, location, experience, and full descriptions.
              </p>
              <button
                onClick={openAddJobModal}
                className="mt-4 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-90 inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Post New Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    job.isHidden
                      ? "bg-gray-50/60 dark:bg-neutral-900/40 border-gray-200 dark:border-neutral-800 opacity-75"
                      : "bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 shadow-sm hover:border-gray-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                          {job.department}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300">
                          {job.jobType}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300">
                          {job.experience}
                        </span>
                        {job.isOpen ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Open
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                            Closed
                          </span>
                        )}
                        {job.isHidden && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Hidden from public
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            {job.salary}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <strong>{job._count?.applications || 0}</strong> applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 max-w-3xl">
                        {job.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                      {/* View applications for this job */}
                      <button
                        onClick={() => {
                          setAppFilterJobId(job.id);
                          setActiveTab("applications");
                        }}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="View applications"
                      >
                        <Users className="w-3.5 h-3.5" />
                        Applications ({job._count?.applications || 0})
                      </button>

                      {/* Open/Close toggle */}
                      <button
                        onClick={() => handleToggleJob(job.id, "isOpen", job.isOpen)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          job.isOpen
                            ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-neutral-700 dark:text-gray-400"
                        }`}
                        title={job.isOpen ? "Close Job" : "Open Job"}
                      >
                        {job.isOpen ? "Open" : "Closed"}
                      </button>

                      {/* Hide/Show toggle */}
                      <button
                        onClick={() => handleToggleJob(job.id, "isHidden", job.isHidden)}
                        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                          job.isHidden
                            ? "border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                            : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-neutral-700 dark:text-gray-400"
                        }`}
                        title={job.isHidden ? "Unhide Job" : "Hide Job from Careers Page"}
                      >
                        {job.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openEditJobModal(job)}
                        className="p-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            show: true,
                            type: "job",
                            id: job.id,
                            title: job.title,
                          })
                        }
                        className="p-2 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICATIONS */}
      {activeTab === "applications" && (
        <div className="mt-6 space-y-6">
          {/* Filters Bar */}
          <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-2xl border border-gray-200 dark:border-neutral-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name, email, phone..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {/* Job Filter */}
              <select
                value={appFilterJobId}
                onChange={(e) => setAppFilterJobId(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="all">All Job Positions</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={appFilterStatus}
                onChange={(e) => setAppFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-neutral-950 border border-gray-300 dark:border-neutral-700 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="REJECTED">Rejected</option>
              </select>

              {(appFilterJobId !== "all" || appFilterStatus !== "all" || appSearch) && (
                <button
                  onClick={() => {
                    setAppFilterJobId("all");
                    setAppFilterStatus("all");
                    setAppSearch("");
                  }}
                  className="px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Applications Content */}
          {isLoadingApps ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="py-20 border border-dashed border-gray-300 dark:border-neutral-800 rounded-2xl text-center bg-gray-50/50 dark:bg-neutral-900/40">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                No applications found
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Candidate applications submitted through the Careers page will appear here instantly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 dark:border-neutral-900 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          {app.name}
                        </h3>
                        {getStatusBadge(app.status)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Applied for <span className="font-semibold text-gray-800 dark:text-gray-200">{app.job?.title || "Position"}</span> &bull; {app.job?.department}
                      </p>
                    </div>

                    {/* Status updater & delete */}
                    <div className="flex items-center gap-2 self-start md:self-center">
                      <div className="text-xs text-gray-400 mr-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>

                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                        className="px-2.5 py-1.5 bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 focus:outline-none"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWED">Reviewed</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            show: true,
                            type: "application",
                            id: app.id,
                            title: `${app.name}'s application`,
                          })
                        }
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Candidate contact info & links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <a href={`mailto:${app.email}`} className="hover:underline truncate">
                        {app.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <a href={`tel:${app.phone}`} className="hover:underline">
                        {app.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Layers className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Experience: <strong>{app.experience}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.resumeUrl && (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90"
                        >
                          <FileText className="w-3.5 h-3.5" /> Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {app.portfolioUrl && (
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-neutral-700"
                        >
                          Portfolio <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Candidate Cover Letter / Note */}
                  {app.message && (
                    <div className="bg-gray-50 dark:bg-neutral-900 p-3 rounded-xl text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line border border-gray-200/60 dark:border-neutral-800">
                      <strong className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Note / Cover Letter:
                      </strong>
                      {app.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: POST / EDIT JOB */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingJob ? "Edit Job Position" : "Create New Job Position"}
              </h2>
              <button
                onClick={() => setShowJobModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJobSubmit} className="space-y-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Architect / Junior Interior Designer"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              {/* Attributes Grid: Department, Location, Type, Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Department *
                  </label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Job Type *
                  </label>
                  <select
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Experience Level *
                  </label>
                  <select
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                  >
                    {EXPERIENCE_LEVELS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai (On-site) or Hybrid"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Salary / Compensation */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Salary / Compensation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹3,50,000 - ₹5,00,000 P.A. or Negotiable"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Role Overview / Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the role, studio culture, and what candidate will be working on..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Key Responsibilities (One item per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Lead architectural design concepts&#10;Coordinate with structural engineers and vendors&#10;Prepare working drawings in AutoCAD/Revit"
                  value={jobForm.responsibilities}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Requirements & Qualifications */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Requirements & Qualifications (One item per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="B.Arch or M.Arch degree&#10;Proficiency in AutoCAD, SketchUp, Lumion/V-Ray&#10;Strong communication and client handling skills"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Benefits & Perks (One item per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Competitive compensation&#10;Creative studio environment&#10;Hands-on site exposure"
                  value={jobForm.benefits}
                  onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={jobForm.isOpen}
                    onChange={(e) => setJobForm({ ...jobForm, isOpen: e.target.checked })}
                    className="w-4 h-4 rounded text-black focus:ring-0"
                  />
                  <span>Active Opening (Accepting applications)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={jobForm.isHidden}
                    onChange={(e) => setJobForm({ ...jobForm, isHidden: e.target.checked })}
                    className="w-4 h-4 rounded text-black focus:ring-0"
                  />
                  <span>Hide from public site</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingJob ? "Save Changes" : "Post Job Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() =>
                  setDeleteConfirm({ show: false, type: "job", id: "", title: "" })
                }
                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
