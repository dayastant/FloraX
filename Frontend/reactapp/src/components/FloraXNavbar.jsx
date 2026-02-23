import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function FloraXNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-gradient-to-r from-white via-green-50 to-white shadow-lg fixed top-0 left-0 z-50 border-b border-green-100"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-green-600 to-green-400 p-1 rounded-full">
              <Leaf className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              FloraX
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="relative px-4 py-2 text-gray-700 font-medium transition-colors duration-300 group"
              >
                <span className={`transition-colors ${isActive(link.path) ? "text-green-600 font-bold" : "group-hover:text-green-600"}`}>
                  {link.name}
                </span>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-300"
                >
                  <FaUserCircle size={18} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}

            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 transition-all duration-300"
                >
                  <FaUserCircle className="text-green-600" size={20} />
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-2xl border border-green-100 overflow-hidden"
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 w-full px-5 py-3 hover:bg-green-50 transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-green-600" />
                        <span>Dashboard</span>
                      </Link>
                      <div className="border-t border-green-100"></div>
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="flex items-center gap-3 w-full px-5 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              {isOpen ? <X size={28} className="text-green-600" /> : <Menu size={28} className="text-gray-700" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-gradient-to-b from-white to-green-50 shadow-lg px-6 pb-6 border-b border-green-100"
            >
              <div className="flex flex-col gap-2 mt-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? "bg-green-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t border-green-200 my-3"></div>

                {!isLoggedIn && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-green-100 font-medium transition-all"
                    >
                      <FaUserCircle size={18} />
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Register
                    </Link>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 text-red-600 py-3 font-medium hover:bg-red-50 rounded-lg transition-all"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}