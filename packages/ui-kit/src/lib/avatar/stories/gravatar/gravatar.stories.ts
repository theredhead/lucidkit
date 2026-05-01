import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type AvatarSizeName, UIAvatar } from "../../avatar.component";

import { GravatarDemo } from "./gravatar.story";

const meta = {
  title: "@theredhead/UI Kit/Avatar",
  component: GravatarDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays a user avatar with automatic resolution fallback: " +
          "`src` image → Gravatar (email) → initials → generic placeholder.",
      },
    },
  },
  argTypes: {
    src: {
      control: "text",
      description:
        "Explicit image URL. Takes priority over Gravatar and initials.",
    },
    email: {
      control: "text",
      description: "Email for Gravatar lookup (SHA-256 hashed).",
    },
    name: {
      control: "text",
      description: "User name — used for initials fallback and alt text.",
    },
    size: {
      control: "select",
      options: [
        "extra-small",
        "small",
        "medium",
        "large",
        "extra-large",
      ] satisfies AvatarSizeName[],
      description: "Named size preset or a pixel number.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [GravatarDemo] })]
} satisfies Meta<GravatarDemo>;

export default meta;
type Story = StoryObj<GravatarDemo>;

export const Gravatar: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-avatar-gravatar-demo />",
    })
};
