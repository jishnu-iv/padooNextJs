import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  if (!topicId) {
    return NextResponse.json(
      { error: "Missing topicId" },
      { status: 400 }
    );
  }

  const questions = await prisma.question.findMany({
    where: { topicId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  const body = await req.json();

  const question = await prisma.question.create({
    data: body,
  });

  return NextResponse.json(question);
}