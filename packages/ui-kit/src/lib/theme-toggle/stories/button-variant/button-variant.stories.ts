import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIThemeToggle } from "../../theme-toggle.component";

import { ButtonVariantStorySource } from "./button-variant.story";

const meta = {
  title: "@theredhead/UI Kit/Theme Toggle",
  component: UIThemeToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A button that cycles between light, dark, and system theme modes.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["icon", "button"],
      description:
        "Visual style: `icon` for a compact icon-only button, `button` " +
        "for a wider button with a text label alongside the icon.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the toggle button.",
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible label forwarded to the native button element. " +
        'Defaults to `"Toggle theme"`.',
    },
  },
  decorators: [moduleMetadata({ imports: [ButtonVariantStorySource] })]
} satisfies Meta<UIThemeToggle>;

export default meta;
type Story = StoryObj<UIThemeToggle>;

export const ButtonVariant: Story = {
  args: {
    variant: "button",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-button-variant-story-demo />",
    })
};
