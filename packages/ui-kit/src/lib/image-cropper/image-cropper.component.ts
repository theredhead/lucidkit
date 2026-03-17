import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  untracked,
  viewChild,
} from "@angular/core";
import { LoggerFactory } from "@theredhead/foundation";
import type {
  CropHandle,
  CropRegion,
  ImageExportFormat,
  ImageFit,
} from "./image-cropper.types";
import {
  HANDLE_SIZE,
  canvasToImage,
  computeImageFit,
  computeInitialCrop,
  constrainToAspectRatio,
  cursorForHandle,
  hitTestHandle,
  regionToCanvas,
  updateCrop,
} from "./image-cropper.utils";

/**
 * Canvas-based image cropper supporting free-form and fixed-aspect-ratio
 * cropping. Renders the source image with a draggable crop overlay and
 * exports the result as PNG or JPEG via {@link crop}, or as raw pixels
 * via {@link cropToImageData}.
 *
 * The source can be provided as a URL string via the `src` input, or
 * programmatically as raw `ImageData` via {@link loadImageData}.
 *
 * @example
 * ```html
 * <!-- URL-based -->
 * <ui-image-cropper [src]="imageUrl" [aspectRatio]="16/9" />
 *
 * <!-- Programmatic ImageData -->
 * <ui-image-cropper #cropper />
 * ```
 * ```ts
 * this.cropper.loadImageData(myImageData);
 * const cropped = this.cropper.cropToImageData();
 * ```
 */
@Component({
  selector: "ui-image-cropper",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./image-cropper.component.html",
  styleUrl: "./image-cropper.component.scss",
  host: {
    class: "ui-image-cropper",
  },
})
export class UIImageCropper implements AfterViewInit {
  // ── Inputs ────────────────────────────────────────────────────────

  /**
   * Image source — URL, data URL, or object URL.
   * Optional when using {@link loadImageData} to supply pixels directly.
   */
  public readonly src = input<string | null>(null);

  /**
   * Locked aspect ratio (width ÷ height). When set, the crop region
   * is constrained to this ratio. Set to `null` for free-form cropping.
   */
  public readonly aspectRatio = input<number | null>(null);

  /** Export format. Defaults to `'image/png'`. */
  public readonly outputFormat = input<ImageExportFormat>("image/png");

  /** JPEG quality (0–1). Only used when `outputFormat` is `'image/jpeg'`. */
  public readonly outputQuality = input<number>(0.92);

  /** Accessible label for the canvas element. */
  public readonly ariaLabel = input<string>("Image cropper");

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emits the image dimensions after a source image finishes loading. */
  public readonly imageLoaded = output<{ width: number; height: number }>();

  /** Emits the current crop region (image coords) after every change. */
  public readonly regionChange = output<CropRegion>();

  // ── Queries ───────────────────────────────────────────────────────

  private readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>("canvas");

  // ── Private fields ────────────────────────────────────────────────

  private readonly destroyRef = inject(DestroyRef);
  private readonly log = inject(LoggerFactory).createLogger("UIImageCropper");

  /** The drawable source (HTMLImageElement, offscreen canvas, etc.). */
  private source: CanvasImageSource | null = null;
  /** Source image width in pixels. */
  private sourceWidth = 0;
  /** Source image height in pixels. */
  private sourceHeight = 0;
  private fit: ImageFit = { x: 0, y: 0, width: 0, height: 0, scale: 1 };
  private region: CropRegion = { x: 0, y: 0, width: 0, height: 0 };
  private drag: {
    handle: CropHandle;
    startRegion: CropRegion;
    startX: number;
    startY: number;
  } | null = null;
  private ro: ResizeObserver | null = null;

  // ── Constructor ───────────────────────────────────────────────────

