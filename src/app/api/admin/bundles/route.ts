import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { role: true },
  });

  return dbUser?.role === "ADMIN" ? dbUser : null;
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bundles = await prisma.bundle.findMany({
    orderBy: [{ tier: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { lessonPlans: true } },
    },
  });

  return NextResponse.json({ bundles });
}

export async function POST(request: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, tier, description } = body;

  if (!name || !tier) {
    return NextResponse.json(
      { error: "Name and tier are required" },
      { status: 400 }
    );
  }

  if (!["STARTER", "ESSENTIAL", "PRO_PLUS"].includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  const bundle = await prisma.bundle.create({
    data: { name, tier, description: description || null },
    include: { _count: { select: { lessonPlans: true } } },
  });

  return NextResponse.json({ bundle }, { status: 201 });
}
