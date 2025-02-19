"use client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/axios";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const res = await api.post("/auth/login", { email, password });

      if (isClient) {
        if (res.data.accessToken) {
          localStorage.setItem("token", res.data.accessToken);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          throw new Error("Token not received from server.");
        }
      }

      if (!res.data.user.isVerified) {
        router.push("/auth/verify-email");
      } else {
        // ✅ Redirect based on user role
        if (res.data.user.role === "admin") {
          router.push("/admin/products");
        } else {
          router.push("/products");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  if (!isClient) return null;

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative min-h-screen flex justify-center items-center"
      style={{
        backgroundImage:
          "url(https://static.vecteezy.com/system/resources/previews/002/094/047/non_2x/fresh-foods-and-copy-space-on-a-shabby-white-background-free-photo.jpg)",
      }}
    >
      <div className="absolute bg-gradient-to-b from-green-500 to-green-400 opacity-75 inset-0 z-0" />
      <div className="relative z-10 p-6 sm:p-12 bg-white rounded-2xl w-full max-w-md shadow-lg">
        <h3 className="font-semibold text-2xl text-gray-800 text-center">
          Sign In
        </h3>
        <p className="text-gray-500 text-center mb-4">Please sign in to your account.</p>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-100 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">
              Email
            </label>
            <input
              className={`w-full text-base px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:border-green-400`}
              type="email"
              placeholder="mail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-gray-700 tracking-wide">
              Password
            </label>
            <div className="relative w-full">
              <input
                className={`w-full text-base px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:border-green-400`}
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="flex justify-end">
            <a href="/auth/forgot-password" className="text-green-500 hover:text-green-600 text-sm">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center bg-green-400 hover:bg-green-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
          >
            Sign in
          </button>

          <p className="text-center text-gray-600 text-sm mt-4">
            New to FreshBasket?{" "}
            <a href="/auth/register" className="text-green-500 font-semibold hover:text-green-600">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
