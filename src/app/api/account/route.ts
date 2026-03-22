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
    select: {
      name: true,
      email: true,
      googleAccessToken: true,
      googleEmail: true,
      subscription: true,
    },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      name: dbUser.name,
      email: dbUser.email,
      googleEmail: dbUser.googleEmail,
      googleConnected: !!dbUser.googleAccessToken,
    },
    subscription: dbUser.subscription
      ? {
          tier: dbUser.subscription.tier,
          status: dbUser.subscription.status,
          creditsBalance: dbUser.subscription.creditsBalance,
          currentPeriodStart: dbUser.subscription.currentPeriodStart,
          currentPeriodEnd: dbUser.subscription.currentPeriodEnd,
          cancelAtPeriodEnd: dbUser.subscription.cancelAtPeriodEnd,
        }
      : null,
  });
}
