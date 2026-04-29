import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ToggleSize, UIToggle } from "../../toggle.component";

import { DemoToggleDefault } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Toggle",
  component: UIToggle,
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
  },
  decorators: [moduleMetadata({ imports: [DemoToggleDefault] })]
} satisfies Meta<UIToggle>;

export default meta;
type Story = StoryObj<UIToggle>;

export const Default: Story = {
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
        "| `valueChange` | `boolean` | Emitted when the value changes |"
      }
    }
  },
  render: () => ({
      template: "<ui-demo-toggle-default />",
    })
};
