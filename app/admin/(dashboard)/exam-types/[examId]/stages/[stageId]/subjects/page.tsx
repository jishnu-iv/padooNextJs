"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SubjectCard from "./SubjectCard";
import { motion, AnimatePresence } from "framer-motion";

export default function SubjectsPage() {
  const params = useParams();
  const router = useRouter();

  const examId = params.examId as string;
  const stageId = params.stageId as string;

  const [subjects, setSubjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    if (!stageId) return;
    const res = await fetch(`/api/admin/subjects?stageId=${stageId}`);
    const data = await res.json();
    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, [stageId]);

  const handleAdd = async () => {
    if (!name || !stageId) return;
    setLoading(true);
    await fetch("/api/admin/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, examTypeId: examId, stageId: stageId }),
    });
    setName("");
    setLoading(false);
    fetchSubjects();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 lg:p-12 text-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-green-700 font-bold mb-8 transition-all"
        >
          <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          Back to Stages
        </button>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Stage Subjects</h1>
          <p className="text-gray-500 font-medium mt-1">Organize curriculum for this specific stage</p>
        </header>

        {/* Add Subject Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-white mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Subject Title</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ancient Indian History"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition text-gray-900 font-bold placeholder:text-gray-300"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              disabled={loading}
              className="md:mt-6 px-10 bg-green-800 hover:bg-green-900 text-white font-bold rounded-2xl h-[60px] shadow-lg shadow-green-900/20 transition-all flex items-center justify-center"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Add Subject"}
            </motion.button>
          </div>
        </motion.div>

        {/* List Section */}
        <div className="grid gap-4">
          <AnimatePresence>
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                index={index}
                examId={examId}
                stageId={stageId}
                refresh={fetchSubjects}
              />
            ))}
          </AnimatePresence>

          {subjects.length === 0 && (
            <div className="py-20 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest italic">No subjects added to this stage yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}