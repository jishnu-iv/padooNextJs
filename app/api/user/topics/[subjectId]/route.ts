import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId } = await params;
    const topics = await prisma.topic.findMany({
        
      where: {
        subjectId:subjectId,
        isActive: true
      },
      orderBy: {
        order: "asc"
      },
      select: {
        id: true,
        name: true
      }
    });

    return NextResponse.json(topics);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}