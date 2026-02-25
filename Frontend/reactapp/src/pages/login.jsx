import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Leaf, AlertCircle, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      // Store JWT token in localStorage
      localStorage.setItem("token", data.token);
      // Redirect to home / dashboard after successful login
      navigate("/");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Login failed. Please check your credentials.";
      setApiError(typeof msg === "string" ? msg : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-green-50">

      {/* LEFT BRAND PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-green-600 to-emerald-600 p-6 md:p-16 text-white min-h-64 md:min-h-screen"
      >
        <Leaf size={64} className="mb-4 md:mb-6" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-center">
          Welcome to <span>FloraX</span>
        </h1>
        <p className="text-sm md:text-lg max-w-md text-center opacity-90">
          Smart irrigation solution that automatically delivers water to your
          garden based on real-time soil data.
        </p>
      </motion.div>

      {/* RIGHT LOGIN FORM */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white"
      >
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
            Login
          </h2>
          <p className="text-center text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
            Sign in to your account
          </p>

          {/* API Error Banner */}
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm"
            >
              <AlertCircle size={16} />
              {apiError}
            </motion.div>
          )}

          <form className="space-y-4 md:space-y-5" onSubmit={handleLogin}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <FaUserCircle className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base`}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full pl-12 pr-12 py-3 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base`}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition text-sm md:text-base mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </motion.button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}