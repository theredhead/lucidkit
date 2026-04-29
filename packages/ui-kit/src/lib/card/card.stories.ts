import type { Meta, StoryObj } from "@storybook/angular";

import {
  type CardVariant,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UICardImage,
} from "./card.component";
import { UIButton } from "../button/button.component";
import { UIIcons } from "../icon";

const meta: Meta<UICard> = {
  title: "@theredhead/UI Kit/Card",
  component: UICard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A versatile content container with optional header, body, and footer " +
          "projection slots. `ui-card-header` also supports an optional leading icon or avatar.",
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
          "- `<ui-card-footer>` — Right-aligned action area (flex row)\n\n" +
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
} from '@theredhead/lucid-kit';
import { UIButton } from '@theredhead/lucid-kit';

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
import { UICard, UICardHeader, UICardBody } from '@theredhead/lucid-kit';

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
import { UICard, UICardHeader, UICardBody } from '@theredhead/lucid-kit';

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
import { UICard, UICardHeader, UICardBody } from '@theredhead/lucid-kit';

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
import { UICard, UICardBody } from '@theredhead/lucid-kit';

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
import { UICard, UICardHeader, UICardBody } from '@theredhead/lucid-kit';

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

export const HeaderMedia: Story = {
  render: () => ({
    props: {
      badgeIcon: UIIcons.Lucide.Notifications.Bell,
    },
    template: `
      <div style="display: grid; gap: 1rem; max-width: 28rem;">
        <ui-card variant="elevated">
          <ui-card-header [icon]="badgeIcon">
            Activity Alerts
          </ui-card-header>
          <ui-card-body>
            Use a leading icon when the header benefits from quick visual categorisation.
          </ui-card-body>
        </ui-card>

        <ui-card variant="outlined">
          <ui-card-header avatarName="Jane Doe" avatarAriaLabel="Jane Doe">
            Assigned to Jane Doe
          </ui-card-header>
          <ui-card-body>
            Use a leading avatar when the card represents a person, owner, or assignee.
          </ui-card-body>
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
<ui-card variant="outlined">
  <ui-card-header avatarName="Jane Doe" avatarAriaLabel="Jane Doe">
    Assigned to Jane Doe
  </ui-card-header>
  <ui-card-body>
    Use a leading avatar when the card represents a person.
  </ui-card-body>
</ui-card>

<ui-card variant="elevated">
  <ui-card-header [icon]="icons.Lucide.Notifications.Bell">
    Activity Alerts
  </ui-card-header>
  <ui-card-body>
    Use a leading icon when the header benefits from quick visual categorisation.
  </ui-card-body>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICard, UICardHeader, UICardBody, UIIcons } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  template: \
    '<ui-card variant="outlined">\
      <ui-card-header avatarName="Jane Doe" avatarAriaLabel="Jane Doe">Assigned to Jane Doe</ui-card-header>\
      <ui-card-body>Use a leading avatar when the card represents a person.</ui-card-body>\
    </ui-card>\
    <ui-card variant="elevated">\
      <ui-card-header [icon]="icons.Lucide.Notifications.Bell">Activity Alerts</ui-card-header>\
      <ui-card-body>Use a leading icon when the header benefits from quick visual categorisation.</ui-card-body>\
    </ui-card>',
})
export class ExampleComponent {
  protected readonly icons = UIIcons;
}

// ── SCSS ──
/* No custom styles needed — card header media aligns automatically. */
`,
      },
    },
  },
};

