"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Props {
  topic: any;
  index: number;
  subjectId: string;
  examId: string;
  stageId: string;
  refresh: () => void;
}

export default function TopicCard({
  topic,
  index,
  subjectId,
  examId,
  stageId,
  refresh,
}: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(topic.name);

  const handleDelete = async () => {
    if (!confirm("Deleting this topic will remove all linked questions. Continue?")) return;

    await fetch("/api/admin/topics", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: topic.id }),
    });

    refresh();
  };

  const handleUpdate = async () => {
    await fetch("/api/admin/topics", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: topic.id,
        name: editName,
      }),
    });

    setIsEditing(false);
    refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex justify-between items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-700 rounded-xl font-bold">
          {index + 1}
        </div>

        {isEditing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="px-4 py-2 border rounded-lg font-semibold"
          />
        ) : (
          <div>
            <h3 className="text-lg font-bold">{topic.name}</h3>
            <p className="text-xs text-gray-400">
              Topic under this subject
            </p>
          </div>
        )}
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-3">
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-700 text-white text-sm rounded-lg"
            >
              Save
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(topic.name);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-600 text-sm rounded-lg"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            {/* Manage Questions Button */}
            <button
              onClick={() =>
                router.push(
                  `/admin/exam-types/${examId}/stages/${stageId}/subjects/${subjectId}/topics/${topic.id}/questions`
                )
              }
              className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition"
            >
              Manage Questions
            </button>

            {/* Edit */}
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 bg-blue-100 text-blue-600 text-sm rounded-lg hover:bg-blue-200 transition"
            >
              Edit
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}