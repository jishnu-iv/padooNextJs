import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { attemptId: string } }
) {

  const attempt = await prisma.examAttempt.findUnique({
    where: {
      id: params.attemptId
    }
  });

  if (!attempt) {
    return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
  }

  const questions = await prisma.question.findMany({
    where: {
      topicId: attempt.topicId
    }
  });

  return NextResponse.json({
    attempt,
    questions
  });
}