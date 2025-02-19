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
  const router = useRouter();

  useEffect(() => {
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
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-6 sm:p-12 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-semibold text-gray-800 text-center">Reset Password</h3>
        <p className="text-gray-500 text-center mb-4">Enter the OTP sent to your email and set a new password.</p>

        {message && (
          <div className="text-green-500 text-sm text-center bg-green-100 p-2 rounded mb-3">
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              type="email"
              value={email}
              readOnly
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">OTP</label>
            <input
              className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input
              className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-purple-600"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
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
  );
};

export default ResetPassword;
