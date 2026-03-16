"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface ParsedQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
  explanation?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  marks: number;
  negativeMarks: number;
  isValid: boolean;
  error?: string;
}

export default function PasteBulkPage() {
  const { topicId } = useParams();
  const router = useRouter();

  const [text, setText] = useState("");
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  /* ======================================================
     SMART UNIVERSAL PARSER
  ====================================================== */
  const parseQuestions = () => {
  if (!text.trim()) return;

  const cleaned = text
    .replace(/✅|✔️|☑️|📖/g, "")
    .replace(/\r/g, "")
    .trim();

  // Split by question numbers
  const blocks =
    cleaned.match(/(\d+\.\s[\s\S]*?)(?=\n\d+\.|\s*$)/g) ||
    cleaned.split(/\n\s*\n/);

  const parsed: ParsedQuestion[] = blocks.map((block, index) => {
    const trimmed = block.trim();

    /* =========================
       QUESTION EXTRACTION
    ========================= */
    const questionMatch = trimmed.match(
      /^\d+\.\s*([\s\S]*?)(?=\n\s*A[\)\.\-:])/i
    );

    const question = questionMatch
      ? questionMatch[1].replace(/\s+$/, "").trim()
      : trimmed.split("\n")[0];

    /* =========================
       OPTION EXTRACTOR
    ========================= */
    const extractOption = (letter: string) => {
      const regex = new RegExp(
        `^\\s*${letter}[\\)\\.\\-:]\\s*(.+)$`,
        "im"
      );

      const match = trimmed.match(regex);
      return match ? match[1].trim() : "";
    };

    const optionA = extractOption("A");
    const optionB = extractOption("B");
    const optionC = extractOption("C");
    const optionD = extractOption("D");

    /* =========================
       ANSWER DETECTION
    ========================= */
    const answerMatch = trimmed.match(
      /(Answer|Ans|Correct)[^A-D]*([A-D])/i
    );

    const correct = answerMatch
      ? answerMatch[2].toUpperCase()
      : "";

    /* =========================
       EXPLANATION
    ========================= */
    let explanation = "";

    const descMatch = trimmed.match(
      /(Explanation|Description)[\s:\-]*([\s\S]*)/i
    );

    if (descMatch) {
      explanation = descMatch[2].trim();
    }

    /* =========================
       VALIDATION
    ========================= */
    let isValid = true;
    let error = "";

    if (!question || !optionA || !optionB || !optionC || !optionD) {
      isValid = false;
      error = "Missing options";
    } else if (!correct) {
      isValid = false;
      error = "Invalid correct answer";
    }

    return {
      id: index,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correct,
      explanation,
      difficulty: "MEDIUM",
      marks: 1,
      negativeMarks: 0,
      isValid,
      error,
    };
  });

  setQuestions(parsed);
};

  /* ======================================================
     SAVE BULK TO DATABASE
  ====================================================== */
  const handleSave = async () => {
    const validQuestions = questions.filter(
      (q) => q.isValid && q.correct
    );

    if (!validQuestions.length) {
      alert("No valid questions to save.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId,
          questions: validQuestions,
        }),
      });

      if (res.ok) {
        alert(`${validQuestions.length} Questions saved successfully!`);
        router.push("./");
      } else {
        alert("Save failed");
      }
    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div className="min-h-screen bg-[#F0F2F0] p-6 lg:p-12 text-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-4xl font-black">Bulk Paste Import</h1>

        <textarea
          className="w-full h-80 border p-4 rounded-xl"
          placeholder={`1. Question
A) Option
B) Option
C) Option
D) Option
Answer: A
Description: Explanation here`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={parseQuestions}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Generate Preview
          </button>

          {questions.length > 0 && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-xl"
            >
              {loading ? "Saving..." : "Save All"}
            </button>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <AnimatePresence>
            {questions.map((q) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 rounded-xl border ${
                  q.isValid ? "bg-white" : "bg-red-50 border-red-400"
                }`}
              >
                <p className="font-bold">{q.question}</p>
                <p>A) {q.optionA}</p>
                <p>B) {q.optionB}</p>
                <p>C) {q.optionC}</p>
                <p>D) {q.optionD}</p>

                <p className="text-green-600 font-semibold">
                  Correct: {q.correct}
                </p>

                {q.explanation && (
                  <p className="text-sm mt-2 text-gray-600">
                    {q.explanation}
                  </p>
                )}

                {!q.isValid && (
                  <p className="text-red-600 text-sm">
                    Error: {q.error}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}