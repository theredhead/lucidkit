import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ProgressMode, type ProgressVariant } from "../../progress.types";
import { UIProgress } from "../../progress.component";

import { ProgressDemo } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Progress",
  component: UIProgress,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A progress indicator available in two shapes and two modes.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["linear", "circular"] satisfies ProgressVariant[],
      description: "Shape of the progress indicator.",
    },
    mode: {
      control: "select",
      options: ["determinate", "indeterminate"] satisfies ProgressMode[],
      description:
        "Determinate shows a value; indeterminate animates continuously.",
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress value (0–100). Only used in determinate mode.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [ProgressDemo] })]
} satisfies Meta<UIProgress>;

export default meta;
type Story = StoryObj<UIProgress>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Variants\n" +
        "| Variant | Shape | Use case |\n" +
        "|---------|-------|----------|\n" +
        "| `linear` | Horizontal bar | Page loads, file uploads |\n" +
        "| `circular` | Spinning ring | Inline loading spinners |\n\n" +
        "### Modes\n" +
        "- **Determinate** — shows a `value` (0–100) as a filled portion\n" +
        "- **Indeterminate** — animates continuously when the total is unknown\n\n" +
        "### Inputs\n" +
        "| Input | Type | Default |\n" +
        "|-------|------|---------|\n" +
        "| `variant` | `'linear' \\| 'circular'` | `'linear'` |\n" +
        "| `mode` | `'determinate' \\| 'indeterminate'` | `'determinate'` |\n" +
        "| `value` | `number` | `0` |\n" +
        "| `ariaLabel` | `string` | `'Progress'` |"
      }
    }
  },
  render: () => ({
      template: "<ui-progress-demo />",
    })
};
