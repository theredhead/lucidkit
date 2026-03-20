import type { Meta, StoryObj } from "@storybook/angular";

import {
  type CardVariant,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
} from "./card.component";
import { UIButton } from "../button/button.component";

const meta: Meta<UICard> = {
  title: "@Theredhead/UI Kit/Card",
  component: UICard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A versatile content container with optional header, body, and footer " +
          "projection slots.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outlined", "filled"] satisfies CardVariant[],
      description: "Controls elevation, border, and background treatment.",
    },
    interactive: {
      control: "boolean",
      description:
        "When `true`, the card responds to hover/focus with elevation change and lift effect.",
    },
  },
};

export default meta;
type Story = StoryObj<UICard>;

export const Elevated: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-card [variant]="variant" [interactive]="interactive">
        <ui-card-header>Elevated Card</ui-card-header>
        <ui-card-body>
          This card uses a drop shadow to create visual depth. It's the default
          variant and works well for primary content areas.
        </ui-card-body>
        <ui-card-footer>
          <ui-button variant="text">Cancel</ui-button>
          <ui-button>Save</ui-button>
        </ui-card-footer>
      </ui-card>
    `,
    moduleMetadata: {
      imports: [UICardHeader, UICardBody, UICardFooter, UIButton],
    },
  }),
  args: { variant: "elevated", interactive: false },
  parameters: {
    docs: {
      description: {
        story:
          "### Variants\n" +
          "| Variant | Visual treatment |\n" +
          "|---------|--------------------|\n" +
          "| `elevated` | Drop shadow, no border |\n" +
          "| `outlined` | 1px border, no shadow |\n" +
          "| `filled` | Solid background, no border or shadow |\n\n" +
          "### Sub-components\n" +
          "- `<ui-card-header>` — Title area (bold, top padding)\n" +
          "- `<ui-card-body>` — Main content area\n" +
          "- `<ui-card-footer>` — Action area (flex row)\n\n" +
          "All three are optional — you can also project content directly into `<ui-card>`.",
      },
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-card variant="elevated">
  <ui-card-header>Card Title</ui-card-header>
  <ui-card-body>
    Card content goes here.
  </ui-card-body>
  <ui-card-footer>
    <ui-button variant="text">Cancel</ui-button>
    <ui-button>Save</ui-button>
  </ui-card-footer>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UICard, UICardHeader, UICardBody, UICardFooter,
} from '@theredhead/ui-kit';
import { UIButton } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody, UICardFooter, UIButton],
  template: \`
    <ui-card variant="elevated">
      <ui-card-header>Card Title</ui-card-header>
      <ui-card-body>Card content goes here.</ui-card-body>
      <ui-card-footer>
        <ui-button variant="text">Cancel</ui-button>
        <ui-button>Save</ui-button>
      </ui-card-footer>
    </ui-card>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — card tokens handle theming. */
`,
      },
    },
  },
};

export const Outlined: Story = {
  render: () => ({
    template: `
      <ui-card variant="outlined">
        <ui-card-header>Outlined Card</ui-card-header>
        <ui-card-body>
          This card uses a subtle border instead of a shadow. Works well for
          secondary content or when nesting cards inside elevated surfaces.
        </ui-card-body>
      </ui-card>
    `,
    moduleMetadata: { imports: [UICardHeader, UICardBody] },
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-card variant="outlined">
  <ui-card-header>Outlined Card</ui-card-header>
  <ui-card-body>Content with a subtle border.</ui-card-body>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICard, UICardHeader, UICardBody } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  template: \`
    <ui-card variant="outlined">
      <ui-card-header>Outlined Card</ui-card-header>
      <ui-card-body>Content with a subtle border.</ui-card-body>
    </ui-card>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — card tokens handle theming. */
`,
      },
    },
  },
};

