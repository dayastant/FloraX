import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Simulate submission
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full pt-24 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen flex flex-col">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
          Contact <span className="text-green-600">FloraX</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Have questions, suggestions, or need support? Send us a message and
          we’ll respond as soon as possible.
        </p>
      </motion.section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          {[
            {
              icon: <MapPin size={28} className="text-green-600" />,
              title: "Address",
              info: "Colombo, Sri Lanka",
              bg: "bg-white",
            },
            {
              icon: <Phone size={28} className="text-green-600" />,
              title: "Phone",
              info: "+94 77 123 4567",
              bg: "bg-white",
            },
            {
              icon: <Mail size={28} className="text-green-600" />,
              title: "Email",
              info: "info@florax.com",
              bg: "bg-white",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} p-8 rounded-3xl shadow-2xl flex items-start gap-5 hover:scale-105 transition`}
            >
              {card.icon}
              <div>
                <h3 className="font-semibold text-xl mb-1">{card.title}</h3>
                <p className="text-gray-600">{card.info}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-10 rounded-3xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-500 shadow-inner"
              required
              autoComplete="name"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-500 shadow-inner"
              required
              autoComplete="email"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Your Message"
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-green-500 shadow-inner resize-none"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold shadow-md hover:bg-green-700 transition mt-2"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </section>

      {/* Footer Note */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-12 text-gray-500 text-lg"
      >
        &copy; {new Date().getFullYear()} FloraX. All rights reserved.
      </motion.section>
    </div>
  );
}