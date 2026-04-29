import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIImageCropper } from "../../image-cropper.component";

import { CropperDemo } from "./free-crop.story";

const meta = {
  title: "@theredhead/UI Kit/Image Cropper",
  component: UIImageCropper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Canvas-based image cropper supporting free-form and " +
          "fixed-aspect-ratio cropping with drag handles, rule-of-thirds " +
          "overlay, and PNG / JPEG export.",
      },
    },
  },
  argTypes: {
    outputFormat: {
      control: "select",
      options: ["image/png", "image/jpeg", "image/webp"],
      description: "Export image MIME type.",
    },
    outputQuality: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "JPEG/WebP quality (0–1).",
    },
    disabled: {
      control: "boolean",
      description: "Disables the cropper.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the cropper.",
    },
  },
  decorators: [moduleMetadata({ imports: [CropperDemo] })]
} satisfies Meta<UIImageCropper>;

export default meta;
type Story = StoryObj<UIImageCropper>;

export const FreeCrop: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Key Features\n\n" +
        "- **Free-form & fixed aspect ratio** — lock to 1:1, 16:9, 3:4, or any custom ratio\n" +
        "- **Drag handles** — resize from corners or edges; move the entire region\n" +
        "- **Rule-of-thirds overlay** — composition grid drawn inside the crop area\n" +
        "- **PNG / JPEG export** — `crop()` returns a `Blob`; `cropToImageData()` returns raw `ImageData`\n" +
        "- **URL or programmatic source** — bind a URL via `[src]`, or call `loadImageData()` with raw pixels\n" +
        "- **Responsive** — canvas resizes with its container via `ResizeObserver`\n" +
        '- **Accessible** — `role="img"` with configurable `ariaLabel`\n\n' +
        "### Inputs\n\n" +
        "| Input | Type | Default | Description |\n" +
        "|-------|------|---------|-------------|\n" +
        "| `src` | `string \\| null` | `null` | Image URL, data URL, or object URL |\n" +
        "| `aspectRatio` | `number \\| null` | `null` | Locked width÷height ratio (`null` = free-form) |\n" +
        "| `outputFormat` | `ImageExportFormat` | `'image/png'` | Export format for `crop()` |\n" +
        "| `outputQuality` | `number` | `0.92` | JPEG quality (0–1, ignored for PNG) |\n" +
        "| `ariaLabel` | `string` | `'Image cropper'` | Accessible label for the canvas |\n\n" +
        "### Outputs\n\n" +
        "| Output | Type | Description |\n" +
        "|--------|------|-------------|\n" +
        "| `imageLoaded` | `{ width: number; height: number }` | Emits after a source image finishes loading |\n" +
        "| `regionChange` | `CropRegion` | Emits the crop region (image coords) after every change |\n\n" +
        "### Public Methods\n\n" +
        "| Method | Returns | Description |\n" +
        "|--------|---------|-------------|\n" +
        "| `crop()` | `Promise<Blob>` | Export the current crop as a Blob |\n" +
        "| `cropToImageData()` | `ImageData` | Export the current crop as raw pixel data |\n" +
        "| `reset()` | `void` | Reset crop to cover the entire image |\n" +
        "| `loadImageData(data)` | `void` | Load raw `ImageData` as the cropper source |\n\n" +
        "### Types\n\n" +
        "| Type | Description |\n" +
        "|------|-------------|\n" +
        "| `CropRegion` | `{ x, y, width, height }` in image pixel coordinates |\n" +
        "| `ImageExportFormat` | `'image/png' \\| 'image/jpeg'` |"
      }
    }
  },
  render: () => ({
      template: "<ui-cropper-demo />",
    })
};
