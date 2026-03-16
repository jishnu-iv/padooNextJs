"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ExamType {
  id: string;
  name: string;
  hasStages: boolean;
}

export default function ExamTypesPage() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [name, setName] = useState("");
  const [hasStages, setHasStages] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchExamTypes = async () => {
    const res = await fetch("/api/admin/exam-types");
    const data = await res.json();
    setExamTypes(data);
  };

  useEffect(() => {
    fetchExamTypes();
  }, []);

  const handleAdd = async () => {
    if (!name) return;
    setLoading(true);

    await fetch("/api/admin/exam-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, hasStages }),
    });

    setName("");
    setHasStages(true);
    setLoading(false);
    fetchExamTypes();
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure? This will remove all linked data.");
    if (!confirmDelete) return;

    await fetch("/api/admin/exam-types", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchExamTypes();
  };

  return (
    <div className="min-h-screen bg-[#F9FBFA] p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Exam Categories</h1>
            <p className="text-gray-500 mt-1 font-medium italic">Configure how subjects are organized</p>
          </div>
          <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-gray-100 text-green-800 font-bold flex items-center gap-2">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            {examTypes.length} Active Types
          </div>
        </header>

        {/* Create Section - Glass Card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-white mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-end lg:items-center">
            <div className="flex-1 w-full">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Exam Name</label>
              <input
                placeholder="e.g. UPSC Civil Services"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition placeholder:text-gray-300 text-lg font-medium"
              />
            </div>

            <div className="flex flex-col items-start gap-2 min-w-[150px]">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">Structure</label>
              <div 
                onClick={() => setHasStages(!hasStages)}
                className="flex items-center gap-3 cursor-pointer bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all w-full"
              >
                <div className={`w-10 h-6 rounded-full relative transition-colors ${hasStages ? 'bg-green-600' : 'bg-gray-300'}`}>
                  <motion.div 
                    animate={{ x: hasStages ? 18 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700">{hasStages ? "Stages" : "Direct"}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              disabled={loading}
              className="h-[60px] px-8 bg-green-800 hover:bg-green-900 text-white font-bold rounded-2xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center min-w-[160px]"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Exam"}
            </motion.button>
          </div>
        </motion.div>

        {/* List Section - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {examTypes.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-[2rem] shadow-md border border-gray-50 group hover:shadow-2xl hover:shadow-green-900/5 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-black text-xl">
                        {exam.name[0].toUpperCase()}
                      </div>
                      <Link
                        href={`/admin/exam-types/${exam.id}`}
                        className="font-black text-xl text-gray-800 hover:text-green-700 transition-colors leading-tight"
                      >
                        {exam.name}
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${exam.hasStages ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                        {exam.hasStages ? "Multiple Stages" : "Direct Subjects"}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manage Structure →</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    onClick={() => handleDelete(exam.id)}
                    className="p-3 text-gray-300 hover:text-red-500 bg-gray-50 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {examTypes.length === 0 && (
            <div className="col-span-full py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-400 font-bold uppercase tracking-widest">No Exam Categories Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}