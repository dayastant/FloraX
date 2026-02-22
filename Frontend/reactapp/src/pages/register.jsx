import React, { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, User, Mail, Phone, Lock, ShieldCheck } from "lucide-react";
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call backend API /register
    console.log("Register Data:", formData);
    navigate("/login"); // Redirect to login after registration
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-emerald-50">

      {/* LEFT ILLUSTRATION */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-green-200 to-emerald-100 p-16"
      >
        <Leaf size={64} className="text-green-600 mb-6" />
        <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">
          Join <span className="text-green-600">FloraX</span>
        </h1>
        <p className="text-gray-700 text-lg max-w-md text-center">
          Create your account to manage your smart garden irrigation and optimize water usage automatically.
        </p>
      </motion.div>

      {/* RIGHT FORM */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 flex flex-col justify-center p-12 bg-white shadow-2xl"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Register
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="relative">
            <User className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-600 transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-600 transition"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-600 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-600 transition"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-600 transition"
            />
          </div>

          {/* Role Selection */}
          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full py-3 px-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-600 transition"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              required
              className="w-5 h-5 accent-green-600"
            />
            I agree to the{" "}
            <Link to="/terms" className="text-green-600 hover:underline">
              Terms & Conditions
            </Link>
          </label>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:bg-green-700 transition text-lg"
          >
            Register
          </motion.button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}