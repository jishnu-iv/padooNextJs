import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ stageId: string }> }
) {

  const { stageId } = await params;

  const subjects = await prisma.subject.findMany({
    where: {
      stageId: stageId,
      isActive: true
    },
    select: {
      id: true,
      name: true
    }
  });

  return NextResponse.json(subjects);
}