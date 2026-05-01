import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type AvatarSizeName } from "../../avatar.component";

import { PlaygroundStorySource } from "./playground.story";

interface AvatarPlaygroundStoryArgs {
  src: string;
  email: string;
  name: string;
  size: AvatarSizeName;
  ariaLabel: string;
}

const meta = {
  title: "@theredhead/UI Kit/Avatar",
  component: PlaygroundStorySource,
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
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })],
} satisfies Meta<AvatarPlaygroundStoryArgs>;

export default meta;
type Story = StoryObj<AvatarPlaygroundStoryArgs>;

export const Playground: Story = {
  args: {
    src: "",
    email: "",
    name: "Jane Doe",
    size: "medium",
    ariaLabel: "User avatar",
  },
  render: (args) => ({
    props: args,
    template: `<ui-playground-story-demo
      [src]="src"
      [email]="email"
      [name]="name"
      [size]="size"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
