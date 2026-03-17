import type { CropHandle, CropRegion, ImageFit } from "./image-cropper.types";

/** Hit-test threshold in canvas CSS pixels. */
export const HANDLE_THRESHOLD = 10;

/** Visual handle size in canvas CSS pixels. */
export const HANDLE_SIZE = 8;

/** Minimum crop region dimension in image pixels. */
export const MIN_CROP_SIZE = 10;

/**
 * Computes how a source image fits within a canvas while preserving
 * its aspect ratio (object-fit: contain behaviour).
 */
export function computeImageFit(
  imageWidth: number,
  imageHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): ImageFit {
  const scaleX = canvasWidth / imageWidth;
  const scaleY = canvasHeight / imageHeight;
  const scale = Math.min(scaleX, scaleY);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    x: (canvasWidth - width) / 2,
    y: (canvasHeight - height) / 2,
    width,
    height,
    scale,
  };
}

/**
 * Computes the initial crop region for a given image and optional
 * aspect ratio. Returns the largest region that fits the image
 * with the given ratio, centered.
 */
export function computeInitialCrop(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null,
): CropRegion {
  if (aspectRatio === null || aspectRatio <= 0) {
    return { x: 0, y: 0, width: imageWidth, height: imageHeight };
  }

  let cropWidth: number;
  let cropHeight: number;

  if (imageWidth / imageHeight > aspectRatio) {
    cropHeight = imageHeight;
    cropWidth = cropHeight * aspectRatio;
  } else {
    cropWidth = imageWidth;
    cropHeight = cropWidth / aspectRatio;
  }

  return {
    x: Math.round((imageWidth - cropWidth) / 2),
    y: Math.round((imageHeight - cropHeight) / 2),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight),
  };
}

/** Converts a crop region from image coordinates to canvas coordinates. */
export function regionToCanvas(region: CropRegion, fit: ImageFit): CropRegion {
  return {
    x: region.x * fit.scale + fit.x,
    y: region.y * fit.scale + fit.y,
    width: region.width * fit.scale,
    height: region.height * fit.scale,
  };
}

/** Converts a canvas point to image coordinates. */
export function canvasToImage(
  canvasX: number,
  canvasY: number,
  fit: ImageFit,
): { x: number; y: number } {
  return {
    x: (canvasX - fit.x) / fit.scale,
    y: (canvasY - fit.y) / fit.scale,
  };
}

/**
 * Hit-tests a canvas coordinate against the crop region handles.
 * Returns the handle under the pointer, or `null` if none.
 */
export function hitTestHandle(
  x: number,
  y: number,
  crop: CropRegion,
  threshold: number = HANDLE_THRESHOLD,
): CropHandle | null {
  const right = crop.x + crop.width;
  const bottom = crop.y + crop.height;

  const nearLeft = Math.abs(x - crop.x) <= threshold;
  const nearRight = Math.abs(x - right) <= threshold;
  const nearTop = Math.abs(y - crop.y) <= threshold;
  const nearBottom = Math.abs(y - bottom) <= threshold;
  const withinX = x >= crop.x - threshold && x <= right + threshold;
  const withinY = y >= crop.y - threshold && y <= bottom + threshold;

  // Corners (check first — they overlap with edges)
  if (nearLeft && nearTop) return "nw";
  if (nearRight && nearTop) return "ne";
  if (nearLeft && nearBottom) return "sw";
  if (nearRight && nearBottom) return "se";

  // Edges
  if (nearTop && withinX) return "n";
  if (nearBottom && withinX) return "s";
  if (nearLeft && withinY) return "w";
  if (nearRight && withinY) return "e";

  // Interior
  if (x >= crop.x && x <= right && y >= crop.y && y <= bottom) return "move";

  return null;
}

/** Returns the CSS cursor name for a given crop handle. */
export function cursorForHandle(handle: CropHandle | null): string {
  switch (handle) {
    case "nw":
    case "se":
      return "nwse-resize";
    case "ne":
    case "sw":
      return "nesw-resize";
    case "n":
    case "s":
      return "ns-resize";
    case "e":
    case "w":
      return "ew-resize";
    case "move":
      return "move";
    default:
      return "crosshair";
  }
}

