import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaLock } from "react-icons/fa";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: connect to backend API /login
    console.log("Login:", email, password);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-green-50">

      {/* LEFT ILLUSTRATION / BRAND */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-green-200 to-emerald-100 p-16"
      >
        <Leaf size={64} className="text-green-600 mb-6" />
        <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">
          Welcome to <span className="text-green-600">FloraX</span>
        </h1>
        <p className="text-gray-700 text-lg max-w-md text-center">
          Smart irrigation solution that automatically delivers water to your garden based on real-time soil data.
        </p>
      </motion.div>

      {/* RIGHT LOGIN FORM */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="lg:w-1/2 flex flex-col justify-center p-12 bg-white shadow-2xl"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Login</h2>

        <form className="space-y-6" onSubmit={handleLogin}>

          {/* Email */}
          <div className="relative">
            <FaUserCircle className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-600 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-600 transition"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-green-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:bg-green-700 transition text-lg"
          >
            Login
          </motion.button>

        </form>

        {/* Signup Link */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}