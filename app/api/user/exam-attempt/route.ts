import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const attempt = await prisma.examAttempt.create({
      data: {
        userId: body.userId,
        stageId: body.stageId,
        total: body.total,
        correct: body.correct,
        wrong: body.wrong,
        score: body.score,
        timeTaken: body.timeTaken,
        answers: body.answers,
        topicId: body.topicId
      }
    });

    return NextResponse.json(attempt);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to save attempt" },
      { status: 500 }
    );
  }
}