  public constructor() {
    // Load a new image whenever `src` changes.
    effect(() => {
      const src = this.src();
      untracked(() => {
        if (src) {
          this.loadImage(src);
        }
      });
    });

    // Re-constrain the crop when `aspectRatio` changes.
    effect(() => {
      const ratio = this.aspectRatio();
      untracked(() => {
        if (!this.source) return;
        if (ratio != null) {
          this.region = constrainToAspectRatio(
            this.region,
            ratio,
            this.sourceWidth,
            this.sourceHeight,
          );
        }
        this.render();
        this.regionChange.emit({ ...this.region });
      });
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────

  public ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;
    this.syncCanvasSize();

    this.ro = new ResizeObserver(() => {
      this.syncCanvasSize();
      if (this.source) {
        this.computeFit();
        this.render();
      }
    });
    this.ro.observe(canvas);
    this.destroyRef.onDestroy(() => this.ro?.disconnect());
  }

  // ── Public methods ────────────────────────────────────────────────

  /**
   * Exports the current crop as a `Blob` in the configured format.
   *
   * @returns A `Promise` that resolves with the cropped image `Blob`.
   * @throws If no image is loaded or the canvas context is unavailable.
   */
  public async crop(): Promise<Blob> {
    if (!this.source) throw new Error("No image loaded");

    const { x, y, width, height } = this.region;
    const offscreen = document.createElement("canvas");
    offscreen.width = Math.round(width);
    offscreen.height = Math.round(height);
    const ctx = offscreen.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    ctx.drawImage(
      this.source,
      Math.round(x),
      Math.round(y),
      Math.round(width),
      Math.round(height),
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    const format = this.outputFormat();
    const quality = format === "image/jpeg" ? this.outputQuality() : undefined;

    return new Promise<Blob>((resolve, reject) => {
      offscreen.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Image export failed")),
        format,
        quality,
      );
    });
  }

  /**
   * Exports the current crop as raw `ImageData`.
   *
   * @returns The cropped pixel data.
   * @throws If no image is loaded or the canvas context is unavailable.
   */
  public cropToImageData(): ImageData {
    if (!this.source) throw new Error("No image loaded");

    const { x, y, width, height } = this.region;
    const w = Math.round(width);
    const h = Math.round(height);
    const offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
    const ctx = offscreen.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    ctx.drawImage(
      this.source,
      Math.round(x),
      Math.round(y),
      Math.round(width),
      Math.round(height),
      0,
      0,
      w,
      h,
    );

    return ctx.getImageData(0, 0, w, h);
  }

  /**
   * Resets the crop region to cover the entire image (or the largest
   * area fitting the current aspect ratio).
   */
  public reset(): void {
    if (!this.source) return;
    this.region = computeInitialCrop(
      this.sourceWidth,
      this.sourceHeight,
      this.aspectRatio(),
    );
    this.render();
    this.regionChange.emit({ ...this.region });
  }

  /**
   * Loads raw `ImageData` as the cropper source. This is the
   * programmatic alternative to binding a URL via the `src` input.
   *
   * @param data - The pixel data to crop.
   */
  public loadImageData(data: ImageData): void {
    const canvas = document.createElement("canvas");
    canvas.width = data.width;
    canvas.height = data.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      this.log.error("Failed to create offscreen canvas for ImageData");
      return;
    }
    ctx.putImageData(data, 0, 0);
    this.setSource(canvas, data.width, data.height);
  }

  // ── Protected methods (template) ──────────────────────────────────

  /** @internal */
  protected onPointerDown(event: PointerEvent): void {
    if (!this.source) return;
    const canvas = this.canvasRef().nativeElement;
    const { x: cx, y: cy } = this.getCanvasPoint(event);
    const cropCanvas = regionToCanvas(this.region, this.fit);
    const handle = hitTestHandle(cx, cy, cropCanvas);
    if (!handle) return;

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);

    const imgPt = canvasToImage(cx, cy, this.fit);
    this.drag = {
      handle,
      startRegion: { ...this.region },
      startX: imgPt.x,
      startY: imgPt.y,
    };
  }

  /** @internal */
  protected onPointerMove(event: PointerEvent): void {
    const canvas = this.canvasRef().nativeElement;
    const { x: cx, y: cy } = this.getCanvasPoint(event);

    if (this.drag && this.source) {
      const imgPt = canvasToImage(cx, cy, this.fit);
      const dx = imgPt.x - this.drag.startX;
      const dy = imgPt.y - this.drag.startY;
      this.region = updateCrop(
        this.drag.handle,
        dx,
        dy,
        this.drag.startRegion,
        this.sourceWidth,
        this.sourceHeight,
        this.aspectRatio(),
      );
      this.render();
    }

    // Update cursor
    const cropCanvas = regionToCanvas(this.region, this.fit);
    const handle = this.drag?.handle ?? hitTestHandle(cx, cy, cropCanvas);
    canvas.style.cursor = cursorForHandle(handle);
  }

