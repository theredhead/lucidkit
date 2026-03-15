import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIAvatar } from "./avatar.component";
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
          <ui-avatar name="Jane Doe" size="xs" />
          <ui-avatar name="Jane Doe" size="sm" />
          <ui-avatar name="Jane Doe" size="md" />
          <ui-avatar name="Jane Doe" size="lg" />
          <ui-avatar name="Jane Doe" size="xl" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">With images</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar
            src="https://picsum.photos/seed/av1/100/100"
            name="Alice"
            size="md"
          />
          <ui-avatar
            src="https://picsum.photos/seed/av2/100/100"
            name="Bob"
            size="md"
          />
          <ui-avatar
            src="https://picsum.photos/seed/av3/100/100"
            name="Charlie"
            size="lg"
          />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Initials (no image)</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar name="Kris van Rens" size="md" />
          <ui-avatar name="Emily" size="md" />
          <ui-avatar name="Maximilian Von Habsburg" size="lg" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Fallback (no name, no image)</h4>
        <ui-avatar size="lg" />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Gravatar (email-based)</h4>
        <div style="display: flex; align-items: center; gap: 12px">
          <ui-avatar email="copilot@github.com" name="Copilot" size="md" />
          <ui-avatar email="copilot@github.com" name="Copilot" size="lg" />
          <ui-avatar
            email="noexist@theredhead.nl"
            name="Fallback Test"
            size="lg"
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
        <ui-avatar [email]="email()" name="User" size="sm" />
        <ui-avatar [email]="email()" name="User" size="md" />
        <ui-avatar [email]="email()" name="User" size="lg" />
        <ui-avatar [email]="email()" name="User" size="xl" />
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
  decorators: [
    moduleMetadata({
      imports: [AvatarDemo, GravatarDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIAvatar>;

/** All avatar variants: sizes, images, initials, fallback. */
export const Default: Story = {
  render: () => ({
    template: `<ui-avatar-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<!-- With image -->
<ui-avatar src="https://example.com/photo.jpg" name="Alice" size="md" />

<!-- Gravatar (email-based, SHA-256 hashed) -->
<ui-avatar email="jane@example.com" name="Jane Doe" size="lg" />

<!-- Initials fallback (no image) -->
<ui-avatar name="Kris van Rens" size="md" />

<!-- Size variants: xs, sm, md, lg, xl -->
<ui-avatar name="Jane Doe" size="xs" />
<ui-avatar name="Jane Doe" size="sm" />
<ui-avatar name="Jane Doe" size="lg" />
<ui-avatar name="Jane Doe" size="xl" />`,
        language: "html",
      },
    },
  },
};

/** Interactive Gravatar demo — type an email to see the avatar update. */
export const Gravatar: Story = {
  render: () => ({
    template: `<ui-avatar-gravatar-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-avatar email="jane@example.com" name="Jane Doe" size="lg" />

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
