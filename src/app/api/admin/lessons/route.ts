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

  const lessons = await prisma.lessonPlan.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      gradeLevel: true,
      topic: true,
      published: true,
    },
  });

  return NextResponse.json({ lessons });
}
