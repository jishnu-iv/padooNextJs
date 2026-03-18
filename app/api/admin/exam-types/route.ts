import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const examTypes = await prisma.examType.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(examTypes);
}

export async function POST( req: NextRequest) {
  try {
    const body = await req.json();
    const { name, hasStages } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: "Exam name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.examType.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Exam type already exists" },
        { status: 400 }
      );
    }

    const examType = await prisma.examType.create({
      data: {
        name,
        hasStages: hasStages ?? true,
      },
    });

    return NextResponse.json(examType);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { message: "Exam ID required" },
      { status: 400 }
    );
  }

  await prisma.examType.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Deleted successfully" });
}
