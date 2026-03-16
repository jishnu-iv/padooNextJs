"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function UnifiedQuestionManager() {
  const params = useParams() as { examId: string; stageId: string; subjectId: string; topicId: string };
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Moderate Sized Form State
  const [form, setForm] = useState({
    question: "",
    optionA: "", 
    optionB: "", 
    optionC: "", 
    optionD: "",
    correct: "",
    explanation: "",
    difficulty: "MEDIUM",
    marks: 1,
    negativeMarks: 1,
  });

  const fetchQuestions = async () => {
    const res = await fetch(`/api/admin/questions?topicId=${params.topicId}`);
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => { fetchQuestions(); }, [params.topicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.correct) return alert("Select correct answer");
    setLoading(true);
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, topicId: params.topicId }),
    });
    if (res.ok) {
      setForm({ ...form, question: "", optionA: "", optionB: "", optionC: "", optionD: "", explanation: "" });
      setIsAdding(false);
      fetchQuestions();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    fetchQuestions();
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb Navigation - Better Visibility */}
        <nav className="flex items-center gap-2 text-xs font-bold text-green-800 uppercase tracking-widest mb-6 bg-green-50 w-fit px-4 py-2 rounded-full border border-green-100">
          <span className="opacity-50">Exam</span> / 
          <span className="opacity-50">Stage</span> / 
          <span className="opacity-50">Subject</span> / 
          <span>Topic: {params.topicId.slice(-5)}</span>
        </nav>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black tracking-tight">Question Manager</h1>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${isAdding ? 'bg-slate-200 text-slate-700' : 'bg-green-800 text-white shadow-lg shadow-green-900/20'}`}
          >
            {isAdding ? "✕ Close Form" : "+ Add New Question"}
          </button>
        </div>

        {/* MODERATE SIZE ADD FORM */}
        <AnimatePresence>
          {isAdding && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-white border-2 border-green-100 rounded-3xl p-6 mb-10 shadow-sm overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <textarea
                    name="question"
                    placeholder="Enter Question..."
                    value={form.question}
                    onChange={(e) => setForm({...form, question: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 font-bold focus:border-green-600 outline-none"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {['A', 'B', 'C', 'D'].map((l) => (
                      <div key={l} className="relative">
                        <input
                          placeholder={`Option ${l}`}
                          value={(form as any)[`option${l}`]}
                          onChange={(e) => setForm({...form, [`option${l}`]: e.target.value})}
                          className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl font-semibold outline-none transition-all ${form.correct === l ? 'border-green-600 ring-2 ring-green-100' : 'border-slate-200'}`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setForm({...form, correct: l})}
                          className={`absolute left-2 top-2 w-6 h-6 rounded-lg text-[10px] font-black transition-all ${form.correct === l ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-500'}`}
                        >
                          {l}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <textarea
                    name="explanation"
                    placeholder="Explanation (Optional)"
                    value={form.explanation}
                    onChange={(e) => setForm({...form, explanation: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-24 font-medium focus:border-green-600 outline-none"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <select value={form.difficulty} onChange={(e) => setForm({...form, difficulty: e.target.value})} className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm">
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                    <input type="number" placeholder="Marks" value={form.marks} onChange={(e) => setForm({...form, marks: Number(e.target.value)})} className="p-3 border border-slate-200 rounded-xl font-bold text-center" />
                    <input type="number" placeholder="Penalty" value={form.negativeMarks} onChange={(e) => setForm({...form, negativeMarks: Number(e.target.value)})} className="p-3 border border-slate-200 rounded-xl font-bold text-center text-red-600" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 bg-green-800 text-white rounded-xl font-black hover:bg-green-900 transition-all">
                    {loading ? "SAVING..." : "SAVE TO DATABASE"}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* QUESTIONS LIST - MANAGEABLE VIEW */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Recently Added Questions</h2>
          {questions.map((q, idx) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center hover:border-green-300 transition-all shadow-sm"
            >
              <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center font-black text-slate-500 flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 line-clamp-1">{q.question}</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-[10px] font-black text-green-700 uppercase">Correct: {q.correctAnswer}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{q.difficulty}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{q.marks} Marks</span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
  onClick={() =>
    router.push(
      `/admin/exam-types/${params.examId}/stages/${params.stageId}/subjects/${params.subjectId}/topics/${params.topicId}/questions/edit/${q.id}`
    )
  }
  className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
>
  Edit
</button>
                {/* <button 
                  onClick={() => router.push(`./edit/${q.id}`)}
                  className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition-all"
                >
                  Edit
                </button> */}
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-700 rounded-lg font-bold text-xs hover:bg-red-600 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
          
          {questions.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold">
              No questions found for this topic.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}