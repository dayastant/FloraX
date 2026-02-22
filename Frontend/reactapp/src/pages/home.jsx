import React from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Sun,
  Cpu,
  Gauge,
  Leaf,
  ShieldCheck,
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
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center pt-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
              Smart Irrigation <br />
              <span className="text-green-600">Powered by Nature</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg">
              FloraX intelligently delivers the right amount of water to each
              garden zone using real-time soil moisture data, preventing
              overwatering, underwatering, and water waste.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-lg hover:bg-green-700 transition font-semibold"
              >
                Get Started
              </Link>

              <Link
                to="/about"
                className="px-6 py-3 border border-green-600 text-green-600 rounded-2xl hover:bg-green-50 transition font-semibold"
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
            className="bg-white p-8 rounded-3xl shadow-2xl backdrop-blur-lg"
          >
            <div className="grid grid-cols-2 gap-6 text-center">

              <div className="p-6 bg-green-50 rounded-2xl">
                <Droplets className="mx-auto text-green-600" size={36} />
                <p className="mt-3 font-semibold text-gray-700">
                  Soil Monitoring
                </p>
              </div>

              <div className="p-6 bg-emerald-50 rounded-2xl">
                <Sun className="mx-auto text-yellow-500" size={36} />
                <p className="mt-3 font-semibold text-gray-700">
                  Solar Powered
                </p>
              </div>

              <div className="p-6 bg-green-50 rounded-2xl">
                <Cpu className="mx-auto text-blue-500" size={36} />
                <p className="mt-3 font-semibold text-gray-700">
                  Smart Valves
                </p>
              </div>

              <div className="p-6 bg-emerald-50 rounded-2xl">
                <Gauge className="mx-auto text-purple-500" size={36} />
                <p className="mt-3 font-semibold text-gray-700">
                  Water Level Control
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-800"
          >
            Why Choose FloraX?
          </motion.h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Designed for gardens, farms, and landscapes that demand precision,
            efficiency, and sustainability.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-16">

            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 bg-green-50 rounded-3xl shadow-md"
            >
              <Leaf className="text-green-600 mx-auto" size={40} />
              <h3 className="mt-4 text-xl font-semibold">
                Zone-Based Irrigation
              </h3>
              <p className="mt-3 text-gray-600">
                Each garden zone receives water based on its own soil condition,
                eliminating uneven irrigation.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 bg-emerald-50 rounded-3xl shadow-md"
            >
              <FaWater className="text-blue-500 mx-auto text-4xl" />
              <h3 className="mt-4 text-xl font-semibold">
                Water Resource Monitoring
              </h3>
              <p className="mt-3 text-gray-600">
                Real-time tank level tracking prevents shortages and protects
                pumps from dry-running.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -8 }}
              className="p-8 bg-green-50 rounded-3xl shadow-md"
            >
              <ShieldCheck className="text-green-700 mx-auto" size={40} />
              <h3 className="mt-4 text-xl font-semibold">
                Reliable & Scalable
              </h3>
              <p className="mt-3 text-gray-600">
                Distributed smart valves with centralized monitoring allow
                seamless scaling from gardens to farms.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold text-gray-800">
            How FloraX Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 mt-16 text-left">

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-semibold text-lg">1. Monitor</h4>
              <p className="mt-3 text-gray-600">
                Sensors track soil moisture, temperature, and humidity in each
                irrigation zone continuously.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-semibold text-lg">2. Analyze</h4>
              <p className="mt-3 text-gray-600">
                The system processes real-time data to determine precise water
                requirements.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h4 className="font-semibold text-lg">3. Act</h4>
              <p className="mt-3 text-gray-600">
                Smart solar valves automatically deliver water only where and
                when needed.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600 text-center text-white">
        <h2 className="text-4xl font-bold">
          Ready to Transform Your Garden?
        </h2>
        <p className="mt-4 text-lg opacity-90">
          Join the future of sustainable irrigation with FloraX.
        </p>

        <Link
          to="/login"
          className="inline-block mt-8 px-8 py-3 bg-white text-green-600 rounded-2xl font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Go to Dashboard
        </Link>
      </section>

    </div>
  );
}