"use client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "../utils/axios";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.id) {
      fetchUserProfile(storedUser.id);
    }
  }, []);

  const fetchUserProfile = async (userId: number) => {
    try {
      const res = await api.get(`/users/profile/${userId}`);
      setUser(res.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn("User not authenticated.");
        localStorage.removeItem("user");
        setUser(null);
      } else {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  useEffect(() => {
    if (user?.id && user?.role === "customer") {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      if (!user?.id) return;
      const res = await api.get(`/cart/${user.id}`);
      setCartCount(res.data.length || 0);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("Cart is empty.");
        setCartCount(0);
      } else {
        console.error("Error fetching cart items:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    router.push("/auth/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-8">
      <div className="flex-1">
      <Link
        href={user?.role === "admin" ? "/admin/dashboard" : "/"}
        className="btn btn-ghost text-xl font-bold text-white"
      >
        <span className="text-green-400">Fresh</span>Basket
      </Link>

        {user?.role === "admin" ? (
          <div className="hidden lg:flex space-x-4">
            <Link href="/admin/dashboard" className="btn btn-ghost">Dashboard</Link>
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost">Products</label>
              <ul tabIndex={0} className="menu dropdown-content z-10 bg-base-100 rounded-box w-48 shadow-lg">
                <li><Link href="/admin/products">All Products</Link></li>
                <li><Link href="/admin/products/create">New Product</Link></li>
              </ul>
            </div>
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost">Users</label>
              <ul tabIndex={0} className="menu dropdown-content z-10 bg-base-100 rounded-box w-48 shadow-lg">
                <li><Link href="/admin/users">All Users</Link></li>
                <li><Link href="/admin/users/add">Add User</Link></li>
              </ul>
            </div>
            <Link href="/admin/orders" className="btn btn-ghost">Orders</Link>
          </div>
        ) : (
          <div className="hidden lg:flex space-x-4">
            <Link href="/" className="btn btn-ghost">Home</Link>
            <Link href="/products" className="btn btn-ghost">Products</Link>
          </div>
        )}
      </div>

      <div className="flex-none flex items-center space-x-4">
        {user?.role === "customer" && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="badge badge-sm indicator-item">{cartCount}</span>
              </div>
            </label>
            <div tabIndex={0} className="card dropdown-content bg-base-100 shadow-lg w-56 mt-3">
              <div className="card-body">
                <span className="text-lg font-bold">{cartCount} Items</span>
                <Link href="/cart" className="btn btn-primary btn-block">View Cart</Link>
              </div>
            </div>
          </div>
        )}

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    user.profilePicture
                      ? user.profilePicture
                      : "https://res.cloudinary.com/dquhmyg3y/image/upload/v1700000000/default-profile.png"
                  }
                  alt="User Avatar"
                />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow-lg w-52 mt-3 p-2">
              <li><Link href="/profile">Profile</Link></li>
              {user.role === "customer" && <li><Link href="/orders">Order History</Link></li>}
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          !pathname.startsWith("/auth") && (
            <div className="space-x-2">
              <Link href="/auth/register" className="btn bg-blue-500 text-white">Register</Link>
              <Link href="/auth/login" className="btn bg-green-500 text-white">Login</Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;
