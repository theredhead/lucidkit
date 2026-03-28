import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { type AvatarSizeName, UIAvatar } from "./avatar.component";
import { UIInput } from "../input/input.component";

@Component({
  selector: "ui-avatar-demo",
  standalone: true,
  imports: [UIAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Sizes</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar name="Jane Doe" size="extra-small" />
          <ui-avatar name="Jane Doe" size="small" />
          <ui-avatar name="Jane Doe" size="medium" />
          <ui-avatar name="Jane Doe" size="large" />
          <ui-avatar name="Jane Doe" size="extra-large" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">With images</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar
            src="https://picsum.photos/seed/av1/100/100"
            name="Alice"
            size="medium"
          />
          <ui-avatar
            src="https://picsum.photos/seed/av2/100/100"
            name="Bob"
            size="medium"
          />
          <ui-avatar
            src="https://picsum.photos/seed/av3/100/100"
            name="Charlie"
            size="large"
          />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Initials (no image)</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar name="Kris van Rens" size="medium" />
          <ui-avatar name="Emily" size="medium" />
          <ui-avatar name="Maximilian Von Habsburg" size="large" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Fallback (no name, no image)</h4>
        <ui-avatar size="large" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Gravatar (email-based)</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar email="copilot@github.com" name="Copilot" size="medium" />
          <ui-avatar email="copilot@github.com" name="Copilot" size="large" />
          <ui-avatar
            email="noexist@theredhead.nl"
            name="Fallback Test"
            size="large"
          />
        </div>
        <p
          style="margin: 8px 0 0; font-size: 0.75rem; opacity: 0.55; line-height: 1.4;"
        >
          The last avatar uses a non-existent Gravatar — it falls back to
          initials.
        </p>
      </div>
    </div>
  `,
})
class AvatarDemo {}

@Component({
  selector: "ui-avatar-gravatar-demo",
  standalone: true,
  imports: [UIAvatar, UIInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 320px;"
    >
      <ui-input
        placeholder="Enter email address"
        ariaLabel="Email address"
        [(value)]="email"
      />
      <div style="display: flex; align-items: center; gap: 12px;">
        <ui-avatar [email]="email()" name="User" size="small" />
        <ui-avatar [email]="email()" name="User" size="medium" />
        <ui-avatar [email]="email()" name="User" size="large" />
        <ui-avatar [email]="email()" name="User" size="extra-large" />
      </div>
      <p
        style="margin: 0; font-size: 0.75rem; opacity: 0.55; line-height: 1.4;"
      >
        Type a Gravatar-registered email to see the avatar update live.
        Non-existent emails fall back to initials.
      </p>
    </div>
  `,
})
class GravatarDemo {
  protected readonly email = signal("");
}

const meta: Meta<UIAvatar> = {
  title: "@Theredhead/UI Kit/Avatar",
  component: UIAvatar,
  tags: ["autodocs"],
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
  parameters: {
    docs: {
      description: {
        component:
          "Displays a user avatar with automatic resolution fallback: " +
          "`src` image → Gravatar (email) → initials → generic placeholder.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [AvatarDemo, GravatarDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIAvatar>;

/**
 * Interactive playground — adjust every input via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-avatar
      [src]="src"
      [email]="email"
      [name]="name"
      [size]="size"
      [ariaLabel]="ariaLabel"
    />`,
  }),
  args: {
    src: "",
    email: "",
    name: "Jane Doe",
    size: "medium",
    ariaLabel: "User avatar",
  },
};

/**
 * Comprehensive overview of all avatar capabilities: size variants
 * (xs through xl), image avatars from URLs, initial-based fallbacks,
 * the generic placeholder (no name or image), and Gravatar integration
 * via email.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-avatar-demo />`,
  }),
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
          "| `size` | `AvatarSize` | `'medium'` | Named size preset or pixel number |",
      },
      source: {
        code: `<!-- With image -->
<ui-avatar src="https://example.com/photo.jpg" name="Alice" size="medium" />

<!-- Gravatar (email-based, SHA-256 hashed) -->
<ui-avatar email="jane@example.com" name="Jane Doe" size="large" />

<!-- Initials fallback (no image) -->
<ui-avatar name="Kris van Rens" size="medium" />

<!-- Named size variants -->
<ui-avatar name="Jane Doe" size="extra-small" />
<ui-avatar name="Jane Doe" size="small" />
<ui-avatar name="Jane Doe" size="large" />
<ui-avatar name="Jane Doe" size="extra-large" />

<!-- Custom pixel size -->
<ui-avatar name="Jane Doe" [size]="48" />`,
        language: "html",
      },
    },
  },
};

/**
 * Live Gravatar demo — type any email address in the input field
 * to see the avatar update in real time across all four sizes.
 * Non-existent Gravatars automatically fall back to initials.
 */
export const Gravatar: Story = {
  render: () => ({
    template: `<ui-avatar-gravatar-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-avatar email="jane@example.com" name="Jane Doe" size="large" />

<!-- Resolution order: src > email (Gravatar) > initials > fallback -->
<ui-avatar
  src="explicit.jpg"
  email="jane@example.com"
  name="Jane Doe"
/>`,
        language: "html",
      },
    },
  },
};
