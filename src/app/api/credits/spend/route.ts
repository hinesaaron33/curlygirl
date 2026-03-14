import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { purchaseWithCredit, copyFileToSubscriber } from "@/lib/google/drive";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { lessonPlanId } = body;

  if (!lessonPlanId || typeof lessonPlanId !== "string") {
    return NextResponse.json({ error: "lessonPlanId is required" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { subscription: true },
  });

  if (!dbUser?.subscription) {
    return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
  }

  try {
    await purchaseWithCredit(dbUser.id, lessonPlanId);
    const result = await copyFileToSubscriber(dbUser.id, lessonPlanId);

    const updatedSub = await prisma.subscription.findUnique({
      where: { userId: dbUser.id },
      select: { creditsBalance: true },
    });

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      url: result.url,
      creditsRemaining: updatedSub?.creditsBalance ?? 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
