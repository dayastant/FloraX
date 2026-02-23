import React, { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, User, Mail, Phone, Lock, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.agree) newErrors.agree = "You must agree to terms & conditions";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("Register Data:", formData);
    // TODO: Call backend API /register
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-emerald-50">

      {/* LEFT ILLUSTRATION */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-green-600 to-emerald-600 p-6 md:p-16 text-white min-h-64 md:min-h-screen"
      >
        <Leaf size={64} className="mb-4 md:mb-6" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 text-center">
          Join <span className="">FloraX</span>
        </h1>
        <p className="text-sm md:text-lg max-w-md text-center opacity-90">
          Create your account to manage your smart garden irrigation and optimize water usage automatically.
        </p>
      </motion.div>

      {/* RIGHT FORM */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex flex-col justify-center p-6 md:p-12 bg-white overflow-y-auto"
      >
        <div className="max-w-md mx-auto w-full py-6 md:py-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
            Register
          </h2>
          <p className="text-center text-gray-600 mb-6 md:mb-8 text-sm md:text-base">Create your free account</p>

          <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base`}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base`}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base`}
                  autoComplete="new-password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base`}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.confirmPassword}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base"
              >
                <option value="USER">User (Homeowner)</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Terms */}
            <label className={`flex items-start gap-3 text-gray-700 text-sm md:text-base cursor-pointer p-3 rounded-lg ${errors.agree ? "bg-red-50 border border-red-200" : "bg-gray-50"}`}>
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="w-5 h-5 accent-green-600 mt-0.5 flex-shrink-0"
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" className="text-green-600 hover:underline font-medium">
                  Terms & Conditions
                </Link>
              </span>
            </label>
            {errors.agree && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.agree}</p>}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition text-sm md:text-base mt-6"
            >
              Create Account
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}