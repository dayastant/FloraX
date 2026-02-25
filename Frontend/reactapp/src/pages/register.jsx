import React, { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, User, Mail, Phone, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { registerUser } from "../api/authService"; // import the auth service

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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



const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    setLoading(true);
    const response = await registerUser(formData);
    toast.success("Registration successful!");
    localStorage.setItem("token", response.token); // store JWT
    navigate("/login");
  } catch (err) {
    console.error(err);
    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Toaster position="top-right" />

      {/* Left illustration */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-green-600 to-emerald-500 p-8 md:p-16 text-white"
      >
        <Leaf size={64} className="mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">
          Join FloraX
        </h1>
        <p className="text-center text-lg opacity-90 max-w-md">
          Manage your smart garden irrigation and optimize water usage automatically.
        </p>
      </motion.div>

      {/* Right form */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-white"
      >
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Register</h2>
          <p className="text-center text-gray-600 mb-6">Create your free account</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/** Name */}
            <InputField
              label="Full Name" 
              name="name"
              placeholder="John Doe"
              icon={<User />}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autocomplete="name"
            />

            {/** Email */}
            <InputField
              label="Email"
              name="email"
              placeholder="your@email.com"
              icon={<Mail />}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autocomplete="email"
            />

            {/** Phone */}
            <InputField
              label="Phone Number"
              name="phone"
              placeholder="+1 (555) 000-0000"
              icon={<Phone />}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              autocomplete="tel"
            />

            {/** Password */}
            <InputField
              label="Password"
              name="password"
              placeholder="••••••"
              type="password"
              icon={<Lock />}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autocomplete="new-password"
            />

            {/** Confirm Password */}
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="••••••"
              type="password"
              icon={<Lock />}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              autocomplete="new-password"
            />

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 text-sm"
              >
                <option value="USER">User (Homeowner)</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Terms */}
            <label className={`flex items-start gap-3 text-gray-700 text-sm cursor-pointer p-3 rounded-lg ${errors.agree ? "bg-red-50 border border-red-200" : "bg-gray-50"}`}>
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="w-5 h-5 accent-green-600 mt-0.5"
              />
              <span>
                I agree to the{" "}
                <Link to="/terms" className="text-green-600 font-medium hover:underline">
                  Terms & Conditions
                </Link>
              </span>
            </label>
            {errors.agree && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} /> {errors.agree}</p>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition text-sm mt-4"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

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

// Reusable input component
const InputField = ({ label, name, value, onChange, icon, placeholder, type = "text", error, autocomplete }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400">{icon}</div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autocomplete}
        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${error ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition text-sm`}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
  </div>
);