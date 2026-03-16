"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  subject: any;
  index: number;
  examId: string;
  stageId: string;
  refresh: () => void;
}

export default function SubjectCard({ subject, index, examId, stageId, refresh }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(subject.name);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = confirm("Deleting this subject will remove all linked topics. Continue?");
    if (!confirmDelete) return;

    await fetch("/api/admin/subjects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: subject.id }),
    });
    refresh();
  };

  const handleUpdate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch("/api/admin/subjects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: subject.id, name: editName }),
    });
    setIsEditing(false);
    refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => {
        if (!isEditing) {
          router.push(`/admin/exam-types/${examId}/stages/${stageId}/subjects/${subject.id}/topics`);
        }
      }}
      className="group relative flex justify-between items-center p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all cursor-pointer overflow-hidden"
    >
      <div className="flex items-center gap-5 flex-1">
        {/* Icon/Avatar */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-black transition-colors ${isEditing ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-700 group-hover:bg-green-800 group-hover:text-white'}`}>
          {isEditing ? "✎" : subject.name[0].toUpperCase()}
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2"
              >
                <input
                  autoFocus
                  value={editName}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full max-w-sm px-4 py-2 bg-gray-50 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 font-bold"
                />
              </motion.div>
            ) : (
              <motion.div
                key="display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-xl font-black text-gray-900 leading-tight">{subject.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                  Click to manage topics →
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
                setEditName(subject.name);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Edit Subject"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Delete Subject"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}