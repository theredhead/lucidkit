import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from "@angular/forms";
import {
  LoggerFactory,
  UISurface,
  UI_DEFAULT_SURFACE_TYPE,
} from "@theredhead/lucid-foundation";
import { UIButton } from "../button/button.component";
import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import type {
  SignatureImageValue,
  SignatureStrokeValue,
  SignatureValue,
  StrokeGroup,
  StrokePoint,
} from "./signature.types";

/** Accepted image MIME types for paste / drop / browse operations. */
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

/**
 * Signature field component supporting drawn strokes, optional pressure-
 * sensitive capture, and image-based input (paste / drop / browse).
 *
 * The field integrates with both Angular reactive / template-driven forms
 * (via `ControlValueAccessor`) and signal-based two-way binding
 * (`[(value)]`).
 *
 * Stroke-based signatures are replayable and exportable as SVG or PNG.
 * Image-based signatures are exportable as PNG only.
 *
 * @example
 * ```html
 * <!-- Signal binding -->
 * <ui-signature [(value)]="sig" />
 *
 * <!-- Forms binding -->
 * <ui-signature [formControl]="sigControl" />
 *
 * <!-- Draw-only with pressure -->
 * <ui-signature [pressureEnabled]="true" [minStrokeWidth]="1" [maxStrokeWidth]="5" />
 *
 * <!-- Image only -->
 * <ui-signature [allowDraw]="false" [allowPaste]="true" [allowDrop]="true" [allowBrowse]="true" />
 * ```
 */
@Component({
  selector: "ui-signature",
  standalone: true,
  imports: [UIButton, UIIcon],
  templateUrl: "./signature.component.html",
  styleUrl: "./signature.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [
    { provide: UI_DEFAULT_SURFACE_TYPE, useValue: "input" },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UISignature),
      multi: true,
    },
  ],
  host: {
    class: "ui-signature",
    "[class.disabled]": "isDisabled()",
    "[class.readonly]": "readOnly()",
    "[class.empty]": "isEmpty()",
    "[class.has-strokes]": "isStrokeBased()",
    "[class.has-image]": "isImageBased()",
    "[class.dragging]": "isDragging()",
    "[class.replaying]": "isReplaying()",
  },
})
export class UISignature implements AfterViewInit, ControlValueAccessor {
  // ── Inputs ────────────────────────────────────────────────────────

  /** Accessible label for the canvas. */
  public readonly ariaLabel = input<string>("Sign here");

  /** Whether drawing with mouse, touch, or pen is allowed. */
  public readonly allowDraw = input(true);

  /** Whether the user can paste an image into the field. */
  public readonly allowPaste = input(false);

  /** Whether the user can drop an image into the field. */
  public readonly allowDrop = input(false);

  /**
   * Whether a browse/import affordance is shown so the user can
   * select an image file from disk.
   */
  public readonly allowBrowse = input(false);

  /**
   * Whether to capture and use pointer pressure for variable-width
   * stroke rendering.
   */
  public readonly pressureEnabled = input(false);

  /** Minimum stroke width in pixels (used when pressure is enabled). */
  public readonly minStrokeWidth = input(1.5);

  /** Maximum stroke width in pixels. Used for fixed width when pressure is disabled. */
  public readonly maxStrokeWidth = input(3.5);

  /** CSS colour of strokes when drawn and exported. */
  public readonly strokeColor = input("#1d232b");

  /** Whether the field is disabled. Also set via CVA `setDisabledState`. */
  public readonly disabled = input(false);

  /** Whether the field is read-only (displays value but prevents changes). */
  public readonly readOnly = input(false);

  // ── Model ─────────────────────────────────────────────────────────

  /** Current signature value. Supports two-way binding via `[(value)]`. */
  public readonly value = model<SignatureValue>(null);

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emitted when the signature is cleared. */
  public readonly cleared = output<void>();

  // ── Queries ───────────────────────────────────────────────────────

  /** @internal */
  private readonly canvasRef =
    viewChild.required<ElementRef<HTMLCanvasElement>>("canvas");

  /** @internal */
  private readonly fileInputRef =
    viewChild<ElementRef<HTMLInputElement>>("fileInput");

  // ── Computed ──────────────────────────────────────────────────────

  /** Whether the field has no signature. */
  public readonly isEmpty = computed(() => this.value() === null);

  /** Whether the current value is a stroke-based signature. */
  public readonly isStrokeBased = computed(
    () => this.value()?.kind === "strokes",
  );

  /** Whether the current value is an image-based signature. */
  public readonly isImageBased = computed(() => this.value()?.kind === "image");

