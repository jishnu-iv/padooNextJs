"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function EditQuestionPage() {
  const params = useParams() as {
    examId: string;
    stageId: string;
    subjectId: string;
    topicId: string;
    id: string;
  };

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  /* =========================
     FETCH QUESTION SAFELY
  ========================= */
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/admin/questions/${params.id}`);
        const data = await res.json();

        console.log("Fetched Question:", data);

        setForm({
          question: data?.question || "",
          optionA: data?.optionA || "",
          optionB: data?.optionB || "",
          optionC: data?.optionC || "",
          optionD: data?.optionD || "",
          correct:
            data?.correctAnswer || data?.correct || "",
          explanation: data?.explanation || "",
          difficulty: data?.difficulty || "MEDIUM",
          marks: data?.marks ?? 1,
          negativeMarks: data?.negativeMarks ?? 0,
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setFetching(false);
      }
    };

    if (params.id) fetchQuestion();
  }, [params.id]);

  /* =========================
     UPDATE QUESTION
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/admin/questions/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.push(
        `/admin/exam-types/${params.examId}/stages/${params.stageId}/subjects/${params.subjectId}/topics/${params.topicId}/questions`
      );
    } else {
      alert("Update failed");
    }
  };

  if (fetching)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5]">
        <div className="w-10 h-10 border-4 border-green-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F4F7F5] p-6 lg:p-10 text-slate-950">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-green-800 font-black mb-2 hover:translate-x-[-4px] transition-transform uppercase text-xs tracking-widest"
            >
              ← Go Back
            </button>
            <h1 className="text-3xl font-black tracking-tight">
              Edit Question
            </h1>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Question ID
            </span>
            <span className="font-mono text-xs font-bold bg-white px-3 py-1 rounded-lg border border-slate-200">
              #{params.id.slice(-8)}
            </span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                Question Text
              </label>
              <textarea
                value={form.question}
                onChange={(e) =>
                  setForm({ ...form, question: e.target.value })
                }
                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl h-40 text-lg font-bold focus:border-green-600 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["A", "B", "C", "D"].map((letter) => (
                <div
                  key={letter}
                  className={`p-4 bg-white rounded-2xl border-2 transition-all ${
                    form.correct === letter
                      ? "border-green-600 ring-4 ring-green-50"
                      : "border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, correct: letter })
                      }
                      className={`w-8 h-8 rounded-lg font-black text-sm ${
                        form.correct === letter
                          ? "bg-green-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {letter}
                    </button>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      {form.correct === letter
                        ? "Selected Correct"
                        : "Set Correct"}
                    </span>
                  </div>

                  <input
                    value={(form as any)[`option${letter}`]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [`option${letter}`]: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl font-bold focus:border-green-600"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-6">

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Difficulty
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({ ...form, difficulty: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl font-bold"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={form.marks}
                  onChange={(e) =>
                    setForm({ ...form, marks: Number(e.target.value) })
                  }
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl font-black text-green-400"
                />
                <input
                  type="number"
                  value={form.negativeMarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      negativeMarks: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl font-black text-red-400"
                />
              </div>

              <textarea
                value={form.explanation}
                onChange={(e) =>
                  setForm({ ...form, explanation: e.target.value })
                }
                className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl h-32"
                placeholder="Explain the logic..."
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl"
              >
                {loading ? "SAVING..." : "UPDATE QUESTION"}
              </motion.button>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-4 border-2 border-slate-200 text-slate-400 font-bold rounded-xl"
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}