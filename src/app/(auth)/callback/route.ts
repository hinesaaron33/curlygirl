import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const user = data.session.user;
      const email = user.email!;
      const name = user.user_metadata?.name ?? email;

      // Create User record in prisma if not exists
      const dbUser = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name,
        },
        select: { role: true },
      });

      const dest = dbUser.role === "ADMIN" ? "/admin" : "/library";
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  // If code exchange fails, redirect to login with error
  return NextResponse.redirect(`${origin}/login`);
}
