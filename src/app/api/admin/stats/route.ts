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
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    subscribersByTier,
    subscribersByStatus,
    creditStats,
    lessonPlanCounts,
    recentSignups,
  ] = await Promise.all([
    prisma.subscription.groupBy({
      by: ["tier"],
      where: { status: "ACTIVE" },
      _count: true,
    }),
    prisma.subscription.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.creditTransaction.groupBy({
      by: ["type"],
      _sum: { amount: true },
    }),
    prisma.lessonPlan.aggregate({
      _count: { id: true },
      where: undefined,
    }).then(async (total) => {
      const published = await prisma.lessonPlan.count({
        where: { published: true },
      });
      return { total: total._count.id, published };
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscription: {
          select: { tier: true, status: true },
        },
      },
    }),
  ]);

  const tierCounts: Record<string, number> = {};
  for (const row of subscribersByTier) {
    tierCounts[row.tier] = row._count;
  }

  const statusCounts: Record<string, number> = {};
  for (const row of subscribersByStatus) {
    statusCounts[row.status] = row._count;
  }

  let creditsGranted = 0;
  let creditsSpent = 0;
  for (const row of creditStats) {
    if (row.type === "GRANT") creditsGranted = row._sum.amount ?? 0;
    if (row.type === "SPEND") creditsSpent = row._sum.amount ?? 0;
  }

  return NextResponse.json({
    subscribers: {
      byTier: tierCounts,
      byStatus: statusCounts,
      totalActive:
        (tierCounts.STARTER ?? 0) +
        (tierCounts.ESSENTIAL ?? 0) +
        (tierCounts.PRO_PLUS ?? 0),
    },
    credits: { granted: creditsGranted, spent: creditsSpent },
    lessonPlans: lessonPlanCounts,
    recentSignups,
  });
}
