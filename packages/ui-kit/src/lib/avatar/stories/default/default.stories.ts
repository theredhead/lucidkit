import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type AvatarSizeName, UIAvatar } from "../../avatar.component";

import { AvatarDemo } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Avatar",
  component: UIAvatar,
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
  decorators: [moduleMetadata({ imports: [AvatarDemo] })]
} satisfies Meta<UIAvatar>;

export default meta;
type Story = StoryObj<UIAvatar>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- **Named sizes** \u2014 `extra-small` (24 px), `small` (32 px), `medium` (40 px), `large` (56 px), `extra-large` (80 px)\n" +
        '- **Pixel sizes** \u2014 pass a number (e.g. `[size]="48"`) for custom dimensions\n' +
        "- **Gravatar integration** — pass an `email` and the component fetches " +
        "the Gravatar image via SHA-256 hash\n" +
        "- **Initials fallback** — extracts up to two initials from `name` when no image is available\n" +
        "- **Colour generation** — initials background colour is deterministically " +
        "derived from the name string\n\n" +
        "### Inputs\n" +
        "| Input | Type | Default | Description |\n" +
        "|-------|------|---------|-------------|\n" +
        "| `src` | `string?` | — | Explicit image URL |\n" +
        "| `email` | `string?` | — | Email for Gravatar lookup |\n" +
        "| `name` | `string` | `''` | User name (used for initials & alt text) |\n" +
        "| `size` | `AvatarSize` | `'medium'` | Named size preset or pixel number |"
      }
    }
  },
  render: () => ({
      template: "<ui-avatar-demo />",
    })
};
