import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

type AccessState = "included" | "available" | "unlocked" | "locked";

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
    select: {
      id: true,
      googleAccessToken: true,
      subscription: true,
    },
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

  // Determine access state for each lesson
  let accessMap: Record<string, AccessState> = {};
  let creditsRemaining = 0;

  if (dbUser?.subscription && dbUser.subscription.status === "ACTIVE") {
    const tier = dbUser.subscription.tier;
    creditsRemaining = dbUser.subscription.creditsBalance;

    // Get all lessons in the user's tier bundle
    const bundledLessonIds = new Set(
      (await prisma.bundleLessonPlan.findMany({
        where: { bundle: { tier } },
        select: { lessonPlanId: true },
      })).map((b) => b.lessonPlanId)
    );

    // Get all lessons the user has purchased with credits
    const unlockedLessonIds = new Set(
      (await prisma.userLessonAccess.findMany({
        where: { userId: dbUser.id },
        select: { lessonPlanId: true },
      })).map((a) => a.lessonPlanId)
    );

    for (const plan of plans) {
      if (bundledLessonIds.has(plan.id)) {
        accessMap[plan.id] = "included";
      } else if (unlockedLessonIds.has(plan.id)) {
        accessMap[plan.id] = "unlocked";
      } else {
        accessMap[plan.id] = "available";
      }
    }
  } else {
    for (const plan of plans) {
      accessMap[plan.id] = "locked";
    }
  }

  return NextResponse.json({
    plans: plans.map((plan) => ({
      ...plan,
      accessState: accessMap[plan.id] ?? "locked",
    })),
    googleConnected: !!dbUser?.googleAccessToken,
    creditsRemaining,
  });
}
