import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { role: true },
  });

  return dbUser?.role === "ADMIN" ? dbUser : null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const allowedFields = [
    "title",
    "description",
    "gradeLevel",
    "topic",
    "languageSkill",
    "tags",
    "published",
  ] as const;

  const data: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  try {
    const lesson = await prisma.lessonPlan.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        gradeLevel: true,
        topic: true,
        languageSkill: true,
        tags: true,
        published: true,
        googleDriveFileId: true,
        googleDriveUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ lesson });
  } catch {
    return NextResponse.json(
      { error: "Lesson plan not found" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.bundleLessonPlan.deleteMany({ where: { lessonPlanId: id } });
      await tx.userLessonAccess.deleteMany({ where: { lessonPlanId: id } });
      await tx.creditTransaction.deleteMany({ where: { lessonPlanId: id } });
      await tx.driveCopyLog.deleteMany({ where: { lessonPlanId: id } });
      await tx.lessonPlanAsset.deleteMany({ where: { lessonPlanId: id } });
      await tx.downloadLog.deleteMany({
        where: { customizedPlan: { lessonPlanId: id } },
      });
      await tx.customizedPlan.deleteMany({ where: { lessonPlanId: id } });
      await tx.aiGenerationJob.deleteMany({ where: { sourcePlanId: id } });
      await tx.aiGenerationJob.deleteMany({ where: { resultPlanId: id } });
      await tx.lessonPlan.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Lesson plan not found or could not be deleted" },
      { status: 404 }
    );
  }
}
