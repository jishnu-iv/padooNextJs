"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopicCard from "./TopicCard";
import { motion, AnimatePresence } from "framer-motion";

export default function TopicsPage() {
  const params = useParams();
  const router = useRouter();

  const examId = params.examId as string;
  const stageId = params.stageId as string;
  const subjectId = params.subjectId as string;

  const [topics, setTopics] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTopics = async () => {
    if (!subjectId) return;
    const res = await fetch(`/api/admin/topics?subjectId=${subjectId}`);
    const data = await res.json();
    setTopics(data);
  };

  useEffect(() => { fetchTopics(); }, [subjectId]);

  const handleAdd = async () => {
    if (!name) return;
    setLoading(true);
    await fetch("/api/admin/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subjectId }),
    });
    setName("");
    setLoading(false);
    fetchTopics();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] p-6 lg:p-12 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-green-700 font-bold mb-8 transition-all"
        >
          <div className="p-2 bg-green-100 rounded-xl group-hover:bg-green-700 group-hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="tracking-tight">Back to Subjects</span>
        </button>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-green-800 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">Level 4: Topics</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Curriculum Topics</h1>
          <p className="text-gray-500 font-medium mt-1">Break down your subjects into manageable chapters</p>
        </header>

        {/* Add Topic Action Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-white mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Chapter/Topic Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fundamental Rights, Mughal Architecture..."
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
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Add Topic"}
            </motion.button>
          </div>
        </motion.div>

        {/* Topics Timeline/List */}
        <div className="relative space-y-4">
          {/* Decorative Vertical Line */}
          {topics.length > 0 && <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100 -z-10" />}
          
          <AnimatePresence>
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                subjectId={subjectId}
                examId={examId}
                stageId={stageId}
                refresh={fetchTopics}
              />
            ))}
          </AnimatePresence>

          {topics.length === 0 && (
            <div className="py-20 text-center bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-4 opacity-20">📚</div>
              <p className="text-gray-400 font-bold uppercase tracking-widest italic text-sm">No topics found in this subject</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}