import type { sheets_v4 } from "googleapis";

export interface SheetRow {
  tabName: string;
  productTitle: string;
  driveLink: string | null;
  driveFileId: string | null;
  tptLink: string | null;
  price: string | null;
  resourceType: string | null;
  slifeReady: boolean | null;
  resourceCount: string | null;
  pageSlideCount: string | null;
  theme: string | null;
  resourceUpdate: string | null;
  coverPreviewUpdate: string | null;
  bundleNames: string[];
}

/** Extract Google Drive file ID from a URL like https://drive.google.com/...d/FILE_ID/... */
export function extractDriveFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Canonical header names mapped to SheetRow keys
const HEADER_MAP: Record<string, keyof SheetRow> = {
  "product title": "productTitle",
  "gdrive link": "driveLink",
  "tpt link": "tptLink",
  "price": "price",
  "resource type": "resourceType",
  "slife ready": "slifeReady",
  "resource count": "resourceCount",
  "page/slide count": "pageSlideCount",
  "theme": "theme",
  "resource update": "resourceUpdate",
  "cover/preview update": "coverPreviewUpdate",
  "which bundle it belongs to": "bundleNames",
};

function normalizeHeader(header: string): string {
  return header.toLowerCase().trim();
}

export function parseSheetData(
  spreadsheet: sheets_v4.Schema$Spreadsheet
): SheetRow[] {
  const rows: SheetRow[] = [];

  for (const sheet of spreadsheet.sheets ?? []) {
    const tabName = sheet.properties?.title ?? "Unknown";
    const gridData = sheet.data?.[0];
    if (!gridData?.rowData?.length) continue;

    // Build column index from header row
    const headerRow = gridData.rowData[0];
    const columnMap: Record<string, number> = {};

    for (let col = 0; col < (headerRow.values?.length ?? 0); col++) {
      const cell = headerRow.values![col];
      const headerText = cell?.formattedValue;
      if (!headerText) continue;
      const normalized = normalizeHeader(headerText);
      if (normalized in HEADER_MAP) {
        columnMap[HEADER_MAP[normalized]] = col;
      }
    }

    // Parse data rows (skip header)
    for (let row = 1; row < gridData.rowData.length; row++) {
      const rowData = gridData.rowData[row];
      if (!rowData.values) continue;

      const getCell = (key: keyof SheetRow) => {
        const col = columnMap[key];
        if (col === undefined) return undefined;
        return rowData.values![col];
      };

      const titleCell = getCell("productTitle");
      const title = titleCell?.formattedValue?.trim();
      if (!title) continue; // Skip rows with no product title

      // Extract hyperlinks for drive and TPT links
      const driveLinkCell = getCell("driveLink");
      const driveUrl = driveLinkCell?.hyperlink ?? driveLinkCell?.formattedValue ?? null;

      const tptLinkCell = getCell("tptLink");
      const tptUrl = tptLinkCell?.hyperlink ?? tptLinkCell?.formattedValue ?? null;

      const slifeCell = getCell("slifeReady");
      const slifeValue = slifeCell?.formattedValue?.trim().toLowerCase();

      const bundleCell = getCell("bundleNames");
      const bundleText = bundleCell?.formattedValue?.trim() ?? "";

      rows.push({
        tabName,
        productTitle: title,
        driveLink: driveUrl,
        driveFileId: driveUrl ? extractDriveFileId(driveUrl) : null,
        tptLink: tptUrl,
        price: getCell("price")?.formattedValue?.trim() ?? null,
        resourceType: getCell("resourceType")?.formattedValue?.trim() ?? null,
        slifeReady: slifeValue === "yes" ? true : slifeValue === "no" ? false : null,
        resourceCount: getCell("resourceCount")?.formattedValue?.trim() ?? null,
        pageSlideCount: getCell("pageSlideCount")?.formattedValue?.trim() ?? null,
        theme: getCell("theme")?.formattedValue?.trim() ?? null,
        resourceUpdate: getCell("resourceUpdate")?.formattedValue?.trim() ?? null,
        coverPreviewUpdate: getCell("coverPreviewUpdate")?.formattedValue?.trim() ?? null,
        bundleNames: bundleText
          ? bundleText.split(",").map((b) => b.trim()).filter(Boolean)
          : [],
      });
    }
  }

  return rows;
}
