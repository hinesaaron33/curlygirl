import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { getGoogleAuthUrl } from "@/lib/google/oauth";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login`
    );
  }

  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  let scopes = ["https://www.googleapis.com/auth/drive.file"];
  let state: string | undefined;

  if (isAdmin) {
    // Verify the user is actually an admin
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { role: true },
    });

    if (dbUser?.role === "ADMIN") {
      scopes = [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets.readonly",
      ];
      state = "admin";
    }
  }

  const url = getGoogleAuthUrl(scopes, state);
  return NextResponse.redirect(url);
}
