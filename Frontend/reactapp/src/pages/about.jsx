import React from "react";
import { motion } from "framer-motion";
import { Leaf, Droplets, Sun, Cpu, Gauge, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full overflow-hidden bg-emerald-50">

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col justify-center items-center py-24 px-6 lg:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Leaf size={48} className="text-green-600 mx-auto mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
            About <span className="text-green-600">FloraX</span>
          </h1>
          <p className="mt-6 text-gray-700 text-lg max-w-2xl mx-auto">
            FloraX is an intelligent garden management solution designed to optimize irrigation, conserve water, and support healthy plant growth. From small home gardens to medium-sized farms, we make smart irrigation accessible for everyone.
          </p>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-16">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-800 mb-8 text-center"
        >
          The Problem
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          transition={{ duration: 0.8 }}
          className="text-gray-700 text-lg max-w-3xl mx-auto text-center"
        >
          Traditional irrigation wastes water by applying the same amount to all zones. Some areas dry out faster, others stay wet, leading to overwatering, underwatering, plant stress, and poor growth. Additionally, manual schedules ignore real-time soil conditions, and monitoring water availability in tanks is often missing.
        </motion.p>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-800 mb-12"
          >
            Our Solution
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-10">

            <motion.div whileHover={{ y: -8 }} className="p-8 bg-green-50 rounded-3xl shadow-md">
              <Droplets className="mx-auto text-green-600" size={36} />
              <h3 className="mt-4 text-xl font-semibold">Soil Monitoring</h3>
              <p className="mt-3 text-gray-700">
                Real-time soil moisture sensors deliver precise irrigation for each zone.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="p-8 bg-emerald-50 rounded-3xl shadow-md">
              <Sun className="mx-auto text-yellow-500" size={36} />
              <h3 className="mt-4 text-xl font-semibold">Solar Powered</h3>
              <p className="mt-3 text-gray-700">
                Each smart valve is powered by solar energy, reducing electricity dependency.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="p-8 bg-green-50 rounded-3xl shadow-md">
              <Cpu className="mx-auto text-blue-500" size={36} />
              <h3 className="mt-4 text-xl font-semibold">Smart Valves</h3>
              <p className="mt-3 text-gray-700">
                Distributed valves automatically control water flow based on real-time soil data.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="p-8 bg-emerald-50 rounded-3xl shadow-md">
              <Gauge className="mx-auto text-purple-500" size={36} />
              <h3 className="mt-4 text-xl font-semibold">Water Management</h3>
              <p className="mt-3 text-gray-700">
                Continuous monitoring of tank levels ensures uninterrupted irrigation and prevents water waste.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Uniqueness / Vision Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-800 mb-8"
          >
            Why FloraX Stands Out
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            transition={{ duration: 0.8 }}
            className="text-gray-700 text-lg max-w-3xl mx-auto mb-16"
          >
            FloraX combines distributed intelligence with centralized monitoring, eliminating overwatering and under-watering while improving water-use efficiency. Modular, solar-powered valves allow scalable, sustainable garden and farm management.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-10 text-left">

            <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl shadow-lg">
              <Leaf className="text-green-600 mx-auto" size={36} />
              <h3 className="mt-4 font-semibold text-xl">Eco-Friendly</h3>
              <p className="mt-2 text-gray-700">Solar-powered system reduces energy usage and carbon footprint.</p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl shadow-lg">
              <ShieldCheck className="text-green-700 mx-auto" size={36} />
              <h3 className="mt-4 font-semibold text-xl">Reliable & Secure</h3>
              <p className="mt-2 text-gray-700">Distributed valves with centralized monitoring ensures robust irrigation management.</p>
            </motion.div>

            <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl shadow-lg">
              <Cpu className="text-blue-500 mx-auto" size={36} />
              <h3 className="mt-4 font-semibold text-xl">Smart Automation</h3>
              <p className="mt-2 text-gray-700">Automated soil-based irrigation decisions minimize human intervention and water wastage.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600 text-center text-white">
        <h2 className="text-4xl font-bold">Join FloraX Today</h2>
        <p className="mt-4 text-lg opacity-90">
          Start managing your garden with precision and efficiency.
        </p>
        <Link
          to="/register"
          className="inline-block mt-8 px-8 py-3 bg-white text-green-600 rounded-2xl font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>

    </div>
  );
}