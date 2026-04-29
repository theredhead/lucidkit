import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { UIImageCropper } from "../../image-cropper.component";
import { UIButton } from "../../../button/button.component";
import type { CropRegion, ImageExportFormat } from "../../image-cropper.types";

// ── Sample image generator ──────────────────────────────────────

function createSampleImage(width = 800, height = 600): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#667eea");
  grad.addColorStop(1, "#764ba2");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative circles
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#ffffff";
  for (const [cx, cy, r] of [
    [width * 0.25, height * 0.35, 120],
    [width * 0.7, height * 0.65, 160],
    [width * 0.5, height * 0.15, 80],
  ] as [number, number, number][]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Label text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Sample Image", width / 2, height / 2 + 16);

  return canvas.toDataURL("image/png");
}

// ── Demo wrapper component ──────────────────────────────────────

@Component({
  selector: "ui-cropper-demo",
  standalone: true,
  imports: [UIImageCropper, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./free-crop.story.html",
})
export class CropperDemo {
  public readonly src = input(createSampleImage());
  public readonly aspectRatio = input<number | null>(null);
  public readonly outputFormat = input<ImageExportFormat>("image/png");

  protected readonly regionInfo = signal("");
  protected readonly previewUrl = signal("");

  private readonly cropper = viewChild<UIImageCropper>("cropper");

  protected onRegionChange(region: CropRegion): void {
    this.regionInfo.set(
      `${region.width}\u00D7${region.height} at (${region.x}, ${region.y})`,
    );
  }

  protected async onCrop(): Promise<void> {
    const c = this.cropper();
    if (!c) return;
    const blob = await c.crop();
    this.previewUrl.set(URL.createObjectURL(blob));
  }

  protected onReset(): void {
    this.cropper()?.reset();
    this.previewUrl.set("");
  }
}
