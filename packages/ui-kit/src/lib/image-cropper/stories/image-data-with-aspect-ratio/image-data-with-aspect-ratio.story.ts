import { AfterViewInit, ChangeDetectionStrategy, Component, input, signal, viewChild } from "@angular/core";
import { UIImageCropper } from "../../image-cropper.component";
import { UIButton } from "../../../button/button.component";
import type { CropRegion } from "../../image-cropper.types";

// ── Sample ImageData generator ──────────────────────────────────

function createSampleImageData(width = 800, height = 600): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#f7971e");
  grad.addColorStop(1, "#ffd200");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#000000";
  for (const [cx, cy, r] of [
    [width * 0.3, height * 0.4, 100],
    [width * 0.65, height * 0.55, 140],
  ] as [number, number, number][]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#333333";
  ctx.font = "bold 40px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ImageData Source", width / 2, height / 2 + 14);

  return ctx.getImageData(0, 0, width, height);
}

// ── Programmatic ImageData demo wrapper ─────────────────────────

@Component({
  selector: "ui-cropper-imagedata-demo",
  standalone: true,
  imports: [UIImageCropper, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./image-data-with-aspect-ratio.story.html",
})
export class CropperImageDataDemo implements AfterViewInit {
  public readonly aspectRatio = input<number | null>(null);

  protected readonly regionInfo = signal("");
  protected readonly croppedInfo = signal("");

  private readonly cropper = viewChild.required<UIImageCropper>("cropper");

  public ngAfterViewInit(): void {
    this.cropper().loadImageData(createSampleImageData());
  }

  protected onRegionChange(region: CropRegion): void {
    this.regionInfo.set(
      `${region.width}\u00D7${region.height} at (${region.x}, ${region.y})`,
    );
  }

  protected onCropToImageData(): void {
    const data = this.cropper().cropToImageData();
    this.croppedInfo.set(
      `Cropped ImageData: ${data.width}\u00D7${data.height} (${data.data.length} bytes)`,
    );
  }

  protected onReset(): void {
    this.cropper().reset();
    this.croppedInfo.set("");
  }
}
