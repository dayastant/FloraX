import React from "react";
import { motion } from "framer-motion";
import { Leaf, Droplets, Sun, Cpu, Gauge, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-white to-green-50">

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center py-20 px-4 md:py-24 md:px-6 lg:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Leaf size={48} className="text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800">
            About <span className="text-green-600">FloraX</span>
          </h1>
          <p className="mt-4 md:mt-6 text-gray-700 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            FloraX is an intelligent garden management solution designed to optimize irrigation, conserve water, and support healthy plant growth. From small home gardens to medium-sized farms, we make smart irrigation accessible.
          </p>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-16">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center"
        >
          The Problem
        </motion.h2>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          transition={{ duration: 0.8 }}
          className="bg-red-50 border-l-4 border-red-600 p-6 md:p-8 rounded-lg"
        >
          <p className="text-gray-700 text-base md:text-lg">
            Traditional irrigation wastes water by applying the same amount to all zones. Some areas dry out faster, others stay wet, leading to overwatering, underwatering, plant stress, and poor growth. Additionally, manual schedules ignore real-time soil conditions.
          </p>
        </motion.div>
      </section>

      {/* Solution Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-16 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 md:mb-16"
          >
            Our Solution
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">

            <motion.div whileHover={{ y: -8 }} className="p-6 md:p-8 bg-green-50 rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition">
              <Droplets className="mx-auto text-green-600" size={40} />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">Soil Monitoring</h3>
              <p className="mt-3 text-gray-700 text-sm md:text-base">
                Real-time soil moisture sensors deliver precise irrigation for each zone.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="p-6 md:p-8 bg-emerald-50 rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition">
              <Sun className="mx-auto text-yellow-500" size={40} />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">Solar Powered</h3>
              <p className="mt-3 text-gray-700 text-sm md:text-base">
                Each smart valve is powered by solar energy, reducing electricity dependency.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="p-6 md:p-8 bg-green-50 rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition">
              <Cpu className="mx-auto text-blue-500" size={40} />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">Smart Valves</h3>
              <p className="mt-3 text-gray-700 text-sm md:text-base">
                Distributed valves automatically control water flow based on soil data.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="p-6 md:p-8 bg-emerald-50 rounded-2xl md:rounded-3xl shadow-md hover:shadow-lg transition">
              <Gauge className="mx-auto text-purple-500" size={40} />
              <h3 className="mt-4 text-lg md:text-xl font-semibold">Water Management</h3>
              <p className="mt-3 text-gray-700 text-sm md:text-base">
                Continuous monitoring ensures uninterrupted irrigation and prevents waste.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Uniqueness / Vision Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-16 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-12"
          >
            Why FloraX Stands Out
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            transition={{ duration: 0.8 }}
            className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed"
          >
            FloraX combines distributed intelligence with centralized monitoring, eliminating overwatering and under-watering while improving water-use efficiency. Modular, solar-powered valves allow scalable, sustainable garden and farm management.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 text-left">

            <motion.div whileHover={{ y: -8 }} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition">
              <Leaf className="text-green-600 mx-auto md:mx-0" size={40} />
              <h3 className="mt-4 font-semibold text-lg md:text-xl text-center md:text-left">Eco-Friendly</h3>
              <p className="mt-2 text-gray-700 text-sm md:text-base">Solar-powered system reduces energy usage and carbon footprint.</p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition">
              <ShieldCheck className="text-green-700 mx-auto md:mx-0" size={40} />
              <h3 className="mt-4 font-semibold text-lg md:text-xl text-center md:text-left">Reliable & Secure</h3>
              <p className="mt-2 text-gray-700 text-sm md:text-base">Distributed valves with centralized monitoring ensures robust management.</p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition sm:col-span-2 lg:col-span-1">
              <Zap className="text-blue-500 mx-auto md:mx-0" size={40} />
              <h3 className="mt-4 font-semibold text-lg md:text-xl text-center md:text-left">Smart Automation</h3>
              <p className="mt-2 text-gray-700 text-sm md:text-base">Automated soil-based decisions minimize intervention and water wastage.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-center text-white px-4">
        <h2 className="text-3xl md:text-4xl font-bold">Join FloraX Today</h2>
        <p className="mt-3 md:mt-4 text-base md:text-lg opacity-90 max-w-2xl mx-auto">
          Start managing your garden with precision and efficiency.
        </p>
        <Link
          to="/register"
          className="inline-block mt-6 md:mt-8 px-6 md:px-8 py-3 bg-white text-green-600 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition"
        >
          Get Started
        </Link>
      </section>

    </div>
  );
}