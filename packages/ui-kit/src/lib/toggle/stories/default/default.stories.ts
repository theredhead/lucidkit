import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ToggleSize, UIToggle } from "../../toggle.component";

import { DemoToggleDefault } from "./default.story";

interface ToggleStoryArgs {
  ariaLabel: string;
  disabled: boolean;
  offLabel: string;
  onLabel: string;
  size: ToggleSize;
  value: boolean;
  valueChange: (event: boolean) => void;
}

const meta = {
  title: "@theredhead/UI Kit/Toggle",
  component: DemoToggleDefault,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A toggle switch with customisable on/off labels.",
      },
    },
  },
  argTypes: {
    value: {
      control: "boolean",
      description: "On/off state (two-way bindable via `[(value)]`).",
    },
    onLabel: {
      control: "text",
      description: "Label shown inside the track when the toggle is on.",
    },
    offLabel: {
      control: "text",
      description: "Label shown inside the track when the toggle is off.",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"] satisfies ToggleSize[],
      description: "Size variant.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the toggle.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
    valueChange: {
      action: "valueChange",
      description: "Emitted when the toggle value changes.",
    },
  },
  decorators: [moduleMetadata({ imports: [DemoToggleDefault] })],
} satisfies Meta<ToggleStoryArgs>;

export default meta;
type Story = StoryObj<ToggleStoryArgs>;

export const Default: Story = {
  args: {
    value: false,
    onLabel: "",
    offLabel: "",
    size: "medium",
    disabled: false,
    ariaLabel: "Toggle",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Supports two-way binding via `[(value)]`, three sizes (`small`, `medium`, `large`), " +
          "and optional text labels inside the track.\n\n" +
          "### Inputs\n" +
          "| Input | Type | Default | Description |\n" +
          "|-------|------|---------|-------------|\n" +
          "| `value` | `boolean` | `false` | On/off state (two-way) |\n" +
          "| `onLabel` | `string` | `''` | Label shown when on |\n" +
          "| `offLabel` | `string` | `''` | Label shown when off |\n" +
          "| `size` | `'small' \\| 'medium' \\| 'large'` | `'medium'` | Size variant |\n" +
          "| `disabled` | `boolean` | `false` | Disables interaction |\n" +
          "| `ariaLabel` | `string` | `''` | Accessible label |\n\n" +
          "### Outputs\n" +
          "| Output | Type | Description |\n" +
          "|--------|------|-------------|\n" +
          "| `valueChange` | `boolean` | Emitted when the value changes |",
      },
    },
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-demo-toggle-default [value]="value" [onLabel]="onLabel" [offLabel]="offLabel" [size]="size" [disabled]="disabled" [ariaLabel]="ariaLabel" (valueChange)="valueChange($event)" />',
  }),
};
