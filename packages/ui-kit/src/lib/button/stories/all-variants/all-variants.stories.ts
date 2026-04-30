import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  UIButton,
} from "../../button.component";

import { AllVariantsStorySource } from "./all-variants.story";

interface ButtonStoryArgs {
  color: ButtonColor;
  disabled: boolean;
  pill: boolean;
  size: ButtonSize;
  variant: ButtonVariant;
}

const meta = {
  title: "@theredhead/UI Kit/Button",
  component: AllVariantsStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A general-purpose button component with three visual variants and three sizes.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined", "ghost"] satisfies ButtonVariant[],
      description:
        "Visual style of the button. `filled` for primary actions, `outlined` for " +
        "secondary actions, and `ghost` for tertiary or inline actions.",
    },
    color: {
      control: "select",
      options: [
        "neutral",
        "primary",
        "secondary",
        "safe",
        "danger",
      ] satisfies ButtonColor[],
      description:
        "Colour preset that maps to theme tokens. `primary` (accent), " +
        "`secondary`, `safe` (success), `danger` (error), or `neutral` (text colour).",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"] satisfies ButtonSize[],
      description:
        "Size preset that controls padding, font-size, and min-height. " +
        "Defaults to `medium`.",
    },
    disabled: {
      control: "boolean",
      description:
        "Disables the button, preventing user interaction and applying " +
        "a muted visual style.",
    },
    pill: {
      control: "boolean",
      description:
        "Render with fully rounded (pill / capsule) shape. " +
        "Combines with any variant and colour.",
    },
  },
  decorators: [moduleMetadata({ imports: [AllVariantsStorySource] })],
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const AllVariants: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {},
  },
  render: () => ({
    template: "<ui-all-variants-story-demo />",
  }),
};
