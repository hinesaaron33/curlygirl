import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.user_metadata?.name ?? user.email,
      },
      select: { role: true },
    });

    return NextResponse.json({ ok: true, role: dbUser.role });
  } catch (err) {
    console.error("Auth sync error:", err);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
