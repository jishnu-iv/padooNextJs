import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export default async function ExamTypePage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params; // ✅ unwrap params

  const exam = await prisma.examType.findUnique({
    where: { id: examId },
  });

  if (!exam) {
    return <div>Exam not found</div>;
  }

  if (exam.hasStages) {
    redirect(`/admin/exam-types/${examId}/stages`);
  } else {
    redirect(`/admin/exam-types/${examId}/subjects`);
  }
}
