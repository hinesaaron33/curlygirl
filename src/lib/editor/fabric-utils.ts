import type { Canvas } from "fabric";

// Slide dimensions
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;

/**
 * Return a minimal Fabric.js JSON object representing an empty canvas.
 *
 * Dimensions: 960 x 540 (16:9), white background.
 */
export function createBlankSlide(): Record<string, unknown> {
  return {
    version: "6.0.0",
    objects: [],
    background: "#ffffff",
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  };
}

/**
 * Serialize a Fabric.js canvas to its JSON representation.
 *
 * @param canvas - A `fabric.Canvas` instance.
 * @returns A plain object suitable for storage / undo history.
 */
export function serializeCanvas(canvas: Canvas): Record<string, unknown> {
  return canvas.toJSON() as Record<string, unknown>;
}

/**
 * Load a previously-serialized JSON object into a Fabric.js canvas.
 *
 * @param canvas - The target `fabric.Canvas` instance.
 * @param json   - A Fabric.js-compatible JSON object (e.g. from `serializeCanvas`).
 * @returns A promise that resolves once the canvas has finished rendering.
 */
export function loadCanvasFromJSON(
  canvas: Canvas,
  json: Record<string, unknown>,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      canvas.loadFromJSON(json).then(() => {
        canvas.renderAll();
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