/**
 * Computes a new crop region after a drag delta.
 *
 * @param handle - The handle being dragged.
 * @param dx - Horizontal delta in image pixels.
 * @param dy - Vertical delta in image pixels.
 * @param start - The crop region at the start of the drag.
 * @param imageWidth - Source image width in pixels.
 * @param imageHeight - Source image height in pixels.
 * @param aspectRatio - Locked aspect ratio (width / height), or `null`.
 * @returns The updated crop region, clamped to image bounds.
 */
export function updateCrop(
  handle: CropHandle,
  dx: number,
  dy: number,
  start: CropRegion,
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null,
): CropRegion {
  let { x, y, width, height } = start;

  switch (handle) {
    case "move":
      x += dx;
      y += dy;
      break;

    case "se":
      width += dx;
      height = aspectRatio != null ? width / aspectRatio : height + dy;
      break;

    case "sw":
      x += dx;
      width -= dx;
      height = aspectRatio != null ? width / aspectRatio : height + dy;
      break;

    case "ne":
      width += dx;
      if (aspectRatio != null) {
        const h = width / aspectRatio;
        y -= h - height;
        height = h;
      } else {
        y += dy;
        height -= dy;
      }
      break;

    case "nw":
      x += dx;
      width -= dx;
      if (aspectRatio != null) {
        const h = width / aspectRatio;
        y -= h - height;
        height = h;
      } else {
        y += dy;
        height -= dy;
      }
      break;

    case "n":
      y += dy;
      height -= dy;
      if (aspectRatio != null) {
        const w = height * aspectRatio;
        x += (width - w) / 2;
        width = w;
      }
      break;

    case "s":
      height += dy;
      if (aspectRatio != null) {
        const w = height * aspectRatio;
        x += (width - w) / 2;
        width = w;
      }
      break;

    case "e":
      width += dx;
      if (aspectRatio != null) {
        const h = width / aspectRatio;
        y += (height - h) / 2;
        height = h;
      }
      break;

    case "w":
      x += dx;
      width -= dx;
      if (aspectRatio != null) {
        const h = width / aspectRatio;
        y += (height - h) / 2;
        height = h;
      }
      break;
  }

  // Enforce minimum size
  if (width < MIN_CROP_SIZE) {
    width = MIN_CROP_SIZE;
    if (aspectRatio != null) height = width / aspectRatio;
  }
  if (height < MIN_CROP_SIZE) {
    height = MIN_CROP_SIZE;
    if (aspectRatio != null) width = height * aspectRatio;
  }

  // Clamp to image bounds
  if (handle === "move") {
    x = clamp(x, 0, imageWidth - width);
    y = clamp(y, 0, imageHeight - height);
  } else {
    if (x < 0) {
      width += x;
      x = 0;
    }
    if (y < 0) {
      height += y;
      y = 0;
    }
    if (x + width > imageWidth) width = imageWidth - x;
    if (y + height > imageHeight) height = imageHeight - y;
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(Math.max(width, MIN_CROP_SIZE)),
    height: Math.round(Math.max(height, MIN_CROP_SIZE)),
  };
}

/**
 * Adjusts a crop region to fit a new aspect ratio, keeping it centered
 * within the current region and clamped to image bounds.
 */
export function constrainToAspectRatio(
  region: CropRegion,
  aspectRatio: number,
  imageWidth: number,
  imageHeight: number,
): CropRegion {
  const currentRatio = region.width / region.height;
  if (Math.abs(currentRatio - aspectRatio) < 0.001) return region;

  let newWidth: number;
  let newHeight: number;

  if (currentRatio > aspectRatio) {
    newHeight = region.height;
    newWidth = region.height * aspectRatio;
  } else {
    newWidth = region.width;
    newHeight = region.width / aspectRatio;
  }

  let newX = region.x + (region.width - newWidth) / 2;
  let newY = region.y + (region.height - newHeight) / 2;

  newX = clamp(newX, 0, imageWidth - newWidth);
  newY = clamp(newY, 0, imageHeight - newHeight);

  return {
    x: Math.round(newX),
    y: Math.round(newY),
    width: Math.round(newWidth),
    height: Math.round(newHeight),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
