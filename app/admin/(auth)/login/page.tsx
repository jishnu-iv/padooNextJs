"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        alert("Login failed: Invalid credentials");
      }
    } catch (error) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4F1] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] bg-green-200 rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-blue-100 rounded-full blur-[100px] opacity-50" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-4"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            {/* Animated Shield Icon */}
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
              className="inline-block p-4 bg-green-800 rounded-full shadow-lg shadow-green-900/30 mb-6"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome</h1>
            <p className="text-gray-500 font-medium mt-2">Login to Admin Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </span>
                <input
                  type="email"
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 focus:bg-white transition-all outline-none placeholder:text-gray-400 text-gray-800 bg-white"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 focus:bg-white transition-all outline-none placeholder:text-gray-400 text-gray-800 bg-white"
                  required
                />
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#064e3b" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-900/20 transition-all flex items-center justify-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              New admin?{" "}
              <button 
                onClick={() => router.push("/admin/register")}
                className="text-green-800 font-bold hover:underline"
              >
                Request Access
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}