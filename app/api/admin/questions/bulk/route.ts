import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topicId, questions } = body;

    if (!topicId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const formatted = questions.map((q: any) => {
      if (!q.correct) {
        throw new Error("Missing correct answer");
      }

      return {
        question: q.question,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correct: q.correct, // MUST match Prisma
        explanation: q.explanation || "",
        difficulty: q.difficulty || "MEDIUM",
        marks: Number(q.marks ?? 1),
        negativeMarks: Number(q.negativeMarks ?? 0),
        topicId,
      };
    });

    const created = await prisma.question.createMany({
      data: formatted,
    });

    return NextResponse.json({
      message: "Bulk insert success",
      count: created.count,
    });

  } catch (error) {
    console.error("Bulk Insert Error:", error);
    return NextResponse.json(
      { error: "Bulk insert failed" },
      { status: 500 }
    );
  }
}