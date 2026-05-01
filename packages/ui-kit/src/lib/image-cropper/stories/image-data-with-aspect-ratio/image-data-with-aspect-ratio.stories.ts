import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type { ImageExportFormat } from "../../image-cropper.types";

import {
  CropperImageDataDemo,
  DEFAULT_IMAGE_DATA_DEMO_ARGS,
} from "./image-data-with-aspect-ratio.story";

const meta = {
  title: "@theredhead/UI Kit/Image Cropper",
  component: CropperImageDataDemo,
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
  decorators: [moduleMetadata({ imports: [CropperImageDataDemo] })],
} satisfies Meta<CropperImageDataDemo>;

export default meta;
type Story = StoryObj<CropperImageDataDemo>;

export const ImageDataWithAspectRatio: Story = {
  args: {
    ...DEFAULT_IMAGE_DATA_DEMO_ARGS,
    aspectRatio: 1,
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: {
      ...DEFAULT_IMAGE_DATA_DEMO_ARGS,
      ...args,
    },
    template:
      '<ui-cropper-imagedata-demo [aspectRatio]="aspectRatio" [outputFormat]="outputFormat" [outputQuality]="outputQuality" [disabled]="disabled" [ariaLabel]="ariaLabel" />',
  }),
};
