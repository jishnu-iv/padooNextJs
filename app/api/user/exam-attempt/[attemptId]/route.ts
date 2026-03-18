import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 1. Update the type of params to be a Promise
export async function GET(
  req: Request,
  { params }: { params: Promise<{ attemptId: string }> } 
) {
  // 2. Await the params to extract attemptId
  const { attemptId } = await params;

  const attempt = await prisma.examAttempt.findUnique({
    where: {
      id: attemptId // Use the awaited ID here
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