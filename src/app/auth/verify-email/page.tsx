"use client"; // Ensure this is a Client Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/axios";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isClient, setIsClient] = useState(false); // Fix hydration issue
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Prevents hydration mismatch
  }, []);

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("auth/verify-otp", { email, otp });
      setSuccess("OTP Verified! You can now log in.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
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
        <div className="absolute bg-gradient-to-b from-orange-500 to-orange-400 opacity-75 inset-0 z-0" />
        <div className="relative z-10 p-6 sm:p-12 bg-white rounded-2xl w-full max-w-md shadow-lg">
          <h3 className="font-semibold text-2xl text-gray-800 text-center">
            Verify Your Email
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Enter the OTP sent to your email.
          </p>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded mb-3">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-sm text-center bg-green-100 p-2 rounded mb-3">
              {success}
            </div>
          )}

          <form onSubmit={handleOtpVerification} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">
                Email
              </label>
              <input
                className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">
                OTP
              </label>
              <input
                className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center bg-orange-400 hover:bg-orange-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
            >
              Verify OTP
            </button>
          </form>

          <div className="pt-5 text-center text-gray-400 text-xs">
            <span>
              Didn't receive an OTP?{" "}
              <a href="/auth/resend-otp" className="text-orange-400 hover:text-orange-500">
                Resend OTP
              </a>
            </span>
          </div>
        </div>
      </div>
    )
  );
};

export default VerifyEmail;
