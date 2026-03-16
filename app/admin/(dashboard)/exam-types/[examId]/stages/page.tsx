"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StageCard from "./StageCard";

export default function StagesPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [stages, setStages] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStages = async () => {
    if (!examId) return;
    const res = await fetch(`/api/admin/stages?examId=${examId}`);
    const data = await res.json();
    setStages(data);
  };

  useEffect(() => {
    fetchStages();
  }, [examId]);

  const handleAdd = async () => {
    if (!name || !examId) return;
    setLoading(true);

    await fetch("/api/admin/stages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        examTypeId: examId,
      }),
    });

    setName("");
    setLoading(false);
    fetchStages();
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] p-6 lg:p-12 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-700 font-bold mb-6 hover:gap-3 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Exams
        </button>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Exam Stages</h1>
          <p className="text-gray-500 font-medium mt-1">Define levels like Prelims, Mains, or Interview</p>
        </header>

        {/* Action Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-gray-100 mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Stage Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Preliminary Examination"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-600 outline-none transition text-gray-900 font-semibold placeholder:text-gray-400"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              disabled={loading}
              className="md:mt-6 px-8 bg-green-800 hover:bg-green-900 text-white font-bold rounded-2xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center min-h-[60px]"
            >
              {loading ? "Adding..." : "Add Stage"}
            </motion.button>
          </div>
        </motion.div>

        {/* Stages List */}
        <div className="grid gap-4">
          <AnimatePresence>
           {stages.map((stage, index) => (
  <StageCard
    key={stage.id}
    stage={stage}
    index={index}
    examId={examId}
    refresh={fetchStages}
  />
))}
          </AnimatePresence>

          {stages.length === 0 && !loading && (
            <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold uppercase tracking-widest">No Stages Added Yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}