/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useState, useEffect } from "react";
import { Upload, Plus, Edit, Trash2, Save, X, Crop, Eye, EyeOff } from "lucide-react";
import ImageCropperModal from "../ImageCropperModal";

type TeamMember = {
  id: string;
  image: string;
  name?: string;
  role?: string;
  description?: string | null;
  isHidden?: boolean;
  createdAt: string;
};

const AdminTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    member: TeamMember | null;
  }>({
    show: false,
    member: null,
  });
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    targetMember?: TeamMember | null;
  }>({
    isOpen: false,
    imageUrl: "",
    targetMember: null,
  });

  // Load Cloudinary widget script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Fetch team members
  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/team?all=true");
      if (!response.ok) {
        console.warn("Error fetching team members:", response.statusText);
        setTeamMembers([]);
        return;
      }
      const data = await response.json();
      setTeamMembers(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (member: TeamMember) => {
    const nextHiddenState = !member.isHidden;
    try {
      const response = await fetch(`/api/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: nextHiddenState }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");
      const updated: TeamMember = await response.json();
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, isHidden: updated.isHidden ?? nextHiddenState } : m
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility status.");
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Create team member
  const createTeamMember = async (
    imageUrl: string,
    name: string,
    role: string,
    description: string
  ): Promise<TeamMember> => {
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl, name, role, description }),
      });

      if (!response.ok) throw new Error("Failed to create team member");
      const newMember: TeamMember = await response.json();
      setTeamMembers((prev) => [...prev, newMember]);
      return newMember;
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  };

  // Update team member
  const updateTeamMember = async (
    id: string,
    imageUrl: string,
    name: string,
    role: string,
    description: string
  ): Promise<TeamMember> => {
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl, name, role, description }),
      });

      if (!response.ok) throw new Error("Failed to update team member");
      const updatedMember: TeamMember = await response.json();
      setTeamMembers((prev) =>
        prev.map((member) => (member.id === id ? updatedMember : member))
      );
      return updatedMember;
    } catch (error) {
      console.error("Error updating team member:", error);
      throw error;
    }
  };

  // Delete team member
  const deleteTeamMember = async (id: string) => {
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team member");
      setTeamMembers((prev) => prev.filter((member) => member.id !== id));
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (member: TeamMember) => {
    setDeleteConfirm({ show: true, member });
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (deleteConfirm.member) {
      await deleteTeamMember(deleteConfirm.member.id);
      setDeleteConfirm({ show: false, member: null });
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, member: null });
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please upload an image");
      return;
    }

    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }

    try {
      setIsLoading(true);

      if (editingMember) {
        await updateTeamMember(
          editingMember.id,
          selectedImage,
          name.trim(),
          role.trim(),
          description.trim()
        );
        setEditingMember(null);
      } else {
        await createTeamMember(selectedImage, name.trim(), role.trim(), description.trim());
        setShowAddForm(false);
      }

      // Reset form
      setSelectedImage("");
      setName("");
      setRole("");
      setDescription("");
    } catch (error) {
      alert("Error saving team member.");
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing
  const startEdit = (member: TeamMember) => {
    setEditingMember(member);
    setSelectedImage(member.image);
    setName(member.name || "");
    setRole(member.role || "");
    setDescription(member.description || "");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingMember(null);
    setShowAddForm(false);
    setSelectedImage("");
    setName("");
    setRole("");
    setDescription("");
  };

  // Define a minimal Cloudinary type for TypeScript
  type Cloudinary = {
    createUploadWidget: (
      options: Record<string, unknown>,
      callback: (error: unknown, result: any) => void
    ) => { open: () => void };
  };

  const openCloudinaryWidget = () => {
    const cloudinary = (window as { cloudinary?: Cloudinary }).cloudinary;
    if (!cloudinary) return;

    const widget = cloudinary.createUploadWidget(
      {
        cloudName: "dbe4dwnzf",
        uploadPreset: "mpd_portfolio",
        sources: ["local", "url", "camera"],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 0.75,
        folder: "mpd/team",
        maxFileSize: 10000000,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
      },
      (error: unknown, result: any) => {
        if (!error && result.event === "success") {
          setSelectedImage(result.info.secure_url);
        }
      }
    );

    widget.open();
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-6 overflow-y-scroll">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
          Team Members
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 text-[12px] sm:text-[16px] rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Team Member
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && deleteConfirm.member && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Delete Team Member
            </h3>
            <div className="mb-4">
              <img
                src={deleteConfirm.member.image}
                alt="Delete preview"
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <p className="text-gray-600 mb-2">
                <strong>{deleteConfirm.member.name || "Unnamed"}</strong>
                {deleteConfirm.member.role && (
                  <span className="text-gray-500">
                    {" "}
                    - {deleteConfirm.member.role}
                  </span>
                )}
              </p>
              <p className="text-gray-600">
                Are you sure you want to delete this team member? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingMember) && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingMember ? "Edit Team Member" : "Add New Team Member"}
          </h2>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter team member name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter role/position (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description / Bio Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description / Bio
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter team member bio, background, architectural experience or role details..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image *
              </label>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={openCloudinaryWidget}
                  className="bg-gray-100 border-2 border-dashed rounded-lg p-6 text-center w-full cursor-pointer hover:bg-gray-50"
                >
                  {selectedImage ? (
                    <div className="space-y-2">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-w-xs max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <p className="text-sm text-gray-600">
                        Image selected - Click to change
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="text-gray-600">
                        Click to upload via Cloudinary
                      </p>
                    </div>
                  )}
                </button>

                {selectedImage && (
                  <button
                    type="button"
                    onClick={() =>
                      setCropperModal({
                        isOpen: true,
                        imageUrl: selectedImage,
                        targetMember: null,
                      })
                    }
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    <Crop size={16} />
                    Crop & Fit Team Member Image
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !selectedImage || !name.trim()}
                className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {isLoading ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">
              No team members found. Add your first team member!
            </p>
          </div>
        ) : (
          teamMembers.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden group transition-all max-w-[260px] w-full ${
                member.isHidden ? "border-2 border-amber-400/80 bg-amber-50/20" : ""
              }`}
            >
              <div className="aspect-square bg-gray-200 relative">
                <img
                  src={member.image}
                  alt={member.name || "Team member"}
                  className={`w-full h-full object-cover ${member.isHidden ? "opacity-75" : ""}`}
                />

                {member.isHidden ? (
                  <span className="absolute top-2 left-2 z-10 bg-amber-600 text-white text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded shadow">
                    Hidden from Site
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded shadow">
                    Visible on Site
                  </span>
                )}

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 z-20">
                  <button
                    onClick={() => toggleVisibility(member)}
                    title={member.isHidden ? "Click to unhide on website" : "Click to hide from website"}
                    className={`p-2 rounded-full text-white cursor-pointer transition ${
                      member.isHidden ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    {member.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() =>
                      setCropperModal({
                        isOpen: true,
                        imageUrl: member.image,
                        targetMember: member,
                      })
                    }
                    title="Crop Thumbnail"
                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 cursor-pointer"
                  >
                    <Crop size={16} />
                  </button>
                  <button
                    onClick={() => startEdit(member)}
                    title="Edit Member"
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 cursor-pointer"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => showDeleteConfirmation(member)}
                    title="Delete Member"
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {member.name || "Unnamed"}
                  </h3>
                  <div className="flex items-center gap-1">
                    {member.description && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full border border-blue-200">
                        Has Bio
                      </span>
                    )}
                    {member.isHidden ? (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    ) : (
                      <span className="text-[10px] bg-green-100 text-green-800 font-medium px-2 py-0.5 rounded-full">
                        Visible
                      </span>
                    )}
                  </div>
                </div>
                {member.role && (
                  <p className="text-xs text-gray-600 mt-1">{member.role}</p>
                )}
                {member.description && (
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 italic">
                    &quot;{member.description}&quot;
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Added: {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperModal.isOpen}
        imageUrl={cropperModal.imageUrl}
        defaultAspectRatio={3 / 4}
        title="Crop Team Member Image"
        onClose={() =>
          setCropperModal({ isOpen: false, imageUrl: "", targetMember: null })
        }
        onCropSave={async (croppedImageUrl) => {
          if (cropperModal.targetMember) {
            // Update existing team member directly
            await updateTeamMember(
              cropperModal.targetMember.id,
              croppedImageUrl,
              cropperModal.targetMember.name || "",
              cropperModal.targetMember.role || "",
              cropperModal.targetMember.description || ""
            );
          } else {
            // Update current form image
            setSelectedImage(croppedImageUrl);
          }
        }}
      />
    </div>
  );
};

export default AdminTeam;