export const HeaderSubtitle: Story = {
  render: () => ({
    props: {
      personIcon: UIIcons.Lucide.Account.User,
    },
    template: `
      <div style="display: grid; gap: 1rem; max-width: 28rem;">
        <ui-card variant="outlined">
          <ui-card-header [icon]="personIcon" subtitle="Design Systems Team">
            Product Owner
          </ui-card-header>
          <ui-card-body>
            A subtitle gives the header a clear second line for supporting context without pushing actions into the header.
          </ui-card-body>
        </ui-card>

        <ui-card variant="elevated">
          <ui-card-header avatarName="Jane Doe" subtitle="Last updated 2 minutes ago">
            Assigned to Jane Doe
          </ui-card-header>
          <ui-card-body>
            Subtitle and leading media can be combined for richer identity cards.
          </ui-card-body>
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
<ui-card variant="outlined">
  <ui-card-header [icon]="icons.Lucide.Account.User" subtitle="Design Systems Team">
    Product Owner
  </ui-card-header>
  <ui-card-body>
    Use a subtitle for supporting context such as role, status, or last update.
  </ui-card-body>
</ui-card>

<ui-card variant="elevated">
  <ui-card-header avatarName="Jane Doe" subtitle="Last updated 2 minutes ago">
    Assigned to Jane Doe
  </ui-card-header>
  <ui-card-body>
    Subtitle and leading media can be combined for richer identity cards.
  </ui-card-body>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UICard, UICardHeader, UICardBody, UIIcons } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICard, UICardHeader, UICardBody],
  template: \
    '<ui-card variant="outlined">\
      <ui-card-header [icon]="icons.Lucide.Account.User" subtitle="Design Systems Team">Product Owner</ui-card-header>\
      <ui-card-body>Use a subtitle for supporting context such as role, status, or last update.</ui-card-body>\
    </ui-card>\
    <ui-card variant="elevated">\
      <ui-card-header avatarName="Jane Doe" subtitle="Last updated 2 minutes ago">Assigned to Jane Doe</ui-card-header>\
      <ui-card-body>Subtitle and leading media can be combined for richer identity cards.</ui-card-body>\
    </ui-card>',
})
export class ExampleComponent {
  protected readonly icons = UIIcons;
}

// ── SCSS ──
/* No custom styles needed — card header subtitle spacing is built in. */
`,
      },
    },
  },
};

export const BodyImage: Story = {
  render: () => ({
    template: `
      <ui-card variant="outlined" style="max-width: 28rem;">
        <ui-card-header subtitle="Cover image inside the body">Project Spotlight</ui-card-header>
        <ui-card-body>
          <ui-card-image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
            alt="People collaborating around a table"
          />
          <p style="margin: 1rem 0 0;">
            ui-card-image fills the available body width and crops with object-fit cover.
          </p>
        </ui-card-body>
        <ui-card-footer>
          <ui-button variant="text">Dismiss</ui-button>
          <ui-button>Open</ui-button>
        </ui-card-footer>
      </ui-card>
    `,
    moduleMetadata: {
      imports: [UICardHeader, UICardBody, UICardImage, UICardFooter, UIButton],
    },
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-card variant="outlined">
  <ui-card-header subtitle="Cover image inside the body">Project Spotlight</ui-card-header>
  <ui-card-body>
    <ui-card-image
      src="/project-hero.jpg"
      alt="People collaborating around a table"
    />
    <p>ui-card-image fills the available body width and crops with object-fit cover.</p>
  </ui-card-body>
  <ui-card-footer>
    <ui-button variant="text">Dismiss</ui-button>
    <ui-button>Open</ui-button>
  </ui-card-footer>
</ui-card>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIButton,
  UICard,
  UICardBody,
  UICardFooter,
  UICardHeader,
  UICardImage,
} from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIButton, UICard, UICardBody, UICardFooter, UICardHeader, UICardImage],
  template: \
    '<ui-card variant="outlined">\
      <ui-card-header subtitle="Cover image inside the body">Project Spotlight</ui-card-header>\
      <ui-card-body>\
        <ui-card-image src="/project-hero.jpg" alt="People collaborating around a table" />\
        <p>ui-card-image fills the available body width and crops with object-fit cover.</p>\
      </ui-card-body>\
      <ui-card-footer>\
        <ui-button variant="text">Dismiss</ui-button>\
        <ui-button>Open</ui-button>\
      </ui-card-footer>\
    </ui-card>',
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — card image scales to the body width automatically. */
`,
      },
    },
  },
};
