import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {

    const { topicId } = await params;
  try {
    const questions = await prisma.question.findMany({
      where: {
        topicId: topicId
      },
      select: {
        id: true,
        question: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        marks: true,
        negativeMarks: true,
        correct: true,
      }
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}