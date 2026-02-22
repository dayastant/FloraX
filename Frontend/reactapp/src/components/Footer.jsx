import { motion } from "framer-motion";
import {
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Leaf size={30} className="text-green-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                FloraX
              </h2>
            </div>

            <p className="text-gray-400 leading-relaxed text-base md:text-lg">
              Smart irrigation system designed to optimize water usage,
              increase crop efficiency, and protect the environment.
            </p>

            <div className="flex gap-5 mt-6 sm:justify-start justify-center">
              <Facebook className="hover:text-green-500 cursor-pointer transition" />
              <Twitter className="hover:text-green-500 cursor-pointer transition" />
              <Instagram className="hover:text-green-500 cursor-pointer transition" />
              <Linkedin className="hover:text-green-500 cursor-pointer transition" />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-white text-lg md:text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-base md:text-lg">
              <li className="hover:text-green-500 cursor-pointer transition">
                Home
              </li>
              <li className="hover:text-green-500 cursor-pointer transition">
                About Us
              </li>
              <li className="hover:text-green-500 cursor-pointer transition">
                Features
              </li>
              <li className="hover:text-green-500 cursor-pointer transition">
                Contact
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-white text-lg md:text-xl font-semibold mb-5">
              Contact Us
            </h3>

            <ul className="space-y-4 text-base md:text-lg">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-green-500" />
                Colombo, Sri Lanka
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-green-500" />
                +94 77 123 4567
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-green-500" />
                info@florax.com
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h3 className="text-white text-lg md:text-xl font-semibold mb-5">
              Newsletter
            </h3>

            <p className="text-gray-400 mb-5 text-base md:text-lg">
              Subscribe to receive updates and irrigation tips.
            </p>

            <div className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
              />
              <button className="bg-green-600 px-6 py-3 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none hover:bg-green-700 transition text-white font-semibold">
                Subscribe
              </button>
            </div>
          </motion.div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-16 pt-6 text-center text-gray-500 text-sm md:text-base">
          © {new Date().getFullYear()} FloraX. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;