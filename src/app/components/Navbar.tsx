"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "../utils/axios";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      menuRef.current && !menuRef.current.contains(e.target as Node) &&
      dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
    ) {
      setMenuOpen(false);
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="bg-gray-900 shadow-md px-4 lg:px-8">
      <div className="flex justify-between items-center py-4">
        {/* Left Section */}
        <Link
          href={user?.role === "admin" ? "/admin/dashboard" : "/"}
          className="text-2xl font-bold text-white"
        >
          <span className="text-green-400">Fresh</span>Basket
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6">
          {user?.role === "admin" ? (
            <>
              <Link href="/admin/dashboard" className="text-white hover:text-green-400">
                Dashboard
              </Link>
              <div className="relative group">
                <button className="text-white hover:text-green-400">Products</button>
                <div className="absolute hidden group-hover:block bg-gray-800 rounded-md shadow-md mt-2">
                  <Link href="/admin/products" className="block px-4 py-2 text-white hover:bg-gray-700">
                    All Products
                  </Link>
                  <Link href="/admin/products/create" className="block px-4 py-2 text-white hover:bg-gray-700">
                    New Product
                  </Link>
                </div>
              </div>
              <Link href="/admin/orders" className="text-white hover:text-green-400">
                Orders
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="text-white hover:text-green-400">
                Home
              </Link>
              <Link href="/products" className="text-white hover:text-green-400">
                Products
              </Link>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {user?.role === "customer" && (
            <Link href="/cart" className="relative text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            </Link>
          )}

          {user ? (
            <div ref={dropdownRef} className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
                <img
                  src={
                    user.profilePicture
                      ? user.profilePicture
                      : "https://res.cloudinary.com/dquhmyg3y/image/upload/v1700000000/default-profile.png"
                  }
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full border-2 border-gray-500"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-md z-10">
                  <Link href="/profile" className="block px-4 py-2 text-white hover:bg-gray-700">
                    Profile
                  </Link>
                  {user.role === "customer" && (
                    <Link href="/orders" className="block px-4 py-2 text-white hover:bg-gray-700">
                      Order History
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-white hover:bg-gray-700 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            !pathname.startsWith("/auth") && (
              <div className="space-x-2">
                <Link href="/auth/register" className="text-white bg-blue-500 px-3 py-2 rounded-lg">
                  Register
                </Link>
                <Link href="/auth/login" className="text-white bg-green-500 px-3 py-2 rounded-lg">
                  Login
                </Link>
              </div>
            )
          )}

          {/* Hamburger Menu */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div ref={menuRef} className="lg:hidden flex flex-col bg-gray-900 space-y-2 p-4">
          <Link href="/" className="text-white">Home</Link>
          <Link href="/products" className="text-white">Products</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
