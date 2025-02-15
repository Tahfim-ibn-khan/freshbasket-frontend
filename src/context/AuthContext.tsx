"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCartItems(parsedUser.id);
    }

    // ✅ Listen for global state updates
    const handleUserUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(updatedUser);
      if (updatedUser?.id) {
        fetchCartItems(updatedUser.id);
      }
    };

    window.addEventListener("authStateChange", handleUserUpdate);

    return () => {
      window.removeEventListener("authStateChange", handleUserUpdate);
    };
  }, []);

  const fetchCartItems = async (userId: number) => {
    try {
      const res = await api.get(`/cart/${userId}`);
      setCartCount(res.data.length || 0);
    } catch (error) {
      setCartCount(0);
    }
  };

  const updateUser = (newUser: any) => {
    setUser(newUser);
    if (newUser?.id) {
      localStorage.setItem("user", JSON.stringify(newUser));
      fetchCartItems(newUser.id);
    } else {
      localStorage.removeItem("user");
      setCartCount(0);
    }

    // ✅ Broadcast update event
    window.dispatchEvent(new Event("authStateChange"));
  };

  const updateCartCount = () => {
    if (user?.id) fetchCartItems(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, cartCount, updateUser, updateCartCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
