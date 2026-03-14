import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { copyFileToSubscriber } from "@/lib/google/drive";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { id: true, googleAccessToken: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!dbUser.googleAccessToken) {
    return NextResponse.json(
      { error: "Google account not connected" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { lessonPlanId } = body;

  if (!lessonPlanId) {
    return NextResponse.json(
      { error: "lessonPlanId is required" },
      { status: 400 }
    );
  }

  try {
    const result = await copyFileToSubscriber(dbUser.id, lessonPlanId);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Copy failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
