import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type ButtonColor, type ButtonSize, type ButtonVariant, UIButton } from "../../button.component";

import { GalleryStorySource } from "./gallery.story";

const meta = {
  title: "@theredhead/UI Kit/Button",
  component: UIButton,
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
  decorators: [moduleMetadata({ imports: [GalleryStorySource] })]
} satisfies Meta<UIButton>;

export default meta;
type Story = StoryObj<UIButton>;

export const Gallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- **Variants** — `filled` (primary CTA), `outlined` (secondary), `ghost` (tertiary / inline)\n" +
        "- **Colors** — `primary` (accent), `secondary`, `safe` (success), `danger`, `neutral`\n" +
        "- **Sizes** — `small`, `medium` (default), `large`\n" +
        "- **Pill** — fully rounded capsule shape, combinable with any variant and colour\n" +
        "- **Accessible** — forwards `ariaLabel`, renders a native `<button>` element\n" +
        "- **Button type** — defaults to `button`, can be set to `submit` or `reset` for forms"
      }
    }
  },
  render: () => ({
      template: "<ui-gallery-story-demo />",
    })
};
