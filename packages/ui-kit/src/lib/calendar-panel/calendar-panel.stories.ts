import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIInput } from "../input/input.component";
import { DateInputAdapter } from "../input/adapters/date-input-adapter";
import { TimeTextAdapter } from "../input/adapters/time-text-adapter";

// ── Demo wrapper components ────────────────────────────────────────

@Component({
  selector: "ui-date-input-default-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  template: `
    <ui-input
      [adapter]="adapter"
      [(text)]="dateText"
      placeholder="yyyy-MM-dd"
      ariaLabel="Date"
    />
    <pre class="story-output">Text: {{ dateText() }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 320px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--ui-surface-2, #fbfbfc);
        color: var(--ui-text, #1d232b);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--ui-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
})
class DefaultDateDemo {
  protected readonly adapter = new DateInputAdapter({ format: "yyyy-MM-dd" });
  protected readonly dateText = signal("");
}

@Component({
  selector: "ui-date-input-european-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  template: `
    <ui-input
      [adapter]="adapter"
      [(text)]="dateText"
      placeholder="dd/MM/yyyy"
      ariaLabel="European date"
    />
    <pre class="story-output">Text: {{ dateText() }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 320px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--ui-surface-2, #fbfbfc);
        color: var(--ui-text, #1d232b);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--ui-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
})
class EuropeanDateDemo {
  protected readonly adapter = new DateInputAdapter({ format: "dd/MM/yyyy" });
  protected readonly dateText = signal("");
}

@Component({
  selector: "ui-date-input-minmax-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  template: `
    <ui-input
      [adapter]="adapter"
      [(text)]="dateText"
      placeholder="yyyy-MM-dd"
      ariaLabel="Constrained date"
    />
    <pre class="story-output">Text: {{ dateText() }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 320px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--ui-surface-2, #fbfbfc);
        color: var(--ui-text, #1d232b);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--ui-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
})
class MinMaxDateDemo {
  protected readonly adapter = new DateInputAdapter({
    format: "yyyy-MM-dd",
    min: new Date(2026, 2, 1),
    max: new Date(2026, 2, 31),
  });
  protected readonly dateText = signal("");
}

@Component({
  selector: "ui-date-time-input-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  template: `
    <div class="row">
      <ui-input
        [adapter]="dateAdapter"
        [(text)]="dateText"
        placeholder="yyyy-MM-dd"
        ariaLabel="Date"
      />
      <ui-input
        [adapter]="timeAdapter"
        [(text)]="timeText"
        placeholder="HH:mm"
        ariaLabel="Time"
      />
    </div>
    <pre class="story-output">
Date: {{ dateText() }}
Time: {{ timeText() }}</pre
    >
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 420px;
      }
      .row {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--ui-surface-2, #fbfbfc);
        color: var(--ui-text, #1d232b);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--ui-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
})
class DateTimeDemo {
  protected readonly dateAdapter = new DateInputAdapter({
    format: "yyyy-MM-dd",
  });
  protected readonly timeAdapter = new TimeTextAdapter();
  protected readonly dateText = signal("");
  protected readonly timeText = signal("");
}

// ── Story meta ─────────────────────────────────────────────────────

const meta: Meta = {
  title: "@theredhead/UI Kit/Date Input",
  tags: ["autodocs"],
  argTypes: {
    format: {
      control: "text",
      description: "Date format string (e.g. `yyyy-MM-dd`, `dd/MM/yyyy`).",
    },
    firstDayOfWeek: {
      control: { type: "range", min: 0, max: 6, step: 1 },
      description: "First day of the week (0 = Sunday, 1 = Monday).",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        DefaultDateDemo,
        EuropeanDateDemo,
        MinMaxDateDemo,
        DateTimeDemo,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "`DateInputAdapter` turns a plain `UIInput` into a date picker " +
          "with an inline calendar popup. It validates typed text and " +
          "supports international formats, min/max constraints, and " +
          "configurable first day of the week.",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<ui-date-input-default-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input [adapter]="dateAdapter" [(text)]="dateText" placeholder="yyyy-MM-dd" />

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIInput, DateInputAdapter } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIInput],
  template: \\\`<ui-input [adapter]="dateAdapter" [(text)]="dateText" placeholder="yyyy-MM-dd" />\\\`,
})
export class ExampleComponent {
  readonly dateAdapter = new DateInputAdapter({ format: 'yyyy-MM-dd' });
  readonly dateText = signal('');
}
`,
      },
    },
  },
};

export const EuropeanFormat: Story = {
  render: () => ({
    template: `<ui-date-input-european-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input [adapter]="dateAdapter" [(text)]="dateText" placeholder="dd/MM/yyyy" />

// ── TypeScript ──
readonly dateAdapter = new DateInputAdapter({ format: 'dd/MM/yyyy' });
readonly dateText = signal('');
`,
      },
    },
  },
};

export const MinMaxConstraints: Story = {
  render: () => ({
    template: `<ui-date-input-minmax-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input [adapter]="dateAdapter" [(text)]="dateText" placeholder="yyyy-MM-dd" />

// ── TypeScript ──
readonly dateAdapter = new DateInputAdapter({
  format: 'yyyy-MM-dd',
  min: new Date(2026, 2, 1),
  max: new Date(2026, 2, 31),
});
readonly dateText = signal('');
`,
      },
    },
  },
};

export const DateAndTime: Story = {
  render: () => ({
    template: `<ui-date-time-input-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-input [adapter]="dateAdapter" [(text)]="dateText" placeholder="yyyy-MM-dd" ariaLabel="Date" />
<ui-input [adapter]="timeAdapter" [(text)]="timeText" placeholder="HH:mm" ariaLabel="Time" />

// ── TypeScript ──
import { UIInput, DateInputAdapter, TimeTextAdapter } from '@theredhead/ui-kit';

readonly dateAdapter = new DateInputAdapter({ format: 'yyyy-MM-dd' });
readonly timeAdapter = new TimeTextAdapter();
readonly dateText = signal('');
readonly timeText = signal('');
`,
      },
    },
  },
};
