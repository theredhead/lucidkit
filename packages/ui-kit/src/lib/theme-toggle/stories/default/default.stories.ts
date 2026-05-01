import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Theme Toggle",
  component: DefaultStorySource,
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: {
    variant: "icon",
    disabled: false,
    ariaLabel: "Toggle theme",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-default-story-demo
      [variant]="variant"
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
