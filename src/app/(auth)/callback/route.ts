import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name,
        },
      });

      return NextResponse.redirect(`${origin}/library`);
    }
  }

  // If code exchange fails, redirect to login with error
  return NextResponse.redirect(`${origin}/login`);
}
