import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISignature } from "../../signature.component";

import { PlaygroundStorySource } from "./playground.story";

const meta = {
  title: "@theredhead/UI Kit/Signature",
  component: PlaygroundStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UISignature` is a signature field supporting drawn strokes, optional pressure-sensitive capture, and image-based input (paste / drop / browse). Stroke values are replayable and exportable as SVG or PNG. The component integrates with Angular reactive / template-driven forms via `ControlValueAccessor` and supports two-way signal binding via `[(value)]`.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })]
} satisfies Meta<PlaygroundStorySource>;

export default meta;
type Story = StoryObj<PlaygroundStorySource>;

export const Playground: Story = {
  args: {
    ariaLabel: "Sign here",
    allowDraw: true,
    allowPaste: false,
    allowDrop: false,
    allowBrowse: false,
    pressureEnabled: false,
    minStrokeWidth: 1.5,
    maxStrokeWidth: 3.5,
    strokeColor: "#1d232b",
    disabled: false,
    readOnly: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-signature
        [ariaLabel]="ariaLabel"
        [allowDraw]="allowDraw"
        [allowPaste]="allowPaste"
        [allowDrop]="allowDrop"
        [allowBrowse]="allowBrowse"
        [pressureEnabled]="pressureEnabled"
        [minStrokeWidth]="minStrokeWidth"
        [maxStrokeWidth]="maxStrokeWidth"
        [strokeColor]="strokeColor"
        [disabled]="disabled"
        [readOnly]="readOnly"
      />
    `,
  })
};
