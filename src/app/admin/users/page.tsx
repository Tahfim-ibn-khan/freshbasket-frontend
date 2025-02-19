"use client";

import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.email) {
      setLoggedInUserEmail(storedUser.email);
    }
  }, []);

  useEffect(() => {
    if (loggedInUserEmail) {
      fetchUsers();
    }
  }, [loggedInUserEmail]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/getall");
      if (loggedInUserEmail) {
        const filteredUsers = res.data.filter((user: User) => user.email !== loggedInUserEmail);
        setUsers(filteredUsers);
      }
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  const handleUpdateRole = async (id: number) => {
    const newRole = prompt("Enter new role (admin, customer, delivery-agent, store-manager):");
    if (!newRole) return;

    try {
      await api.post(`/users/update-role/${id}`, { role: newRole });
      alert("User role updated successfully!");
      fetchUsers();
    } catch (err) {
      alert("Failed to update user role.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">User Management</h2>

      <div className="flex justify-center mb-6">
        <Link
          href="/admin/users/add"
          className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
        >
          Add New User
        </Link>
      </div>

      {error && (
        <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg border border-red-300 mb-4">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-5 shadow-lg rounded-lg transition duration-300 hover:shadow-2xl"
          >
            <div className="flex justify-center">
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : "https://res.cloudinary.com/dquhmyg3y/image/upload/v1700000000/default-profile.png"
                }
                alt="User Avatar"
                className="h-24 w-24 object-cover rounded-full border-4 border-gray-300 shadow-md hover:shadow-lg transition duration-300"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://res.cloudinary.com/dquhmyg3y/image/upload/v1700000000/default-profile.png")
                }
              />
            </div>

            <h3 className="text-lg font-semibold text-center text-gray-900 mt-3">{user.name}</h3>
            <p className="text-gray-600 text-center">{user.email}</p>
            <p className="text-blue-600 font-semibold text-center mt-1 bg-blue-100 px-3 py-1 rounded-lg inline-block">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => handleUpdateRole(user.id)}
                className="text-blue-500 font-medium hover:underline"
              >
                Update Role
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
