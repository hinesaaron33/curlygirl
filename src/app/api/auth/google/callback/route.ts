import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { exchangeCodeForTokens } from "@/lib/google/oauth";
import { encrypt } from "@/lib/google/token-encryption";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const isAdmin = state === "admin";
  const errorRedirect = isAdmin
    ? `${appUrl}/admin/content?google=error`
    : `${appUrl}/library?google=error`;
  const successRedirect = isAdmin
    ? `${appUrl}/admin/content?google=connected`
    : `${appUrl}/library?google=connected`;

  if (!code) {
    return NextResponse.redirect(errorRedirect);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/login`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(errorRedirect);
    }

    await prisma.user.update({
      where: { email: user.email! },
      data: {
        googleAccessToken: encrypt(tokens.access_token),
        googleRefreshToken: encrypt(tokens.refresh_token),
        googleTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
      },
    });

    return NextResponse.redirect(successRedirect);
  } catch {
    return NextResponse.redirect(errorRedirect);
  }
}
