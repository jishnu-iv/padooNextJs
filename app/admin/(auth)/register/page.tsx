"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        router.push("/admin/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F1] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-300 rounded-full blur-3xl opacity-30" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-md p-1"
      >
        <div className="bg-white/80 backdrop-blur-lg border border-white p-8 rounded-[2rem] shadow-2xl">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-block p-3 bg-green-100 rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-green-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900">
              Create Admin
            </h1>
            <p className="text-gray-500 mt-2">
              Exam System Admin Portal
            </p>
          </motion.div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition placeholder:text-gray-400 text-gray-800 bg-white"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition placeholder:text-gray-400 text-gray-800 bg-white"
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition placeholder:text-gray-400 text-gray-800 bg-white"
              />
            </motion.div>

            {/* Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Register Admin"
              )}
            </motion.button>
          </form>

          <motion.p
            variants={itemVariants}
            className="text-center mt-6 text-sm text-gray-500"
          >
            Already have an account?{" "}
            <button
              onClick={() => router.push("/admin/login")}
              className="text-green-700 font-bold hover:underline"
            >
              Log in
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
