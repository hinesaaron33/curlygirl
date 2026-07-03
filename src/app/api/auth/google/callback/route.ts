import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import {
  exchangeCodeForTokens,
  emailFromIdToken,
  OAUTH_STATE_COOKIE,
} from "@/lib/google/oauth";
import { encrypt } from "@/lib/google/token-encryption";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Parse the state we issued at flow start: "<role>.<nonce>".
  const [stateRole, stateNonce] = (state ?? "").split(".");
  const isAdmin = stateRole === "admin";
  const errorRedirect = isAdmin
    ? `${appUrl}/admin/content?google=error`
    : `${appUrl}/library?google=error`;
  const successRedirect = isAdmin
    ? `${appUrl}/admin/content?google=connected`
    : `${appUrl}/library?google=connected`;

  // CSRF check: the state nonce must match the HttpOnly cookie set when this
  // flow began. Without it, an attacker could complete Google consent with
  // their own account and replay the callback into a victim's session,
  // binding the attacker's Google tokens/email to the victim. We clear the
  // one-time cookie on every outcome so it can't be reused.
  const cookieNonce = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${OAUTH_STATE_COOKIE}=`))
    ?.split("=")[1];

  const clearStateCookie = (res: NextResponse) => {
    res.cookies.set(OAUTH_STATE_COOKIE, "", { path: "/", maxAge: 0 });
    return res;
  };

  if (!stateNonce || !cookieNonce || stateNonce !== cookieNonce) {
    return clearStateCookie(NextResponse.redirect(errorRedirect));
  }

  if (!code) {
    return clearStateCookie(NextResponse.redirect(errorRedirect));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return clearStateCookie(NextResponse.redirect(`${appUrl}/login`));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      return clearStateCookie(NextResponse.redirect(errorRedirect));
    }

    const googleEmail = emailFromIdToken(tokens.id_token);

    await prisma.user.update({
      where: { email: user.email! },
      data: {
        googleAccessToken: encrypt(tokens.access_token),
        googleRefreshToken: encrypt(tokens.refresh_token),
        googleTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
        ...(googleEmail ? { googleEmail } : {}),
      },
    });

    return clearStateCookie(NextResponse.redirect(successRedirect));
  } catch {
    return clearStateCookie(NextResponse.redirect(errorRedirect));
  }
}
