import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// GET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");

  if (!subjectId) {
    return NextResponse.json([], { status: 200 });
  }

  const topics = await prisma.topic.findMany({
    where: { subjectId },
    orderBy: { order: "asc" }, // 🔥 use existing field
  });

  return NextResponse.json(topics);
}

// POST
export async function POST(req: Request) {
  const { name, subjectId } = await req.json();

  const topic = await prisma.topic.create({
    data: { name, subjectId },
  });

  return NextResponse.json(topic);
}

// PUT  ✅ REQUIRED
export async function PUT(req: Request) {
  const { id, name } = await req.json();

  const updated = await prisma.topic.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json(updated);
}

// DELETE  ✅ REQUIRED
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.topic.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}