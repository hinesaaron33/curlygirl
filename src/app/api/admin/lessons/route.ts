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

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const lessons = await prisma.lessonPlan.findMany({
    orderBy: { title: "asc" },
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

  return NextResponse.json({ lessons });
}
