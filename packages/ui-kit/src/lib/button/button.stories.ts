import { ChangeDetectionStrategy, Component } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
  UIButton,
} from "./button.component";

// ── Gallery demo ─────────────────────────────────────────────────────

@Component({
  selector: "ui-button-gallery-demo",
  standalone: true,
  imports: [UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Variants</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-button variant="filled">Filled</ui-button>
          <ui-button variant="outlined">Outlined</ui-button>
          <ui-button variant="ghost">Ghost</ui-button>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Colors (filled)</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-button color="primary">Primary</ui-button>
          <ui-button color="secondary">Secondary</ui-button>
          <ui-button color="safe">Safe</ui-button>
          <ui-button color="danger">Danger</ui-button>
          <ui-button color="neutral">Neutral</ui-button>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Colors (outlined)</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-button variant="outlined" color="primary">Primary</ui-button>
          <ui-button variant="outlined" color="secondary">Secondary</ui-button>
          <ui-button variant="outlined" color="safe">Safe</ui-button>
          <ui-button variant="outlined" color="danger">Danger</ui-button>
          <ui-button variant="outlined" color="neutral">Neutral</ui-button>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Colors (ghost)</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-button variant="ghost" color="primary">Primary</ui-button>
          <ui-button variant="ghost" color="secondary">Secondary</ui-button>
          <ui-button variant="ghost" color="safe">Safe</ui-button>
          <ui-button variant="ghost" color="danger">Danger</ui-button>
          <ui-button variant="ghost" color="neutral">Neutral</ui-button>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Sizes</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-button size="small">Small</ui-button>
          <ui-button size="medium">Medium</ui-button>
          <ui-button size="large">Large</ui-button>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Pill</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-button [pill]="true" color="primary">Primary</ui-button>
          <ui-button [pill]="true" variant="outlined" color="danger"
            >Danger</ui-button
          >
          <ui-button [pill]="true" variant="ghost" color="secondary"
            >Secondary</ui-button
          >
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Disabled</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-button variant="filled" [disabled]="true">Filled</ui-button>
          <ui-button variant="outlined" [disabled]="true">Outlined</ui-button>
          <ui-button variant="ghost" [disabled]="true">Ghost</ui-button>
        </div>
      </div>
    </div>
  `,
})
class ButtonGalleryDemo {}

const meta: Meta<UIButton> = {
  title: "@Theredhead/UI Kit/Button",
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
  decorators: [
    moduleMetadata({
      imports: [ButtonGalleryDemo],
    }),
  ],
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
};

export default meta;
type Story = StoryObj<UIButton>;

/**
 * The default button uses the `filled` variant at `md` size — the most
 * common configuration for primary call-to-action buttons.
 *
 * Use the **Controls** panel to toggle `variant`, `color`, `size`,
 * `pill`, and `disabled`.
 */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant" [color]="color" [size]="size" [pill]="pill" [disabled]="disabled">Click me</ui-button>`,
  }),
  args: {
    variant: "filled",
    color: "primary",
    size: "medium",
    pill: false,
    disabled: false,
  },
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──
<ui-button color="primary" variant="filled">Click me</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`<ui-button color="primary" variant="filled">Click me</ui-button>\`,
})
export class MyComponent {}

// ── SCSS ──
/* No custom styles needed — colours are driven by theme tokens. */
`,
        language: "html",
      },
    },
  },
};

/**
 * Full gallery showcasing all variants, colours, sizes, pill shapes,
 * and the disabled state side-by-side.
 */
export const Gallery: Story = {
  render: () => ({
    template: `<ui-button-gallery-demo />`,
  }),
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
          "- **Button type** — defaults to `button`, can be set to `submit` or `reset` for forms",
      },
      source: {
        code: `
// ── HTML ──
<ui-button color="primary" variant="filled">Save</ui-button>
<ui-button color="danger" variant="outlined">Delete</ui-button>
<ui-button color="neutral" variant="ghost">Cancel</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button color="primary" variant="filled">Save</ui-button>
    <ui-button color="danger" variant="outlined">Delete</ui-button>
    <ui-button color="neutral" variant="ghost">Cancel</ui-button>
  \`,
})
export class MyComponent {}

// ── SCSS ──
/* No custom styles needed — colours are driven by theme tokens. */
`,
        language: "html",
      },
    },
  },
};

/**
 * The `outlined` variant displays a bordered button with a transparent
 * background — ideal for secondary actions alongside a filled primary button.
 */
export const Outlined: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-button variant="outlined" [size]="size">Outlined</ui-button>`,
  }),
  args: { size: "medium" },
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──
<ui-button variant="outlined">Outlined</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button variant="outlined">Outlined</ui-button>
  \`,
})
export class MyComponent {}

// ── SCSS ──
/* No custom styles needed — UIButton ships with built-in variants. */
`,
        language: "html",
      },
    },
  },
};

