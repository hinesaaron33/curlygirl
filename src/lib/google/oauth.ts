import { google } from "googleapis";

function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );
}

/*
 * Subscribers only share their email — lessons are delivered by the admin
 * account copying the file and sharing it to this address, so no Drive
 * permission is requested from subscribers.
 */
export const SUBSCRIBER_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
];

/* Full drive (not just drive.file) so the admin token can copy source files
 * it owns and manage permissions on the delivered copies. */
export const ADMIN_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/spreadsheets.readonly",
];

/* Extracts the verified email from a Google id_token (JWT). The token comes
 * straight from Google's token endpoint over TLS, so decoding without
 * signature verification is safe here. */
export function emailFromIdToken(idToken: string | null | undefined): string | null {
  if (!idToken) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(idToken.split(".")[1], "base64url").toString()
    );
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

export function getGoogleAuthUrl(
  scopes: string[] = SUBSCRIBER_SCOPES,
  state?: string
) {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function refreshAccessToken(refreshToken: string) {
  const client = getOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await client.refreshAccessToken();
  return credentials;
}

export function getSubscriberDrive(accessToken: string) {
  const client = getOAuthClient();
  client.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth: client });
}
