"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SubjectsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [subjects, setSubjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    if (!examId) return;
    const res = await fetch(`/api/admin/subjects?examId=${examId}`);
    const data = await res.json();
    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, [examId]);

  const handleAdd = async () => {
    if (!name || !examId) return;
    setLoading(true);

    await fetch("/api/admin/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        examTypeId: examId,
        stageId: null, // Defaulting to null for direct subjects
      }),
    });

    setName("");
    setLoading(false);
    fetchSubjects();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 lg:p-10 text-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs / Back */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-700 font-bold mb-8 group transition-all"
        >
          <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          Back to Structure
        </button>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Subjects</h1>
          <p className="text-gray-500 font-medium mt-1">Manage core study areas for this exam</p>
        </header>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[2rem] shadow-xl shadow-green-900/5 border border-gray-100 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">New Subject Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. History, Mathematics, Current Affairs"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition text-gray-900 font-bold placeholder:text-gray-300"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              disabled={loading}
              className="px-10 bg-green-800 hover:bg-green-900 text-white font-bold rounded-2xl h-[60px] shadow-lg shadow-green-900/20 transition-all"
            >
              {loading ? "..." : "Add Subject"}
            </motion.button>
          </div>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {subjects.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all cursor-pointer"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-6 flex justify-between items-start">
                    <div className="p-3 bg-green-50 rounded-2xl text-green-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <button className="text-gray-300 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <Link
                    href={`/admin/subjects/${sub.id}/topics`}
                    className="flex-1"
                  >
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-green-800 transition-colors leading-tight">
                      {sub.name}
                    </h3>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manage Topics</span>
                      <div className="h-1 w-1 bg-gray-300 rounded-full" />
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active</span>
                    </div>
                  </Link>

                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">Last updated: Today</span>
                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-800 group-hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {subjects.length === 0 && !loading && (
            <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest italic">No subjects added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}