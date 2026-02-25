import React from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Sun,
  Cpu,
  Gauge,
  Leaf,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { FaWater } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full overflow-hidden">

      {/* HERO SECTION */}
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center pt-20 pb-10 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
              Smart Irrigation <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Powered by Nature</span>
            </h1>

            <p className="mt-4 md:mt-6 text-gray-600 text-base md:text-lg leading-relaxed">
              FloraX intelligently delivers the right amount of water to each
              garden zone using real-time soil moisture data, preventing
              overwatering, underwatering, and water waste.
            </p>

            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition font-semibold flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={18} />
              </Link>

              <Link
                to="/about"
                className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition font-semibold text-center"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* RIGHT ILLUSTRATION CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl backdrop-blur-lg order-1 md:order-2"
          >
            <div className="grid grid-cols-2 gap-4 md:gap-6 text-center">

              <motion.div whileHover={{ scale: 1.05, y: -4 }} className="p-4 md:p-6 bg-green-50 rounded-xl md:rounded-2xl">
                <Droplets className="mx-auto text-green-600" size={32} />
                <p className="mt-2 md:mt-3 font-semibold text-gray-700 text-sm md:text-base">
                  Soil Monitoring
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -4 }} className="p-4 md:p-6 bg-emerald-50 rounded-xl md:rounded-2xl">
                <Sun className="mx-auto text-yellow-500" size={32} />
                <p className="mt-2 md:mt-3 font-semibold text-gray-700 text-sm md:text-base">
                  Solar Powered
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -4 }} className="p-4 md:p-6 bg-green-50 rounded-xl md:rounded-2xl">
                <Cpu className="mx-auto text-blue-500" size={32} />
                <p className="mt-2 md:mt-3 font-semibold text-gray-700 text-sm md:text-base">
                  Smart Valves
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -4 }} className="p-4 md:p-6 bg-emerald-50 rounded-xl md:rounded-2xl">
                <Gauge className="mx-auto text-purple-500" size={32} />
                <p className="mt-2 md:mt-3 font-semibold text-gray-700 text-sm md:text-base">
                  Water Control
                </p>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-800"
          >
            Why Choose <span className="text-green-600">FloraX</span>?
          </motion.h2>

          <p className="mt-3 md:mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Designed for gardens, farms, and landscapes that demand precision,
            efficiency, and sustainability.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12 md:mt-16">

            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-6 md:p-8 bg-green-50 rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition"
            >
              <Leaf className="text-green-600 mx-auto" size={40} />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">
                Zone-Based Irrigation
              </h3>
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                Each garden zone receives water based on soil condition,
                eliminating uneven irrigation.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-6 md:p-8 bg-emerald-50 rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition"
            >
              <FaWater className="text-blue-500 mx-auto text-4xl" />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">
                Water Monitoring
              </h3>
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                Real-time tank level tracking prevents shortages and protects pumps.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-6 md:p-8 bg-green-50 rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition sm:col-span-2 lg:col-span-1"
            >
              <ShieldCheck className="text-green-700 mx-auto" size={40} />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">
                Reliable & Scalable
              </h3>
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                Distributed smart valves allow seamless scaling from gardens to farms.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            How FloraX Works
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12 md:mt-16 text-left">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg"
            >
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-green-600 mb-4">1</div>
              <h4 className="font-semibold text-lg">Monitor</h4>
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                Sensors track soil moisture, temperature, and humidity continuously.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg"
            >
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-green-600 mb-4">2</div>
              <h4 className="font-semibold text-lg">Analyze</h4>
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                The system processes real-time data to determine precise water requirements.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-lg sm:col-span-2 lg:col-span-1"
            >
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-green-600 mb-4">3</div>
              <h4 className="font-semibold text-lg">Act</h4>
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                Smart solar valves automatically deliver water where and when needed.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-center text-white px-4">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Transform Your Garden?
        </h2>
        <p className="mt-3 md:mt-4 text-base md:text-lg opacity-90 max-w-2xl mx-auto">
          Join thousands managing sustainable irrigation with FloraX.
        </p>

        <Link
          to="/register"
          className="inline-block mt-6 md:mt-8 px-6 md:px-8 py-3 bg-white text-green-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition"
        >
          Get Started Today
        </Link>
      </section>

    </div>
  );
}