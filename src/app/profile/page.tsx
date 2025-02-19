"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/axios";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchUserProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (!storedUser?.id) return;

        const res = await api.get(`/users/profile/${storedUser.id}`);
        setUser(res.data);

        setProfileImage(res.data.profilePicture || "https://via.placeholder.com/150");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p className="text-center text-gray-600 text-lg mt-10">Loading profile...</p>;

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h2>

      {user ? (
        <div className="border p-6 rounded-lg shadow-lg bg-white text-center">
          <div className="flex justify-center">
            <img
              src={profileImage}
              className="w-32 h-32 rounded-full mx-auto border-4 border-gray-300 shadow-md hover:shadow-lg transition duration-300"
              alt="User Profile"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://cdn2.iconfinder.com/data/icons/business-hr-and-recruitment/100/account_blank_face_dummy_human_mannequin_profile_user_-512.png")
              }
            />
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-4">{user.name}</h3>
          <p className="text-gray-600 text-lg">{user.email}</p>

          <button
            onClick={() => router.push("/profile/update")}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 transition-all duration-300"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">No profile found.</p>
      )}
    </div>
  );
};

export default Profile;
