import { ChangeDetectionStrategy, Component } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
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
        <h4 style="margin: 0 0 8px">Sizes</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-button size="sm">Small</ui-button>
          <ui-button size="md">Medium</ui-button>
          <ui-button size="lg">Large</ui-button>
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
    size: {
      control: "select",
      options: ["sm", "md", "lg"] satisfies ButtonSize[],
      description:
        "Size preset that controls padding, font-size, and min-height. " +
        "Defaults to `md`.",
    },
    disabled: {
      control: "boolean",
      description:
        "Disables the button, preventing user interaction and applying " +
        "a muted visual style.",
    },
  },
};

export default meta;
type Story = StoryObj<UIButton>;

/**
 * The default button uses the `filled` variant at `md` size — the most
 * common configuration for primary call-to-action buttons.
 *
 * Use the controls panel to toggle `variant`, `size`, and `disabled`.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-button-gallery-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Features\n" +
          "- **Variants** — `filled` (primary CTA), `outlined` (secondary), `ghost` (tertiary / inline)\n" +
          "- **Sizes** — `sm`, `md` (default), `lg`\n" +
          "- **Accessible** — forwards `ariaLabel`, renders a native `<button>` element\n" +
          "- **Button type** — defaults to `button`, can be set to `submit` or `reset` for forms\n\n" +
          "### Usage\n" +
          "```html\n" +
          '<ui-button variant="outlined" size="lg">Save</ui-button>\n' +
          "```",
      },
      source: {
        code: `
// ── HTML ──
<ui-button variant="filled" size="md" [disabled]="disabled">
  Click me
</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button variant="filled" size="md" [disabled]="disabled">
      Click me
    </ui-button>
  \`,
})
export class MyComponent {
  public disabled = false;
}

// ── SCSS ──
/* No custom styles needed — UIButton ships with built-in variants. */
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
  args: { size: "md" },
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
  args: { size: "md" },
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
 * All three size presets rendered side-by-side. The `sm` variant is
 * useful for compact UIs and table actions, while `lg` works well for
 * hero sections and prominent CTAs.
 */
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <ui-button variant="filled" size="sm">Small</ui-button>
        <ui-button variant="filled" size="md">Medium</ui-button>
        <ui-button variant="filled" size="lg">Large</ui-button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `
// ── HTML ──
<ui-button variant="filled" size="sm">Small</ui-button>
<ui-button variant="filled" size="md">Medium</ui-button>
<ui-button variant="filled" size="lg">Large</ui-button>

// ── TypeScript ──
import { UIButton } from '@theredhead/ui-kit';

@Component({
  imports: [UIButton],
  template: \`
    <ui-button variant="filled" size="sm">Small</ui-button>
    <ui-button variant="filled" size="md">Medium</ui-button>
    <ui-button variant="filled" size="lg">Large</ui-button>
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
