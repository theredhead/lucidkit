import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  viewChild,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UIImageCropper } from "./image-cropper.component";
import type { CropRegion, ImageExportFormat } from "./image-cropper.types";

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
  imports: [UIImageCropper],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <div style="width: 100%; height: 400px; max-width: 640px">
        <ui-image-cropper
          #cropper
          [src]="src()"
          [aspectRatio]="aspectRatio()"
          [outputFormat]="outputFormat()"
          (regionChange)="onRegionChange($event)"
        />
      </div>

      <div style="display: flex; gap: 0.5rem; align-items: center">
        <button (click)="onCrop()">Export crop</button>
        <button (click)="onReset()">Reset</button>
        @if (regionInfo()) {
          <span style="font-size: 0.8125rem; opacity: 0.65">
            {{ regionInfo() }}
          </span>
        }
      </div>

      @if (previewUrl()) {
        <div>
          <p style="font-size: 0.8125rem; margin: 0 0 0.25rem">
            Exported preview:
          </p>
          <img
            [src]="previewUrl()"
            alt="Cropped preview"
            style="max-width: 300px; border: 1px solid #ccc; border-radius: 4px"
          />
        </div>
      }
    </div>
  `,
})
class CropperDemo {
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
  imports: [UIImageCropper],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 0.75rem">
      <div style="width: 100%; height: 400px; max-width: 640px">
        <ui-image-cropper
          #cropper
          [aspectRatio]="aspectRatio()"
          (regionChange)="onRegionChange($event)"
        />
      </div>

      <div style="display: flex; gap: 0.5rem; align-items: center">
        <button (click)="onCropToImageData()">Export as ImageData</button>
        <button (click)="onReset()">Reset</button>
        @if (regionInfo()) {
          <span style="font-size: 0.8125rem; opacity: 0.65">
            {{ regionInfo() }}
          </span>
        }
      </div>

      @if (croppedInfo()) {
        <p style="font-size: 0.8125rem">{{ croppedInfo() }}</p>
      }
    </div>
  `,
})
class CropperImageDataDemo implements AfterViewInit {
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

// ── Storybook meta ──────────────────────────────────────────────

const meta: Meta<UIImageCropper> = {
  title: "@theredhead/UI Kit/Image Cropper",
  component: UIImageCropper,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [CropperDemo, CropperImageDataDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIImageCropper>;

// ── Stories ─────────────────────────────────────────────────────

export const FreeCrop: Story = {
  render: () => ({
    template: `<ui-cropper-demo />`,
  }),
};

export const Square: Story = {
  render: () => ({
    template: `<ui-cropper-demo [aspectRatio]="1" />`,
  }),
};

export const Widescreen: Story = {
  render: () => ({
    props: { ratio: 16 / 9 },
    template: `<ui-cropper-demo [aspectRatio]="ratio" />`,
  }),
};

export const Portrait: Story = {
  render: () => ({
    props: { ratio: 3 / 4 },
    template: `<ui-cropper-demo [aspectRatio]="ratio" />`,
  }),
};

export const JpegExport: Story = {
  render: () => ({
    template: `<ui-cropper-demo outputFormat="image/jpeg" />`,
  }),
};

export const ProgrammaticImageData: Story = {
  render: () => ({
    template: `<ui-cropper-imagedata-demo />`,
  }),
};

export const ImageDataWithAspectRatio: Story = {
  render: () => ({
    template: `<ui-cropper-imagedata-demo [aspectRatio]="1" />`,
  }),
};
