"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/axios";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dquhmyg3y/upload";
const CLOUDINARY_UPLOAD_PRESET = "upload_profile";


const UpdateProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchUserProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser?.id) return;

        const res = await api.get(`/users/profile/${storedUser.id}`);
        setUser(res.data);
        setName(res.data.name);

        setPreview(res.data.profilePicture || "https://via.placeholder.com/150");
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }

      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.secure_url) throw new Error("Failed to upload image.");

      console.log("✅ Image uploaded successfully:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("❌ Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let uploadedImageUrl = preview;
      if (profilePicture) {
        uploadedImageUrl = await uploadToCloudinary(profilePicture);
        if (!uploadedImageUrl) throw new Error("Failed to upload image.");
      }

      const updatedProfile = {
        name,
        password: password || undefined,
        profilePicture: uploadedImageUrl,
      };

      console.log("📡 Sending update request:", updatedProfile);

      const response = await api.patch(`/users/profile/update/${user.id}`, updatedProfile);
      console.log("✅ Profile updated successfully:", response.data);

      alert("Profile updated successfully!");
      router.push("/profile");
    } catch (err: any) {
      console.error("❌ Profile update failed:", err.response?.data);
      setError(err.response?.data?.message || "Profile update failed.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading profile...</p>;

  return (
    <div className="container mx-auto m-10 p-6 max-w-md bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Update Profile</h2>

      {error && (
        <div className="text-red-600 text-sm bg-red-100 p-3 rounded-lg border border-red-300 mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleProfileUpdate} className="space-y-5">
        <div className="text-center">
          <img
            src={preview || "https://via.placeholder.com/150"}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full mx-auto border-4 border-gray-300 shadow-md hover:shadow-lg transition duration-300"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">New Password (optional)</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none cursor-pointer"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
