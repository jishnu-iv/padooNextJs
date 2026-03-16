import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const examTypes = await prisma.examType.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        hasStages: true
      }
    });

    return NextResponse.json(examTypes);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch exam types" },
      { status: 500 }
    );
  }
}