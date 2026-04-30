import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISignature } from "../../signature.component";

import { AllModesStorySource } from "./all-modes.story";

const meta = {
  title: "@theredhead/UI Kit/Signature",
  component: UISignature,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UISignature` is a signature field supporting drawn strokes, optional pressure-sensitive capture, and image-based input (paste / drop / browse). Stroke values are replayable and exportable as SVG or PNG. The component integrates with Angular reactive / template-driven forms via `ControlValueAccessor` and supports two-way signal binding via `[(value)]`.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [AllModesStorySource] })]
} satisfies Meta<UISignature>;

export default meta;
type Story = StoryObj<UISignature>;

export const AllModes: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-all-modes-story-demo />",
    })
};
