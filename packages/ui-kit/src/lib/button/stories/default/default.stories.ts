import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "../../button.component";

import { DefaultStorySource } from "./default.story";

interface ButtonStoryArgs {
  ariaLabel: string | undefined;
  color: ButtonColor;
  disabled: boolean;
  pill: boolean;
  size: ButtonSize;
  type: "button" | "submit" | "reset";
  variant: ButtonVariant;
}

const meta = {
  title: "@theredhead/UI Kit/Button",
  component: DefaultStorySource,
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
    type: {
      control: "select",
      options: ["button", "submit", "reset"] satisfies (
        | "button"
        | "submit"
        | "reset"
      )[],
      description:
        "Native button `type` attribute. Use `submit` or `reset` inside a `<form>`. " +
        "Defaults to `button`.",
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
    ariaLabel: {
      control: "text",
      description:
        "Accessible label forwarded to the native `<button>` as `aria-label`. " +
        "Use for icon-only buttons that have no visible text.",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Default: Story = {
  args: {
    ariaLabel: undefined,
    color: "primary",
    disabled: false,
    pill: false,
    size: "medium",
    type: "button",
    variant: "filled",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-default-story-demo [ariaLabel]="ariaLabel" [variant]="variant" [color]="color" [size]="size" [type]="type" [pill]="pill" [disabled]="disabled" />',
  }),
};
