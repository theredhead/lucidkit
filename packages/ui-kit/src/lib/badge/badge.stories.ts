import { ChangeDetectionStrategy, Component } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type BadgeColor, type BadgeVariant, UIBadge } from "./badge.component";

// ── Gallery demo ─────────────────────────────────────────────────────

@Component({
  selector: "ui-badge-gallery-demo",
  standalone: true,
  imports: [UIBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px">
      <div>
        <h4 style="margin: 0 0 8px">Count badges</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-badge [count]="3" color="primary" />
          <ui-badge [count]="7" color="success" />
          <ui-badge [count]="12" color="warning" />
          <ui-badge [count]="99" color="danger" />
          <ui-badge [count]="42" color="neutral" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Dot indicators</h4>
        <div style="display: flex; gap: 16px; align-items: center">
          <ui-badge variant="dot" color="primary" />
          <ui-badge variant="dot" color="success" />
          <ui-badge variant="dot" color="warning" />
          <ui-badge variant="dot" color="danger" />
          <ui-badge variant="dot" color="neutral" />
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Label badges</h4>
        <div
          style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap"
        >
          <ui-badge variant="label" color="primary">New</ui-badge>
          <ui-badge variant="label" color="success">Active</ui-badge>
          <ui-badge variant="label" color="warning">Pending</ui-badge>
          <ui-badge variant="label" color="danger">Urgent</ui-badge>
          <ui-badge variant="label" color="neutral">Draft</ui-badge>
        </div>
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Overflow (99+)</h4>
        <div style="display: flex; gap: 12px; align-items: center">
          <ui-badge [count]="150" [maxCount]="99" color="danger" />
          <ui-badge [count]="500" [maxCount]="99" color="primary" />
        </div>
      </div>
    </div>
  `,
})
class BadgeGalleryDemo {}

const meta: Meta<UIBadge> = {
  title: "@theredhead/UI Kit/Badge",
  component: UIBadge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A small status indicator that conveys a numeric count, a presence dot, " +
          "or a short text label.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [BadgeGalleryDemo],
    }),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["count", "dot", "label"] satisfies BadgeVariant[],
      description:
        "Controls the visual shape: `count` shows a number, `dot` shows a " +
        "small circle, `label` renders projected text content.",
    },
    color: {
      control: "select",
      options: [
        "primary",
        "success",
        "warning",
        "danger",
        "neutral",
      ] satisfies BadgeColor[],
      description:
        "Semantic colour preset. Maps to `--ui-badge-bg` and " +
        "`--ui-badge-text` CSS custom properties.",
    },
    count: {
      control: "number",
      description:
        "Numeric value displayed when `variant` is `count`. " +
        "Clamped to `maxCount` with a `+` suffix when exceeded.",
    },
    maxCount: {
      control: "number",
      description:
        "Upper display limit for the `count` variant. Counts above this " +
        'threshold render as `maxCount+` (e.g. "99+"). Defaults to `99`.',
    },
  },
};

export default meta;
type Story = StoryObj<UIBadge>;

/**
 * Interactive playground — adjust every input via the Controls panel.
 */
export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-badge
      [variant]="variant"
      [color]="color"
      [count]="count"
      [maxCount]="maxCount"
      [ariaLabel]="ariaLabel"
    >Label</ui-badge>`,
  }),
  args: {
    variant: "count",
    color: "primary",
    count: 5,
    maxCount: 99,
    ariaLabel: "Notification badge",
  },
};

/**
 * All badge variants and colours at a glance: count badges, dot
 * indicators, text labels, and overflow behaviour.
 */
export const Default: Story = {
  render: () => ({
    template: `<ui-badge-gallery-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "### Variants\n" +
          "| Variant | Purpose | Example |\n" +
          "|---------|---------|---------|\n" +
          "| `count` | Numeric notification badge | Unread messages (5) |\n" +
          "| `dot` | Presence / status indicator | Online status |\n" +
          '| `label` | Short text tag | "New", "Beta" |\n\n' +
          "### Colors\n" +
          "`primary` · `success` · `warning` · `danger` · `neutral`\n\n" +
          "### Overflow\n" +
          "When `count` exceeds `maxCount`, the badge displays `maxCount+` " +
          '(e.g. "99+").',
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-badge [count]="5" color="danger" />
<ui-badge variant="dot" color="success" />
<ui-badge variant="label" color="primary">New</ui-badge>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  template: \`
    <ui-badge [count]="5" color="danger" />
    <ui-badge variant="dot" color="success" />
    <ui-badge variant="label" color="primary">New</ui-badge>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — badge tokens handle theming. */
`,
      },
    },
  },
};

