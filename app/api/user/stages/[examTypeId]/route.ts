import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ examTypeId: string }> }
) {

  const { examTypeId } = await params;

  const stages = await prisma.examStage.findMany({
    where: {
      examTypeId: examTypeId,
      isActive: true
    },
    select: {
      id: true,
      name: true
    }
  });

  return NextResponse.json(stages);
}