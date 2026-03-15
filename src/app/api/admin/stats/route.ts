import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { getStripe } from "@/lib/stripe/config";

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

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    subscribersByTier,
    subscribersByStatus,
    creditStats,
    lessonPlanCounts,
    recentSignups,
    monthlyRevenue,
    newSubsLast7,
    newSubsLast30,
    canceledByTier,
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
          select: { tier: true, status: true, stripePriceId: true },
        },
      },
    }),
    // Fetch this month's revenue from Stripe
    (async () => {
      try {
        const stripe = getStripe();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const charges = await stripe.charges.list({
          created: { gte: Math.floor(startOfMonth.getTime() / 1000) },
          limit: 100,
        });
        let total = 0;
        for (const charge of charges.data) {
          if (charge.paid && !charge.refunded) {
            total += charge.amount;
          }
        }
        return total / 100; // cents to dollars
      } catch {
        return 0;
      }
    })(),
    prisma.subscription.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.subscription.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.subscription.groupBy({
      by: ["tier"],
      where: { status: "CANCELED" },
      _count: true,
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

  const canceledCounts: Record<string, number> = {};
  for (const row of canceledByTier) {
    canceledCounts[row.tier] = row._count;
  }

  let creditsGranted = 0;
  let creditsSpent = 0;
  for (const row of creditStats) {
    if (row.type === "GRANT") creditsGranted = row._sum.amount ?? 0;
    if (row.type === "SPEND") creditsSpent = row._sum.amount ?? 0;
  }

  // Build a set of yearly price IDs to determine billing interval
  const yearlyPriceIds = new Set(
    [
      process.env.STRIPE_PRICE_STARTER_YEARLY ?? "",
      process.env.STRIPE_PRICE_ESSENTIAL_YEARLY ?? "",
      process.env.STRIPE_PRICE_PRO_PLUS_YEARLY ?? "",
    ].filter(Boolean)
  );

  const signupsWithBilling = recentSignups.map((u) => ({
    ...u,
    subscription: u.subscription
      ? {
          tier: u.subscription.tier,
          status: u.subscription.status,
          billingInterval: u.subscription.stripePriceId
            ? yearlyPriceIds.has(u.subscription.stripePriceId)
              ? "yearly"
              : "monthly"
            : null,
        }
      : null,
  }));

  return NextResponse.json({
    subscribers: {
      byTier: tierCounts,
      byStatus: statusCounts,
      totalActive:
        (tierCounts.STARTER ?? 0) +
        (tierCounts.ESSENTIAL ?? 0) +
        (tierCounts.PRO_PLUS ?? 0),
      newLast7: newSubsLast7,
      newLast30: newSubsLast30,
      canceledByTier: canceledCounts,
    },
    credits: { granted: creditsGranted, spent: creditsSpent },
    revenueThisMonth: monthlyRevenue,
    recentSignups: signupsWithBilling,
  });
}
