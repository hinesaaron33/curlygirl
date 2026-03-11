import { jsPDF } from "jspdf";

// Slide dimensions (pixels) - 16:9 ratio
const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

/**
 * Generate a multi-page PDF from an array of canvas image data URLs.
 *
 * Each data URL should be a PNG exported from a Fabric.js canvas at 960x540.
 * The PDF pages are sized to match the 16:9 aspect ratio.
 *
 * @param imageDataUrls - Array of base-64 PNG data URLs (one per slide).
 * @returns A Blob containing the generated PDF.
 */
export function exportSlidesToPdf(imageDataUrls: string[]): Blob {
  if (imageDataUrls.length === 0) {
    throw new Error("At least one slide image is required to generate a PDF.");
  }

  // Use landscape orientation so the 16:9 slides fill the page.
  // Page size is set in points; we convert from pixels at 72 DPI.
  const pxToPt = 72 / 96; // standard screen DPI -> PDF points
  const pageWidth = SLIDE_WIDTH * pxToPt;
  const pageHeight = SLIDE_HEIGHT * pxToPt;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [pageWidth, pageHeight],
  });

  imageDataUrls.forEach((dataUrl, index) => {
    if (index > 0) {
      pdf.addPage([pageWidth, pageHeight], "landscape");
    }

    pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight);
  });

  return pdf.output("blob");
}

/**
 * Trigger a browser download for a given Blob.
 *
 * @param blob     - The file content (e.g. a PDF blob from `exportSlidesToPdf`).
 * @param filename - The suggested file name for the download.
 */
export function downloadPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
