import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIImageCropper } from "../../image-cropper.component";

import { CropperImageDataDemo } from "./programmatic-image-data.story";

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
  decorators: [moduleMetadata({ imports: [CropperImageDataDemo] })]
} satisfies Meta<UIImageCropper>;

export default meta;
type Story = StoryObj<UIImageCropper>;

export const ProgrammaticImageData: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-cropper-imagedata-demo />",
    })
};
