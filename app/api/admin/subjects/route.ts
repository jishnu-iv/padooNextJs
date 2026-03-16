import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  const stageId = req.nextUrl.searchParams.get("stageId");

  const subjects = await prisma.subject.findMany({
    where: { stageId: stageId ?? undefined },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, examTypeId, stageId } = body;

  const subject = await prisma.subject.create({
    data: {
      name,
      examTypeId,
      stageId,
    },
  });

  return NextResponse.json(subject);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  await prisma.subject.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name } = body;

  const subject = await prisma.subject.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json(subject);
}