export const Filled: Story = {
  render: () => ({
    template: `
      <ui-card variant="filled">
        <ui-card-header>Filled Card</ui-card-header>
        <ui-card-body>
          A flat card with only a background fill. Minimal visual weight,
          ideal for dense layouts or as a subtle grouping container.
        </ui-card-body>
      </ui-card>
    `,
    moduleMetadata: { imports: [UICardHeader, UICardBody] },
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-card variant="filled">
  <ui-card-header>Filled Card</ui-card-header>
  <ui-card-body>Minimal visual weight, ideal for dense layouts.</ui-card-body>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICard, UICardHeader, UICardBody } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  template: \`
    <ui-card variant="filled">
      <ui-card-header>Filled Card</ui-card-header>
      <ui-card-body>Minimal visual weight.</ui-card-body>
    </ui-card>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — card tokens handle theming. */
`,
      },
    },
  },
};

export const Interactive: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; max-width: 48rem;">
        <ui-card [interactive]="true" variant="elevated">
          <ui-card-header>Hover me</ui-card-header>
          <ui-card-body>Interactive elevated card lifts on hover.</ui-card-body>
        </ui-card>
        <ui-card [interactive]="true" variant="outlined">
          <ui-card-header>Hover me</ui-card-header>
          <ui-card-body>Interactive outlined card gains shadow on hover.</ui-card-body>
        </ui-card>
        <ui-card [interactive]="true" variant="filled">
          <ui-card-header>Hover me</ui-card-header>
          <ui-card-body>Interactive filled card lifts on hover.</ui-card-body>
        </ui-card>
      </div>
    `,
    moduleMetadata: { imports: [UICardHeader, UICardBody] },
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-card [interactive]="true" variant="elevated">
  <ui-card-header>Clickable Card</ui-card-header>
  <ui-card-body>Lifts on hover — great for selection UIs.</ui-card-body>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICard, UICardHeader, UICardBody } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  template: \`
    <ui-card [interactive]="true" variant="elevated">
      <ui-card-header>Clickable Card</ui-card-header>
      <ui-card-body>Lifts on hover.</ui-card-body>
    </ui-card>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — interactive states are built in. */
`,
      },
    },
  },
};

export const BodyOnly: Story = {
  render: () => ({
    template: `
      <ui-card variant="outlined">
        <ui-card-body>
          A simple card with only a body — no header or footer.
          Great for brief content or notifications.
        </ui-card-body>
      </ui-card>
    `,
    moduleMetadata: { imports: [UICardBody] },
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-card variant="outlined">
  <ui-card-body>
    A simple card with body only — no header or footer needed.
  </ui-card-body>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICard, UICardBody } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICard, UICardBody],
  template: \`
    <ui-card variant="outlined">
      <ui-card-body>Simple content card.</ui-card-body>
    </ui-card>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — card tokens handle theming. */
`,
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 24rem;">
        <ui-card variant="elevated">
          <ui-card-header>Elevated</ui-card-header>
          <ui-card-body>Drop shadow, no border.</ui-card-body>
        </ui-card>
        <ui-card variant="outlined">
          <ui-card-header>Outlined</ui-card-header>
          <ui-card-body>1px border, no shadow.</ui-card-body>
        </ui-card>
        <ui-card variant="filled">
          <ui-card-header>Filled</ui-card-header>
          <ui-card-body>Solid background only.</ui-card-body>
        </ui-card>
      </div>
    `,
    moduleMetadata: { imports: [UICardHeader, UICardBody] },
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-card variant="elevated">
  <ui-card-header>Elevated</ui-card-header>
  <ui-card-body>Drop shadow, no border.</ui-card-body>
</ui-card>

<ui-card variant="outlined">
  <ui-card-header>Outlined</ui-card-header>
  <ui-card-body>1px border, no shadow.</ui-card-body>
</ui-card>

<ui-card variant="filled">
  <ui-card-header>Filled</ui-card-header>
  <ui-card-body>Solid background only.</ui-card-body>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICard, UICardHeader, UICardBody } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  template: \`
    <ui-card variant="elevated">
      <ui-card-header>Elevated</ui-card-header>
      <ui-card-body>Drop shadow, no border.</ui-card-body>
    </ui-card>
    <ui-card variant="outlined">
      <ui-card-header>Outlined</ui-card-header>
      <ui-card-body>1px border, no shadow.</ui-card-body>
    </ui-card>
    <ui-card variant="filled">
      <ui-card-header>Filled</ui-card-header>
      <ui-card-body>Solid background only.</ui-card-body>
    </ui-card>
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — card tokens handle theming. */
`,
      },
    },
  },
};
