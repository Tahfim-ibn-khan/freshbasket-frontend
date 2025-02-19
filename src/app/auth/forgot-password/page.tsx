"use client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useState, useEffect } from "react";
import api from "../../utils/axios";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
  
    try {
      const res = await api.post("/auth/forgot-password", { email });
  
      console.log("✅ API Response:", res.data);
  
      if (res.data?.message) {
        setMessage(res.data.message || "OTP sent successfully. Check your email.");
        
        setTimeout(() => {
          router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setError("Unexpected API response format.");
      }
    } catch (err: any) {
      console.error("❌ API Error:", err);
  
      if (err.response) {
        console.error("❌ Server Response Error:", err.response.data);
        setError(err.response.data?.message || "Error sending OTP. Please try again.");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
        <div className="absolute bg-gradient-to-b from-blue-500 to-blue-400 opacity-75 inset-0 z-0" />
        <div className="relative z-10 p-6 sm:p-12 bg-white rounded-2xl w-full max-w-md shadow-lg">
          <h3 className="font-semibold text-2xl text-gray-800 text-center">Forgot Password</h3>
          <p className="text-gray-500 text-center mb-4">
            Enter your email to receive an OTP for password reset.
          </p>

          {message && (
            <div className="text-green-500 text-sm text-center bg-green-100 p-2 rounded mb-3">
              {message}
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
              <input
                className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center ${
                loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              } text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Remembered your password?{" "}
              <a href="/auth/login" className="text-blue-500 font-semibold hover:text-blue-600">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    )
  );
};

export default ForgotPassword;