  /** Effective disabled state combining the `disabled` input and CVA state. */
  protected readonly isDisabled = computed(
    () => this.disabled() || this._cvaDisabled(),
  );

  /** Whether the user can currently interact with the field. */
  protected readonly canInteract = computed(
    () => !this.isDisabled() && !this.readOnly(),
  );

  /** Whether the user can currently draw. */
  protected readonly canDraw = computed(
    () => this.canInteract() && this.allowDraw(),
  );

  /** Hint text shown in the empty state, reflecting all enabled input modes. */
  protected readonly emptyHint = computed(() => {
    const draw = this.allowDraw();
    const paste = this.allowPaste();
    const drop = this.allowDrop();
    const browse = this.allowBrowse();
    const modes: string[] = [];
    if (draw) modes.push("draw");
    if (paste) modes.push("paste");
    if (drop) modes.push("drop");
    if (browse) modes.push("browse");
    if (modes.length === 0) return "";
    if (modes.length === 1) {
      const sole = modes[0];
      return `${sole.charAt(0).toUpperCase()}${sole.slice(1)} your signature`;
    }
    const last = modes.pop()!;
    const sentence = `${modes.join(", ")}, or ${last} a signature`;
    return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}`;
  });

  /** Toolbar icon references exposed to the template. */
  protected readonly icons = {
    clear: UIIcons.Lucide.Text.Eraser,
    replay: UIIcons.Lucide.Arrows.RotateCcw,
    browse: UIIcons.Lucide.Files.FolderOpen,
    image: UIIcons.Lucide.Files.Image,
    pen: UIIcons.Lucide.Design.Pencil,
  } as const;

  // ── Protected state (template) ────────────────────────────────────

  /** @internal */
  protected readonly isDragging = signal(false);

  /** @internal */
  protected readonly isReplaying = signal(false);

  // ── Private fields ────────────────────────────────────────────────

  private readonly destroyRef = inject(DestroyRef);
  private readonly log = inject(LoggerFactory).createLogger("UISignature");

  /** Whether the canvas DOM element is initialised and ready to draw. */
  private _canvasReady = false;

  /** Whether the user is currently drawing (pen down). */
  private _isDrawing = false;

  /** CVA-provided disabled state (separate from the `disabled` input). */
  private readonly _cvaDisabled = signal(false);

  /** Accumulated points of the stroke currently being drawn. */
  private _currentPoints: StrokePoint[] = [];

  /** ResizeObserver for keeping canvas intrinsic size in sync with layout. */
  private _ro: ResizeObserver | null = null;

  /** requestAnimationFrame handle used by replay. */
  private _replayRafId: number | null = null;

  // ── CVA callbacks ─────────────────────────────────────────────────

  private _onChangeFn: (value: SignatureValue) => void = () => {};
  private _onTouchedFn: () => void = () => {};

  // ── Constructor ───────────────────────────────────────────────────

  public constructor() {}

  // ── ControlValueAccessor ──────────────────────────────────────────

  /** @inheritdoc */
  public writeValue(value: SignatureValue): void {
    this.value.set(value);
    if (this._canvasReady) {
      this._renderValue(value);
    }
  }

  /** @inheritdoc */
  public registerOnChange(fn: (value: SignatureValue) => void): void {
    this._onChangeFn = fn;
  }

  /** @inheritdoc */
  public registerOnTouched(fn: () => void): void {
    this._onTouchedFn = fn;
  }

  /** @inheritdoc */
  public setDisabledState(isDisabled: boolean): void {
    this._cvaDisabled.set(isDisabled);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────

  /** @inheritdoc */
  public ngAfterViewInit(): void {
    const canvas = this.canvasRef().nativeElement;
    this._syncCanvasSize();

    this._ro = new ResizeObserver(() => {
      this._syncCanvasSize();
      this._renderValue(this.value());
    });
    this._ro.observe(canvas);
    this.destroyRef.onDestroy(() => {
      this._ro?.disconnect();
      if (this._replayRafId !== null) {
        cancelAnimationFrame(this._replayRafId);
      }
    });

    this._canvasReady = true;
    this._renderValue(this.value());
  }

  // ── Public API ────────────────────────────────────────────────────

  /**
   * Clears the signature field, removing all stroke or image data.
   * This action is blocked when the field is disabled or read-only.
   */
  public clear(): void {
    if (!this.canInteract()) return;
    this._stopReplay();
    this.value.set(null);
    if (this._canvasReady) {
      this._clearCanvas();
    }
    this._emitChange(null);
    this.cleared.emit();
  }

  /**
   * Replays the current stroke-based signature animating the strokes
   * in their original drawing order.  Does nothing when the current
   * value is image-based or empty.
   */
  public replay(): void {
    const v = this.value();
    if (!v || v.kind !== "strokes" || !this._canvasReady) return;
    this._stopReplay();
    this.isReplaying.set(true);
    this._replayStrokes(v);
  }

  /**
   * Exports the current signature as an SVG string.
   * Only supported for stroke-based signatures.
   *
   * @returns SVG markup string, or `null` if the current value is not
   *   stroke-based.
   */
  public exportSvg(): string | null {
    const v = this.value();
    if (!v || v.kind !== "strokes") return null;
    return this._buildSvg(v);
  }

  /**
   * Exports the current signature as a PNG data URL.
   * Supported for both stroke-based and image-based signatures.
   *
   * @returns PNG data URL string, or `null` when the field is empty.
   */
  public exportPng(): string | null {
    const v = this.value();
    if (!v) return null;
    if (!this._canvasReady) return null;
    return this.canvasRef().nativeElement.toDataURL("image/png");
  }

  /**
   * Returns whether the current value can be exported in the given format.
   *
   * @param format - `'svg'` or `'png'`.
   */
  public canExport(format: "svg" | "png"): boolean {
    const v = this.value();
    if (!v) return false;
    if (format === "svg") return v.kind === "strokes";
    return true;
  }

  /** Programmatically open the file browser (requires `allowBrowse` to be enabled). */
  public browse(): void {
    if (!this.canInteract() || !this.allowBrowse()) return;
    this.fileInputRef()?.nativeElement.click();
  }

  // ── Template event handlers ───────────────────────────────────────

  /** @internal */
  protected onPointerDown(event: PointerEvent): void {
    if (!this.canDraw()) return;
    const v = this.value();
    if (v && v.kind === "image") return; // don't overlay stroke on top of an image

    this._stopReplay();
    event.preventDefault();
    const canvas = this.canvasRef().nativeElement;
    canvas.setPointerCapture(event.pointerId);

    const pt = this._canvasPoint(event);
    this._currentPoints = [pt];
    this._isDrawing = true;
    this._markTouched();

    const ctx = this._context();
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(
      pt.x,
      pt.y,
      this._widthForPressure(pt.pressure) / 2,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = this.strokeColor();
    ctx.fill();
  }

  /** @internal */
  protected onPointerMove(event: PointerEvent): void {
    if (!this._isDrawing) return;
    event.preventDefault();

    const pt = this._canvasPoint(event);
    const points = this._currentPoints;
    if (points.length === 0) return;

    this._drawSegment(points[points.length - 1], pt);
    points.push(pt);
  }

  /** @internal */
  protected onPointerUp(event: PointerEvent): void {
    if (!this._isDrawing) return;
    this._isDrawing = false;

    const pts = this._currentPoints;
    this._currentPoints = [];
    if (pts.length === 0) return;

    this._finaliseStroke(pts);
  }

  /** @internal */
  protected onPointerCancel(_event: PointerEvent): void {
    if (!this._isDrawing) return;
    this._isDrawing = false;
    this._currentPoints = [];
    // Restore the last committed value on cancel
    this._renderValue(this.value());
  }

  /** @internal */
  protected onPaste(event: ClipboardEvent): void {
    if (!this.canInteract() || !this.allowPaste()) return;
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (ACCEPTED_IMAGE_TYPES.has(item.type)) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          this._loadImageFile(file);
        }
        break;
      }
    }
  }

  /** @internal */
  protected onDragOver(event: DragEvent): void {
    if (!this.canInteract() || !this.allowDrop()) return;
    event.preventDefault();
    this.isDragging.set(true);
  }

  /** @internal */
  protected onDragEnter(event: DragEvent): void {
    if (!this.canInteract() || !this.allowDrop()) return;
    event.preventDefault();
    this.isDragging.set(true);
  }

  /** @internal */
  protected onDragLeave(_event: DragEvent): void {
    this.isDragging.set(false);
  }

  /** @internal */
  protected onDrop(event: DragEvent): void {
    this.isDragging.set(false);
    if (!this.canInteract() || !this.allowDrop()) return;
    event.preventDefault();

    const file = event.dataTransfer?.files[0];
    if (file && ACCEPTED_IMAGE_TYPES.has(file.type)) {
      this._loadImageFile(file);
    }
  }

  /** @internal */
  protected onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this._loadImageFile(file);
    }
    // Reset the input so the same file can be re-selected
    input.value = "";
  }

  /** @internal */
  protected onClearClick(): void {
    this.clear();
  }

  /** @internal */
  protected onReplayClick(): void {
    this.replay();
  }

  /** @internal */
  protected onBrowseClick(): void {
    this.browse();
  }

  // ── Private helpers ───────────────────────────────────────────────

  private _context(): CanvasRenderingContext2D | null {
    return this.canvasRef().nativeElement.getContext("2d");
  }

  private _syncCanvasSize(): void {
    const canvas = this.canvasRef().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const pr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * pr);
    canvas.height = Math.round(rect.height * pr);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(pr, pr);
    }
  }

  private _clearCanvas(): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / pr, canvas.height / pr);
  }

  private _canvasPoint(event: PointerEvent): StrokePoint {
    const canvas = this.canvasRef().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const pressure =
      this.pressureEnabled() && event.pressure > 0 ? event.pressure : undefined;
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      time: Date.now(),
      pressure,
    };
  }

  private _widthForPressure(pressure: number | undefined): number {
    if (!this.pressureEnabled() || pressure === undefined) {
      return this.maxStrokeWidth();
    }
    const min = this.minStrokeWidth();
    const max = this.maxStrokeWidth();
    return min + pressure * (max - min);
  }

  private _drawSegment(from: StrokePoint, to: StrokePoint): void {
    const ctx = this._context();
    if (!ctx) return;

    const width = this._widthForPressure(
      from.pressure !== undefined && to.pressure !== undefined
        ? (from.pressure + to.pressure) / 2
        : (from.pressure ?? to.pressure),
    );

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = width;
    ctx.strokeStyle = this.strokeColor();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  private _renderValue(v: SignatureValue): void {
    this._clearCanvas();
    if (!v) return;

    if (v.kind === "strokes") {
      this._drawStrokes(v.strokes);
    } else {
      this._drawImage(v.image.dataUrl);
    }
  }

  private _drawStrokes(strokes: StrokeGroup[]): void {
    const canvas = this.canvasRef().nativeElement;
    const bounds = this._currentStrokeBounds();
    const scaleX = bounds
      ? canvas.getBoundingClientRect().width / bounds.width
      : 1;
    const scaleY = bounds
      ? canvas.getBoundingClientRect().height / bounds.height
      : 1;

    for (const group of strokes) {
      this._drawStrokeGroup(group, scaleX, scaleY);
    }
  }

  private _currentStrokeBounds():
    | { width: number; height: number }
    | undefined {
    const v = this.value();
    return v?.kind === "strokes" ? v.bounds : undefined;
  }

  private _drawStrokeGroup(group: StrokeGroup, scaleX = 1, scaleY = 1): void {
    const ctx = this._context();
    if (!ctx || group.points.length === 0) return;

    const pts = group.points;

    if (pts.length === 1) {
      const p = pts[0];
      const r = this._widthForPressure(p.pressure) / 2;
      ctx.beginPath();
      ctx.arc(p.x * scaleX, p.y * scaleY, r, 0, Math.PI * 2);
      ctx.fillStyle = this.strokeColor();
      ctx.fill();
      return;
    }

    for (let i = 1; i < pts.length; i++) {
      const from = pts[i - 1];
      const to = pts[i];
      const scaledFrom = { ...from, x: from.x * scaleX, y: from.y * scaleY };
      const scaledTo = { ...to, x: to.x * scaleX, y: to.y * scaleY };
      this._drawSegment(scaledFrom, scaledTo);
    }
  }

  private _drawImage(dataUrl: string): void {
    const ctx = this._context();
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const canvas = this.canvasRef().nativeElement;
      const pr = window.devicePixelRatio || 1;
      const w = canvas.width / pr;
      const h = canvas.height / pr;
      // Fit image into canvas maintaining aspect ratio
      const scale = Math.min(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    };
    img.onerror = () => {
      this.log.error("Failed to render signature image");
    };
    img.src = dataUrl;
  }

  private _finaliseStroke(points: StrokePoint[]): void {
    if (points.length === 0) return;

    const canvas = this.canvasRef().nativeElement;
    const rect = canvas.getBoundingClientRect();
    const newGroup: StrokeGroup = { points };

    const prev = this.value();
    let strokes: StrokeGroup[];

    if (prev && prev.kind === "strokes") {
      strokes = [...prev.strokes, newGroup];
    } else {
      strokes = [newGroup];
    }

    const next: SignatureStrokeValue = {
      kind: "strokes",
      strokes,
      bounds: { width: rect.width, height: rect.height },
    };

    this.value.set(next);
    this._emitChange(next);
  }

  private _loadImageFile(file: File): void {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      this.log.warn("Rejected unsupported image type", [file.type]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const next: SignatureImageValue = {
          kind: "image",
          image: {
            mimeType: file.type,
            dataUrl,
            width: img.naturalWidth,
            height: img.naturalHeight,
          },
        };
        this.value.set(next);
        this._renderValue(next);
        this._emitChange(next);
        this._markTouched();
      };
      img.onerror = () => {
        this.log.error("Failed to load image file", [file.name]);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  private _replayStrokes(v: SignatureStrokeValue): void {
    const allPoints = v.strokes.flatMap((g) => g.points);

    if (allPoints.length === 0) {
      this.isReplaying.set(false);
      return;
    }

    const startTime = allPoints[0].time;
    const lastTime = allPoints[allPoints.length - 1].time;
    const replayStart = Date.now();

    const step = (): void => {
      // Clear and draw in one frame — prevents a blank frame between steps.
      this._clearCanvas();

      const elapsed = Date.now() - replayStart;
      const replayUntil = startTime + elapsed;

      const canvas = this.canvasRef().nativeElement;
      const rect = canvas.getBoundingClientRect();
      const bounds = v.bounds;
      const scaleX = bounds ? rect.width / bounds.width : 1;
      const scaleY = bounds ? rect.height / bounds.height : 1;

      for (const group of v.strokes) {
        const visiblePts = group.points.filter((p) => p.time <= replayUntil);
        if (visiblePts.length === 0) continue;
        this._drawStrokeGroup({ points: visiblePts }, scaleX, scaleY);
      }

      if (replayUntil < lastTime) {
        this._replayRafId = requestAnimationFrame(step);
      } else {
        this._replayRafId = null;
        this.isReplaying.set(false);
      }
    };

    this._replayRafId = requestAnimationFrame(step);
  }

  private _stopReplay(): void {
    if (this._replayRafId !== null) {
      cancelAnimationFrame(this._replayRafId);
      this._replayRafId = null;
    }
    this.isReplaying.set(false);
  }

  private _buildSvg(v: SignatureStrokeValue): string {
    const canvas = this.canvasRef().nativeElement;
    const pr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.width / pr);
    const h = Math.round(canvas.height / pr);
    const bounds = v.bounds;
    const scaleX = bounds ? w / bounds.width : 1;
    const scaleY = bounds ? h / bounds.height : 1;
    const color = this.strokeColor();

    const paths: string[] = [];
    for (const group of v.strokes) {
      paths.push(...this._svgPathsForGroup(group, scaleX, scaleY, color));
    }

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`,
      ...paths,
      `</svg>`,
    ].join("\n");
  }

  private _svgPathsForGroup(
    group: StrokeGroup,
    scaleX: number,
    scaleY: number,
    color: string,
  ): string[] {
    const pts = group.points;
    if (pts.length === 0) return [];

    if (pts.length === 1) {
      const p = pts[0];
      const r = this._widthForPressure(p.pressure) / 2;
      const cx = (p.x * scaleX).toFixed(2);
      const cy = (p.y * scaleY).toFixed(2);
      return [
        `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(2)}" fill="${color}" />`,
      ];
    }

    if (!this.pressureEnabled()) {
      // Single path for uniform-width stroke
      const d = pts
        .map((p, i) => {
          const x = (p.x * scaleX).toFixed(2);
          const y = (p.y * scaleY).toFixed(2);
          return i === 0 ? `M ${x},${y}` : `L ${x},${y}`;
        })
        .join(" ");
      const w = this.maxStrokeWidth().toFixed(2);
      return [
        `<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`,
      ];
    }

    // Variable-width: one short path per segment
    const result: string[] = [];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const ax = (a.x * scaleX).toFixed(2);
      const ay = (a.y * scaleY).toFixed(2);
      const bx = (b.x * scaleX).toFixed(2);
      const by = (b.y * scaleY).toFixed(2);
      const w = this._widthForPressure(
        a.pressure !== undefined && b.pressure !== undefined
          ? (a.pressure + b.pressure) / 2
          : (a.pressure ?? b.pressure),
      ).toFixed(2);
      result.push(
        `<path d="M ${ax},${ay} L ${bx},${by}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" />`,
      );
    }
    return result;
  }

  private _emitChange(v: SignatureValue): void {
    this.value.set(v);
    this._onChangeFn(v);
  }

  private _markTouched(): void {
    this._onTouchedFn();
  }
}