  /** @internal */
  protected onPointerUp(event: PointerEvent): void {
    if (!this.drag) return;
    const canvas = this.canvasRef().nativeElement;
    canvas.releasePointerCapture(event.pointerId);
    this.drag = null;
    this.regionChange.emit({ ...this.region });
  }

  // ── Private methods ───────────────────────────────────────────────

  private loadImage(src: string): void {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this.setSource(img, img.naturalWidth, img.naturalHeight);
    };
    img.onerror = () => {
      this.log.error("Failed to load image", [src]);
    };
    img.src = src;
  }

  /**
   * Common initialisation shared by `loadImage` and `loadImageData`.
   */
  private setSource(
    source: CanvasImageSource,
    width: number,
    height: number,
  ): void {
    this.source = source;
    this.sourceWidth = width;
    this.sourceHeight = height;
    this.syncCanvasSize();
    this.computeFit();
    this.region = computeInitialCrop(width, height, this.aspectRatio());
    this.render();
    this.imageLoaded.emit({ width, height });
    this.regionChange.emit({ ...this.region });
  }

  private syncCanvasSize(): void {
    const canvas = this.canvasRef().nativeElement;
    const { clientWidth, clientHeight } = canvas;
    if (clientWidth === 0 || clientHeight === 0) return;
    if (canvas.width !== clientWidth) canvas.width = clientWidth;
    if (canvas.height !== clientHeight) canvas.height = clientHeight;
  }

  private computeFit(): void {
    if (!this.source) return;
    const canvas = this.canvasRef().nativeElement;
    this.fit = computeImageFit(
      this.sourceWidth,
      this.sourceHeight,
      canvas.width,
      canvas.height,
    );
  }

  private render(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext("2d");
    if (!ctx || !this.source) return;

    const { width: cw, height: ch } = canvas;
    const fit = this.fit;
    const crop = regionToCanvas(this.region, fit);

    // Clear
    ctx.clearRect(0, 0, cw, ch);

    // Draw image
    ctx.drawImage(this.source, fit.x, fit.y, fit.width, fit.height);

    // Dark overlay around crop region (4 rectangles)
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    // Top
    ctx.fillRect(fit.x, fit.y, fit.width, crop.y - fit.y);
    // Bottom
    ctx.fillRect(
      fit.x,
      crop.y + crop.height,
      fit.width,
      fit.y + fit.height - crop.y - crop.height,
    );
    // Left
    ctx.fillRect(fit.x, crop.y, crop.x - fit.x, crop.height);
    // Right
    ctx.fillRect(
      crop.x + crop.width,
      crop.y,
      fit.x + fit.width - crop.x - crop.width,
      crop.height,
    );

    // Crop border (dashed white)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(crop.x + 0.5, crop.y + 0.5, crop.width - 1, crop.height - 1);
    ctx.setLineDash([]);

    // Rule-of-thirds grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      const gx = crop.x + (crop.width / 3) * i;
      const gy = crop.y + (crop.height / 3) * i;
      ctx.beginPath();
      ctx.moveTo(gx, crop.y);
      ctx.lineTo(gx, crop.y + crop.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, gy);
      ctx.lineTo(crop.x + crop.width, gy);
      ctx.stroke();
    }

    // Handles
    this.drawHandles(ctx, crop);
  }

  private drawHandles(ctx: CanvasRenderingContext2D, crop: CropRegion): void {
    const hs = HANDLE_SIZE;
    const half = hs / 2;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1;

    const { x: cx, y: cy, width: cw, height: ch } = crop;
    const positions: [number, number][] = [
      // Corners
      [cx, cy],
      [cx + cw, cy],
      [cx, cy + ch],
      [cx + cw, cy + ch],
      // Edge midpoints
      [cx + cw / 2, cy],
      [cx + cw / 2, cy + ch],
      [cx, cy + ch / 2],
      [cx + cw, cy + ch / 2],
    ];

    for (const [px, py] of positions) {
      ctx.fillRect(px - half, py - half, hs, hs);
      ctx.strokeRect(px - half, py - half, hs, hs);
    }
  }

  private getCanvasPoint(event: PointerEvent): { x: number; y: number } {
    const rect = this.canvasRef().nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}
