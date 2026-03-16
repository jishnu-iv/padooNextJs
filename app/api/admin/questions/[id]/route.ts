import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

/* =========================
   GET
========================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const question = await prisma.question.findUnique({
    where: { id },
  });

  return NextResponse.json(question);
}

/* =========================
   PUT
========================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const updated = await prisma.question.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

/* =========================
   DELETE
========================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.question.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Deleted" });
}