import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { getAdminSheets } from "@/lib/google/admin-client";
import { parseSheetData, type SheetRow } from "@/lib/google/sheet-parser";

async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { id: true, role: true, googleAccessToken: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") return null;
  return dbUser;
}

export type SyncStatus = "matched" | "pending" | "no_drive_link";

export interface SyncRow extends SheetRow {
  status: SyncStatus;
  lessonPlanId?: string;
}

export async function GET() {
  const dbUser = await getAdminUser();
  if (!dbUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!dbUser.googleAccessToken) {
    return NextResponse.json(
      {
        error: "Admin must connect Google account",
        connectUrl: "/api/auth/google?admin=true",
      },
      { status: 401 }
    );
  }

  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    return NextResponse.json(
      { error: "GOOGLE_SHEET_ID not configured" },
      { status: 500 }
    );
  }

  try {
    const sheets = await getAdminSheets(dbUser.id);
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
      includeGridData: true,
      fields:
        "sheets.properties.title,sheets.data.rowData.values(formattedValue,hyperlink)",
    });

    const rows = parseSheetData(response.data);

    // Get all Drive file IDs from sheet rows
    const driveFileIds = rows
      .map((r) => r.driveFileId)
      .filter((id): id is string => id !== null);

    // Find which ones already exist in DB
    const existingLessons = await prisma.lessonPlan.findMany({
      where: { googleDriveFileId: { in: driveFileIds } },
      select: { id: true, googleDriveFileId: true },
    });

    const existingMap = new Map(
      existingLessons.map((lp) => [lp.googleDriveFileId, lp.id])
    );

    // Classify rows
    const syncRows: SyncRow[] = rows.map((row) => {
      if (!row.driveFileId) {
        return { ...row, status: "no_drive_link" as const };
      }
      const lessonPlanId = existingMap.get(row.driveFileId);
      if (lessonPlanId) {
        return { ...row, status: "matched" as const, lessonPlanId };
      }
      return { ...row, status: "pending" as const };
    });

    return NextResponse.json({ rows: syncRows });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sheets API error";
    if (message.includes("Google account not connected")) {
      return NextResponse.json(
        {
          error: "Admin must connect Google account",
          connectUrl: "/api/auth/google?admin=true",
        },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const dbUser = await getAdminUser();
  if (!dbUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { rows } = (await request.json()) as { rows: SheetRow[] };

  if (!rows?.length) {
    return NextResponse.json(
      { error: "No rows provided" },
      { status: 400 }
    );
  }

  // Filter to only rows with drive file IDs
  const importable = rows.filter((r) => r.driveFileId);
  if (!importable.length) {
    return NextResponse.json(
      { error: "No rows with Drive file IDs" },
      { status: 400 }
    );
  }

  // Check for duplicates
  const driveFileIds = importable.map((r) => r.driveFileId!);
  const existing = await prisma.lessonPlan.findMany({
    where: { googleDriveFileId: { in: driveFileIds } },
    select: { googleDriveFileId: true },
  });
  const existingIds = new Set(existing.map((lp) => lp.googleDriveFileId));

  const toCreate = importable.filter(
    (r) => !existingIds.has(r.driveFileId)
  );

  if (!toCreate.length) {
    return NextResponse.json({
      created: 0,
      message: "All rows already exist in database",
    });
  }

  try {
    const created = await prisma.$transaction(
      toCreate.map((row) =>
        prisma.lessonPlan.create({
          data: {
            title: row.productTitle,
            gradeLevel: row.tabName,
            topic: row.theme || "General",
            languageSkill: "ELD",
            slidesData: {},
            googleDriveFileId: row.driveFileId!,
            googleDriveUrl: row.driveLink ?? undefined,
            tabName: row.tabName,
            tptLink: row.tptLink,
            price: row.price,
            resourceType: row.resourceType,
            slifeReady: row.slifeReady,
            resourceCount: row.resourceCount,
            pageSlideCount: row.pageSlideCount,
            theme: row.theme,
            resourceUpdate: row.resourceUpdate,
            coverPreviewUpdate: row.coverPreviewUpdate,
            bundleNames: row.bundleNames,
            sheetSyncedAt: new Date(),
            published: false,
            createdById: dbUser.id,
          },
        })
      )
    );

    return NextResponse.json({
      created: created.length,
      message: `Imported ${created.length} lesson plan(s)`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
