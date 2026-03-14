import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  // Auth + admin check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { id: true, role: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { driveFileId, driveUrl, title, description, gradeLevel, topic, languageSkill, tags } =
    body;

  if (!driveFileId || !title || !gradeLevel || !topic || !languageSkill) {
    return NextResponse.json(
      { error: "Missing required fields: driveFileId, title, gradeLevel, topic, languageSkill" },
      { status: 400 }
    );
  }

  const lessonPlan = await prisma.lessonPlan.create({
    data: {
      title,
      description: description || null,
      gradeLevel,
      topic,
      languageSkill,
      slidesData: {},
      tags: tags || [],
      published: true,
      googleDriveFileId: driveFileId,
      googleDriveUrl: driveUrl || `https://docs.google.com/presentation/d/${driveFileId}/edit`,
      createdById: dbUser.id,
    },
  });

  return NextResponse.json({ lessonPlan }, { status: 201 });
}