/**
 * A numeric count badge — the most common variant. Displays the
 * current `count` value, or `maxCount+` when the count exceeds the
 * maximum. Useful for notification counts, cart items, etc.
 */
export const Count: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-badge [count]="count" [color]="color" [maxCount]="maxCount" />`,
  }),
  args: { count: 5, color: "danger", maxCount: 99 },
  parameters: {
    docs: {
      description: {
        story:
          "### Variants\n" +
          "| Variant | Purpose | Example |\n" +
          "|---------|---------|---------|\n" +
          "| `count` | Numeric notification badge | Unread messages (5) |\n" +
          "| `dot` | Presence / status indicator | Online status |\n" +
          '| `label` | Short text tag | "New", "Beta" |\n\n' +
          "### Colors\n" +
          "`primary` · `success` · `warning` · `danger` · `neutral`\n\n" +
          "### Overflow\n" +
          "When `count` exceeds `maxCount`, the badge displays `maxCount+` " +
          '(e.g. "99+").',
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-badge [count]="unreadCount" color="danger" [maxCount]="99" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  template: \`<ui-badge [count]="unreadCount" color="danger" />\`,
})
export class ExampleComponent {
  public readonly unreadCount = 5;
}

// ── SCSS ──
/* No custom styles needed — badge tokens handle theming. */
`,
      },
    },
  },
};

/**
 * Demonstrates overflow behaviour: when `count` (150) exceeds
 * `maxCount` (99), the badge renders as "99+".
 */
export const Overflow: Story = {
  render: () => ({
    template: `<ui-badge [count]="150" [maxCount]="99" color="danger" />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-badge [count]="totalItems" [maxCount]="99" color="danger" />
<!-- Renders "99+" when totalItems exceeds maxCount -->

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  template: \`<ui-badge [count]="totalItems" [maxCount]="99" color="danger" />\`,
})
export class ExampleComponent {
  public readonly totalItems = 150;
}

// ── SCSS ──
/* No custom styles needed — overflow display is automatic. */
`,
      },
    },
  },
};

/**
 * The `dot` variant renders a small coloured circle without text.
 * Ideal for online/offline indicators, status dots, or attention markers.
 */
export const Dot: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-badge variant="dot" [color]="color" />`,
  }),
  args: { color: "success" },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-badge variant="dot" color="success" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  template: \`<ui-badge variant="dot" color="success" />\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — dot size and colour use badge tokens. */
`,
      },
    },
  },
};

/**
 * The `label` variant renders projected text content inside the badge.
 * Perfect for status tags like "New", "Beta", "Sale", or category labels.
 */
export const Label: Story = {
  render: () => ({
    template: `<ui-badge variant="label" color="primary">New</ui-badge>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-badge variant="label" color="primary">New</ui-badge>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  template: \`<ui-badge variant="label" color="primary">New</ui-badge>\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — label text inherits badge token colours. */
`,
      },
    },
  },
};

/**
 * All five colour presets side-by-side for quick visual comparison.
 * Each colour maps to semantic meaning: primary (info), success,
 * warning, danger (error), and neutral.
 */
export const AllColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <ui-badge [count]="3" color="primary" />
        <ui-badge [count]="7" color="success" />
        <ui-badge [count]="12" color="warning" />
        <ui-badge [count]="99" color="danger" />
        <ui-badge [count]="42" color="neutral" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<div class="badge-row">
  <ui-badge [count]="3"  color="primary" />
  <ui-badge [count]="7"  color="success" />
  <ui-badge [count]="12" color="warning" />
  <ui-badge [count]="99" color="danger"  />
  <ui-badge [count]="42" color="neutral" />
</div>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
})
export class ExampleComponent {}

// ── SCSS ──
.badge-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
`,
      },
    },
  },
};

/**
 * All three variants rendered together: a count badge, a status dot,
 * and a text label. Shows how badges can convey different types
 * of information at a glance.
 */
export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <ui-badge [count]="5" color="danger" />
        <ui-badge variant="dot" color="success" />
        <ui-badge variant="label" color="primary">Beta</ui-badge>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<div class="badge-row">
  <ui-badge [count]="5" color="danger" />
  <ui-badge variant="dot" color="success" />
  <ui-badge variant="label" color="primary">Beta</ui-badge>
</div>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIBadge } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIBadge],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
})
export class ExampleComponent {}

// ── SCSS ──
.badge-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
`,
      },
    },
  },
};
