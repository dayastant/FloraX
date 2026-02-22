import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, LayoutDashboard, LogOut } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FloraXNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Temporary login state

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white shadow-lg fixed top-0 left-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="text-green-600" size={28} />
            <span className="text-2xl font-bold text-gray-800">
              Flora<span className="text-green-600">X</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-gray-600 font-medium hover:text-green-600 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                >
                  <FaUserCircle size={20} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center gap-2 text-red-500"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="md:hidden bg-white shadow-md px-6 pb-6"
            >
              <div className="flex flex-col gap-4 mt-4">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="text-gray-700 font-medium hover:text-green-600 transition"
                  >
                    {link.name}
                  </Link>
                ))}

                {!isLoggedIn && (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600"
                    >
                      <FaUserCircle size={20} />
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      Register
                    </Link>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <button className="flex items-center justify-center gap-2 text-red-500">
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