"use client"; 

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "../../utils/axios";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(""); 
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setEmail(searchParams.get("email") || "");
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error) {
      setMessage("Invalid OTP or failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    isClient && (
      <div
        className="bg-no-repeat bg-cover bg-center relative min-h-screen flex justify-center items-center"
        style={{
          backgroundImage:
            "url(https://static.vecteezy.com/system/resources/previews/002/094/047/non_2x/fresh-foods-and-copy-space-on-a-shabby-white-background-free-photo.jpg)",
        }}
      >
        <div className="absolute bg-gradient-to-b from-purple-500 to-purple-400 opacity-75 inset-0 z-0" />
        <div className="relative z-10 p-6 sm:p-12 bg-white rounded-2xl w-full max-w-md shadow-lg">
          <h3 className="font-semibold text-2xl text-gray-800 text-center">Reset Password</h3>
          <p className="text-gray-500 text-center mb-4">
            Enter the OTP sent to your email and set a new password.
          </p>

          {message && (
            <div className="text-green-500 text-sm text-center bg-green-100 p-2 rounded mb-3">
              {message}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
              <input
                className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                type="email"
                value={email}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">OTP</label>
              <input
                className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">New Password</label>
              <input
                className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center bg-purple-500 hover:bg-purple-600 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
            >
              Reset Password
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Back to{" "}
              <a href="/auth/login" className="text-purple-500 font-semibold hover:text-purple-600">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    )
  );
};

export default ResetPassword;
