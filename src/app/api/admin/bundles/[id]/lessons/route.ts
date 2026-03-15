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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const lessons = await prisma.bundleLessonPlan.findMany({
    where: { bundleId: id },
    include: {
      lessonPlan: {
        select: {
          id: true,
          title: true,
          gradeLevel: true,
          topic: true,
          published: true,
        },
      },
    },
  });

  return NextResponse.json({
    lessons: lessons.map((l) => l.lessonPlan),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { lessonPlanId } = await request.json();

  if (!lessonPlanId) {
    return NextResponse.json(
      { error: "lessonPlanId is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.bundleLessonPlan.create({
      data: { bundleId: id, lessonPlanId },
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Lesson already in bundle or invalid IDs" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { lessonPlanId } = await request.json();

  if (!lessonPlanId) {
    return NextResponse.json(
      { error: "lessonPlanId is required" },
      { status: 400 }
    );
  }

  await prisma.bundleLessonPlan.deleteMany({
    where: { bundleId: id, lessonPlanId },
  });

  return NextResponse.json({ success: true });
}
