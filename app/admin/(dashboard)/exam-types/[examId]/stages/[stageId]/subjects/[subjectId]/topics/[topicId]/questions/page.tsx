"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  marks: number;
}

export default function QuestionsPage() {
  const params = useParams() as {
    examId: string;
    stageId: string;
    subjectId: string;
    topicId: string;
  };
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/admin/questions?topicId=${params.topicId}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.topicId) fetchQuestions();
  }, [params.topicId]);

  const basePath = `/admin/exam-types/${params.examId}/stages/${params.stageId}/subjects/${params.subjectId}/topics/${params.topicId}/questions`;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question permanently?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] p-4 lg:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-700 hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Question Bank</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Topic: {params.topicId.slice(-6)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => router.push(`${basePath}/add`)} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M12 4v16m8-8H4" /></svg>
              ADD
            </button>
            <button onClick={() => router.push(`${basePath}/bulk`)} className="bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-green-900/20 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4 4m0 0l-4-4m4 4V4" /></svg>
              CSV
            </button>
            <button onClick={() => router.push(`${basePath}/paste`)} className="bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              PASTE
            </button>
          </div>
        </div>

        {/* Compact Question List */}
        <div className="space-y-4">
          <AnimatePresence>
            {!loading && questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-green-400 transition-all"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded flex items-center">
                        #{index + 1}
                      </span>
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {q.question}
                      </h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => router.push(`${basePath}/edit/${q.id}`)}
                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Options - Inline & Compact */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-8">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const isCorrect = q.correctAnswer === opt;
                      const optionText = q[`option${opt}` as keyof Question];
                      return (
                        <div 
                          key={opt} 
                          className={`px-3 py-2 rounded-xl border text-[11px] font-bold flex items-center gap-2 ${
                            isCorrect ? 'border-green-500 bg-green-50 text-green-900' : 'border-slate-100 bg-slate-50 text-slate-500'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-[9px] ${isCorrect ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                            {opt}
                          </span>
                          <span className="truncate">{optionText}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Row - Collapsed-style */}
                  {q.explanation && (
                    <div className="mt-3 ml-8 p-3 bg-slate-900 rounded-xl text-slate-100 text-[10px] border-l-4 border-green-500 font-medium">
                      <span className="text-green-400 font-black mr-2">SOL:</span> {q.explanation}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase text-slate-400">Syncing Question Bank...</p>
            </div>
          )}

          {!loading && questions.length === 0 && (
            <div className="text-center py-20 bg-slate-200/30 rounded-3xl border-2 border-dashed border-slate-300">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Content Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}