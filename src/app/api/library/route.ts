import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { googleAccessToken: true },
  });

  const plans = await prisma.lessonPlan.findMany({
    where: { published: true, googleDriveFileId: { not: null } },
    select: {
      id: true,
      title: true,
      description: true,
      gradeLevel: true,
      topic: true,
      languageSkill: true,
      tags: true,
      googleDriveUrl: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    plans,
    googleConnected: !!dbUser?.googleAccessToken,
  });
}
