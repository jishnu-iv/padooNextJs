"use client";

import { useEffect, useState } from "react";

export default function TopicsPage({
  params,
}: {
  params: { subjectId: string };
}) {
  const [topics, setTopics] = useState<any[]>([]);
  const [name, setName] = useState("");

  const fetchTopics = async () => {
    const res = await fetch(
      `/api/admin/topics?subjectId=${params.subjectId}`
    );
    const data = await res.json();
    setTopics(data);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleAdd = async () => {
    if (!name) return;

    await fetch("/api/admin/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        subjectId: params.subjectId,
      }),
    });

    setName("");
    fetchTopics();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Topics</h1>

      <div className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Topic Name"
          className="border px-4 py-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Topic
        </button>
      </div>

      <div className="space-y-3">
        {topics.map((topic) => (
          <div key={topic.id} className="p-4 border rounded bg-white">
            {topic.name}
          </div>
        ))}
      </div>
    </div>
  );
}
