"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Props {
  stage: any;
  index: number;
  examId: string;
  refresh: () => void;
}

export default function StageCard({
  stage,
  index,
  examId,
  refresh,
}: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(stage.name);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Deleting this stage will remove all linked subjects and questions. Continue?"
    );
    if (!confirmDelete) return;

    await fetch("/api/admin/stages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: stage.id }),
    });

    refresh();
  };

  const handleUpdate = async () => {
    await fetch("/api/admin/stages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: stage.id,
        name: editName,
      }),
    });

    setIsEditing(false);
    refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all"
    >
      <div

      onClick={() => {
    if (!isEditing) {
      router.push(
        `/admin/exam-types/${examId}/stages/${stage.id}/subjects`
      );
    }
  }}
  className="flex items-center gap-5 cursor-pointer flex-1"
        // onClick={() =>
        //   router.push(
        //     `/admin/exam-types/${examId}/stages/${stage.id}/subjects`
        //   )
        // }
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50 text-green-700 font-black text-lg">
          {index + 1}
        </div>

        {isEditing ? (
            <input
  value={editName}
  onClick={(e) => e.stopPropagation()}
  onChange={(e) => setEditName(e.target.value)}
  className="border px-3 py-2 rounded-lg font-semibold"
/>
        //   <input
        //     value={editName}
        //     onChange={(e) => setEditName(e.target.value)}
        //     className="border px-3 py-2 rounded-lg font-semibold"
        //   />
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {stage.name}
            </h3>
            <p className="text-sm text-gray-400 font-medium">
              Click to manage subjects
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isEditing ? (
            <button
  onClick={(e) => {
    e.stopPropagation();
    handleUpdate();
  }}
  className="text-green-600 font-semibold"
>
  Save
</button>
        //   <button
        //     onClick={handleUpdate}
        //     className="text-green-600 font-semibold"
        //   >
        //     Save
        //   </button>
        ) : (
            <button
  onClick={(e) => {
    e.stopPropagation();
    setIsEditing(true);
  }}
  className="text-blue-600 font-semibold"
>
  Edit
</button>
        //   <button
        //     onClick={() => setIsEditing(true)}
        //     className="text-blue-600 font-semibold"
        //   >
        //     Edit
        //   </button>
        )}


<button
  onClick={(e) => {
    e.stopPropagation();
    handleDelete();
  }}
  className="text-red-600 font-semibold"
>
  Delete
</button>

        {/* <button
          onClick={handleDelete}
          className="text-red-600 font-semibold"
        >
          Delete
        </button> */}
      </div>
    </motion.div>
  );
}