import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { ImageExportFormat } from "../../image-cropper.types";

import { CropperDemo, DEFAULT_CROPPER_DEMO_ARGS } from "./widescreen.story";

const meta = {
  title: "@theredhead/UI Kit/Image Cropper",
  component: CropperDemo,
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
    src: {
      control: "text",
      description: "Image URL, data URL, or object URL.",
    },
    aspectRatio: {
      control: "number",
      description: "Locked width-to-height ratio. Use no value for free crop.",
    },
    outputFormat: {
      control: "select",
      options: ["image/png", "image/jpeg"] satisfies ImageExportFormat[],
      description: "Export image MIME type.",
    },
    outputQuality: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "JPEG quality (0–1).",
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
  decorators: [moduleMetadata({ imports: [CropperDemo] })],
} satisfies Meta<CropperDemo>;

export default meta;
type Story = StoryObj<CropperDemo>;

export const Widescreen: Story = {
  args: {
    ...DEFAULT_CROPPER_DEMO_ARGS,
    aspectRatio: 16 / 9,
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: {
      ...DEFAULT_CROPPER_DEMO_ARGS,
      ...args,
    },
    template:
      '<ui-cropper-demo [src]="src" [aspectRatio]="aspectRatio" [outputFormat]="outputFormat" [outputQuality]="outputQuality" [disabled]="disabled" [ariaLabel]="ariaLabel" />',
  }),
};
