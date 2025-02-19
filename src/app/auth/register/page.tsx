"use client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/axios";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validateForm = () => {
    let newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else {
      const minLength = /.{8,}/;
      const uppercase = /[A-Z]/;
      const lowercase = /[a-z]/;
      const number = /[0-9]/;
      const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

      if (!minLength.test(formData.password)) {
        newErrors.password = "Password must be at least 8 characters long.";
        isValid = false;
      } else if (!uppercase.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter.";
        isValid = false;
      } else if (!lowercase.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter.";
        isValid = false;
      } else if (!number.test(formData.password)) {
        newErrors.password = "Password must contain at least one number.";
        isValid = false;
      } else if (!specialChar.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setErrors({ name: "", email: "", password: "" });

    if (!validateForm()) {
      console.log("Validation failed. API request not sent.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register", formData);
      setSuccess("Registration successful. Check your email for OTP to verify your account.");

      setTimeout(() => {
        router.push("/auth/verify-email");
      }, 2000);
    } catch (err: any) {
      if (err.response?.data?.message === "User with this email already exists") {
        setErrors((prev) => ({ ...prev, email: "User with this email already exists." }));
      } else {
        setErrors((prev) => ({ ...prev, email: err.response?.data?.message || "Registration failed." }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="bg-no-repeat bg-cover bg-center relative min-h-screen flex justify-center items-center"
      style={{ backgroundImage: "url(https://static.vecteezy.com/system/resources/previews/002/094/047/non_2x/fresh-foods-and-copy-space-on-a-shabby-white-background-free-photo.jpg)" }}>
      <div className="absolute bg-gradient-to-b from-blue-500 to-blue-400 opacity-75 inset-0 z-0" />
      <div className="relative z-10 p-6 sm:p-12 bg-white rounded-2xl w-full max-w-md shadow-lg">
        <h3 className="font-semibold text-2xl text-gray-800 text-center">Create Account</h3>
        <p className="text-gray-500 text-center mb-4">Sign up to continue.</p>

        {success && (
          <div className="text-green-500 text-sm text-center bg-green-100 p-2 rounded mb-3">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">Full Name</label>
            <input className={`w-full text-base px-4 py-2 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-400`}
              type="text" placeholder="Your Name" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
            <input className={`w-full text-base px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:border-blue-400`}
              type="email" placeholder="yourmail@gmail.com" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-gray-700 tracking-wide">Password</label>
            <div className="relative w-full">
              <input
                className={`w-full text-base px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:border-blue-400`}
                type={showPassword ? "text" : "password"} 
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading}
            className={`w-full flex justify-center ${loading ? "bg-blue-300" : "bg-blue-400 hover:bg-blue-500"} text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500`}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="pt-5 text-center text-gray-400 text-xs">
          <span>Already have an account?
            <a href="/auth/login" className="text-blue-400 hover:text-blue-500"> Sign In</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
