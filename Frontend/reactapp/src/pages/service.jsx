import React from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Sun,
  Cpu,
  Gauge,
  ShieldCheck,
  AlertCircle,
  BatteryCharging,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: <Droplets size={36} className="text-green-600" />,
    title: "Soil Monitoring",
    description:
      "Real-time soil moisture monitoring ensures each zone gets the water it needs.",
  },
  {
    icon: <Sun size={36} className="text-yellow-500" />,
    title: "Solar Powered",
    description:
      "FloraX valves are fully solar-powered, reducing energy costs and supporting sustainability.",
  },
  {
    icon: <Cpu size={36} className="text-blue-500" />,
    title: "Smart Valves",
    description:
      "Intelligent valves automatically open and close based on soil conditions and moisture levels.",
  },
  {
    icon: <Gauge size={36} className="text-purple-500" />,
    title: "Water Level Control",
    description:
      "Continuous tank monitoring prevents water shortage and protects pumps from running dry.",
  },
  {
    icon: <ShieldCheck size={36} className="text-green-700" />,
    title: "Reliable & Scalable",
    description:
      "Distributed control with centralized monitoring allows seamless scaling from small gardens to large farms.",
  },
  {
    icon: <AlertCircle size={36} className="text-red-500" />,
    title: "Alert Notifications",
    description:
      "Receive instant alerts for low water, sensor faults, or dry soil conditions.",
  },
  {
    icon: <BatteryCharging size={36} className="text-yellow-600" />,
    title: "Battery Backup",
    description:
      "Each valve has a battery backup ensuring irrigation continues during cloudy days or power issues.",
  },
  {
    icon: <MapPin size={36} className="text-green-500" />,
    title: "Location-Based Optimization",
    description:
      "Zones are optimized based on sunlight exposure, soil type, and plant needs for maximum efficiency.",
  },
];

export default function Services() {
  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 md:pt-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 text-center mb-12 md:mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800"
        >
          Our <span className="text-green-600">Services</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 md:mt-6 text-gray-600 text-base md:text-lg max-w-2xl mx-auto"
        >
          FloraX provides smart, sustainable irrigation solutions for your
          garden or farm, designed to conserve water and improve plant health.
        </motion.p>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-6 md:p-8 bg-white rounded-2xl md:rounded-3xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">{service.title}</h3>
              <p className="mt-3 text-gray-600 text-sm md:text-base">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-center text-white px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold"
        >
          Ready to Optimize Your Garden?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 md:mt-4 text-base md:text-lg max-w-xl mx-auto opacity-90"
        >
          Join the future of sustainable irrigation with FloraX today.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-6 md:mt-8"
        >
          <Link
            to="/register"
            className="px-6 md:px-8 py-3 bg-white text-green-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </div>
  );
}