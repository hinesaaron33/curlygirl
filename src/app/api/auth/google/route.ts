import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import {
  getGoogleAuthUrl,
  SUBSCRIBER_SCOPES,
  ADMIN_SCOPES,
  OAUTH_STATE_COOKIE,
} from "@/lib/google/oauth";

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

  let scopes = SUBSCRIBER_SCOPES;
  let role: "admin" | "user" = "user";

  if (isAdmin) {
    // Verify the user is actually an admin
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { role: true },
    });

    if (dbUser?.role === "ADMIN") {
      scopes = ADMIN_SCOPES;
      role = "admin";
    }
  }

  // CSRF protection: bind this OAuth flow to a random nonce stored in an
  // HttpOnly cookie. The callback rejects any response whose state doesn't
  // match the cookie, so an attacker can't feed their own Google `code` into
  // a victim's session. The role is part of the state so the callback knows
  // which redirect to use; it's trustworthy because we only set role=admin
  // here after verifying the session is an admin.
  const nonce = randomBytes(32).toString("hex");
  const state = `${role}.${nonce}`;

  const url = getGoogleAuthUrl(scopes, state);
  const response = NextResponse.redirect(url);
  response.cookies.set(OAUTH_STATE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes to complete the flow
  });
  return response;
}
