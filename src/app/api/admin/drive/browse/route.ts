import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminDrive } from "@/lib/google/admin-client";

export async function GET(request: Request) {
  // Auth + admin check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { id: true, role: true, googleAccessToken: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!dbUser.googleAccessToken) {
    return NextResponse.json(
      { error: "Admin must connect Google Drive", connectUrl: "/api/auth/google?admin=true" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const folderId =
    searchParams.get("folderId") || process.env.GOOGLE_ADMIN_FOLDER_ID;
  const pageToken = searchParams.get("pageToken") || undefined;

  if (!folderId) {
    return NextResponse.json(
      { error: "GOOGLE_ADMIN_FOLDER_ID not configured" },
      { status: 500 }
    );
  }

  try {
    const drive = await getAdminDrive(dbUser.id);

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields:
        "nextPageToken, files(id, name, mimeType, thumbnailLink, modifiedTime, webViewLink)",
      pageSize: 50,
      pageToken,
      orderBy: "modifiedTime desc",
    });

    return NextResponse.json({
      files: response.data.files ?? [],
      nextPageToken: response.data.nextPageToken ?? null,
      folderId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Drive API error";
    if (message.includes("Google account not connected")) {
      return NextResponse.json(
        { error: "Admin must connect Google Drive", connectUrl: "/api/auth/google?admin=true" },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