/**
 * The `ghost` variant has no visible background or border, making it
 * suitable for inline actions, toolbars, or low-emphasis links styled
 * as buttons.
 */
export const Ghost: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-button variant="ghost" [size]="size">Ghost</ui-button>`,
  }),
  args: { size: "medium" },
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──
<ui-button variant="ghost">Ghost</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button variant="ghost">Ghost</ui-button>
  \`,
})
export class MyComponent {}

// ── SCSS ──
/* No custom styles needed — UIButton ships with built-in variants. */
`,
        language: "html",
      },
    },
  },
};

/** Disabled button state. */
export const Disabled: Story = {
  render: () => ({
    template: `<ui-button variant="filled" [disabled]="true">Disabled</ui-button>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──
<ui-button variant="filled" [disabled]="true">Disabled</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button variant="filled" [disabled]="true">Disabled</ui-button>
  \`,
})
export class MyComponent {}

// ── SCSS ──
/* No custom styles needed — disabled state is handled automatically. */
`,
        language: "html",
      },
    },
  },
};

/**
 * All three variants rendered side-by-side for quick visual comparison.
 * Notice how each variant communicates a different level of emphasis.
 */
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <ui-button variant="filled">Filled</ui-button>
        <ui-button variant="outlined">Outlined</ui-button>
        <ui-button variant="ghost">Ghost</ui-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──
<ui-button variant="filled">Filled</ui-button>
<ui-button variant="outlined">Outlined</ui-button>
<ui-button variant="ghost">Ghost</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button variant="filled">Filled</ui-button>
    <ui-button variant="outlined">Outlined</ui-button>
    <ui-button variant="ghost">Ghost</ui-button>
  \`,
})
export class MyComponent {}

// ── SCSS ──
:host {
  display: flex;
  gap: 16px;
  align-items: center;
}
`,
        language: "html",
      },
    },
  },
};

/**
 * All three size presets rendered side-by-side. The `small` size is
 * useful for compact UIs and table actions, while `large` works well for
 * hero sections and prominent CTAs.
 */
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <ui-button variant="filled" size="small">Small</ui-button>
        <ui-button variant="filled" size="medium">Medium</ui-button>
        <ui-button variant="filled" size="large">Large</ui-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──
<ui-button variant="filled" size="small">Small</ui-button>
<ui-button variant="filled" size="medium">Medium</ui-button>
<ui-button variant="filled" size="large">Large</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button variant="filled" size="small">Small</ui-button>
    <ui-button variant="filled" size="medium">Medium</ui-button>
    <ui-button variant="filled" size="large">Large</ui-button>
  \`,
})
export class MyComponent {}

// ── SCSS ──
:host {
  display: flex;
  gap: 16px;
  align-items: center;
}
`,
        language: "html",
      },
    },
  },
};

/**
 * All four colour presets across all three variants. Each colour maps
 * to a theme token so it adapts to light and dark mode automatically.
 */
export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <strong style="width: 70px">Filled</strong>
          <ui-button color="primary">Primary</ui-button>
          <ui-button color="secondary">Secondary</ui-button>
          <ui-button color="safe">Safe</ui-button>
          <ui-button color="danger">Danger</ui-button>
          <ui-button color="neutral">Neutral</ui-button>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <strong style="width: 70px">Outlined</strong>
          <ui-button variant="outlined" color="primary">Primary</ui-button>
          <ui-button variant="outlined" color="secondary">Secondary</ui-button>
          <ui-button variant="outlined" color="safe">Safe</ui-button>
          <ui-button variant="outlined" color="danger">Danger</ui-button>
          <ui-button variant="outlined" color="neutral">Neutral</ui-button>
        </div>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
          <strong style="width: 70px">Ghost</strong>
          <ui-button variant="ghost" color="primary">Primary</ui-button>
          <ui-button variant="ghost" color="secondary">Secondary</ui-button>
          <ui-button variant="ghost" color="safe">Safe</ui-button>
          <ui-button variant="ghost" color="danger">Danger</ui-button>
          <ui-button variant="ghost" color="neutral">Neutral</ui-button>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──
<ui-button color="primary">Primary</ui-button>
<ui-button color="secondary">Secondary</ui-button>
<ui-button color="safe">Safe</ui-button>
<ui-button color="danger">Danger</ui-button>
<ui-button color="neutral">Neutral</ui-button>

<!-- Combine with any variant -->
<ui-button variant="outlined" color="danger">Delete</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button color="primary">Save</ui-button>
    <ui-button color="danger" variant="outlined">Delete</ui-button>
  \`,
})
export class MyComponent {}

// ── SCSS ──
/* Colours are driven by --ui-accent, --ui-secondary, --ui-success, --ui-error, --ui-text tokens. */
`,
        language: "html",
      },
    },
  },
};
