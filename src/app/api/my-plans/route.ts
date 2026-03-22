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
    select: { id: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const copies = await prisma.driveCopyLog.findMany({
    where: { userId: dbUser.id },
    distinct: ["lessonPlanId"],
    orderBy: { copiedAt: "desc" },
    select: {
      id: true,
      copiedFileId: true,
      copiedAt: true,
      lessonPlan: {
        select: {
          title: true,
          description: true,
          gradeLevel: true,
          topic: true,
          languageSkill: true,
          tags: true,
        },
      },
    },
  });

  return NextResponse.json({ copies });
}
