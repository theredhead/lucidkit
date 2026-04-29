import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ProgressMode, type ProgressVariant } from "../../progress.types";
import { UIProgress } from "../../progress.component";

import { PlaygroundStorySource } from "./playground.story";

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
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })]
} satisfies Meta<UIProgress>;

export default meta;
type Story = StoryObj<UIProgress>;

export const Playground: Story = {
  args: {
    variant: "linear",
    mode: "determinate",
    value: 65,
    ariaLabel: "Progress",
  },
  render: () => ({
      template: "<ui-playground-story-demo />",
    })
};
