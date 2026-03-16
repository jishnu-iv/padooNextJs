import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const examId = req.nextUrl.searchParams.get("examId");

  if (!examId) {
    return NextResponse.json([]);
  }

  const stages = await prisma.examStage.findMany({
    where: { examTypeId: examId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(stages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, examTypeId } = body;

  if (!examTypeId || !name) {
    return NextResponse.json(
      { message: "Missing fields" },
      { status: 400 }
    );
  }

  const stage = await prisma.examStage.create({
    data: {
      name,
      examType: {
        connect: { id: examTypeId },
      },
    },
  });

  return NextResponse.json(stage);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  await prisma.examStage.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name } = body;

  const stage = await prisma.examStage.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json(stage);
}