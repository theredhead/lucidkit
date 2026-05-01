import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISignature } from "../../signature.component";

import { PressureSensitiveStorySource } from "./pressure-sensitive.story";

const meta = {
  title: "@theredhead/UI Kit/Signature",
  component: PressureSensitiveStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UISignature` is a signature field supporting drawn strokes, optional pressure-sensitive capture, and image-based input (paste / drop / browse). Stroke values are replayable and exportable as SVG or PNG. The component integrates with Angular reactive / template-driven forms via `ControlValueAccessor` and supports two-way signal binding via `[(value)]`.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [PressureSensitiveStorySource] })]
} satisfies Meta<PressureSensitiveStorySource>;

export default meta;
type Story = StoryObj<PressureSensitiveStorySource>;

export const PressureSensitive: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-pressure-sensitive-story-demo />",
    })
};
