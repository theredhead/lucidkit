import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { DatePipe } from "@angular/common";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIDatePicker } from "./date-picker.component";

// ── Demo wrapper components ────────────────────────────────────────

@Component({
  selector: "ui-dp-iso-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDatePicker, DatePipe],
  template: `
    <ui-date-picker
      [(value)]="selected"
      format="yyyy-MM-dd"
      ariaLabel="ISO date"
    />
    <pre class="story-output">
Selected: {{ selected() | date: "fullDate" }}</pre
    >
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
class IsoDemo {
  readonly selected = signal<Date | null>(null);
}

@Component({
  selector: "ui-dp-european-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDatePicker, DatePipe],
  template: `
    <ui-date-picker
      [(value)]="selected"
      format="dd/MM/yyyy"
      ariaLabel="European date"
    />
    <pre class="story-output">
Selected: {{ selected() | date: "fullDate" }}</pre
    >
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
class EuropeanDemo {
  readonly selected = signal<Date | null>(null);
}

@Component({
  selector: "ui-dp-us-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDatePicker, DatePipe],
  template: `
    <ui-date-picker
      [(value)]="selected"
      format="MM/dd/yyyy"
      ariaLabel="US date"
    />
    <pre class="story-output">
Selected: {{ selected() | date: "fullDate" }}</pre
    >
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
class USDemo {
  readonly selected = signal<Date | null>(null);
}

@Component({
  selector: "ui-dp-german-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDatePicker, DatePipe],
  template: `
    <ui-date-picker
      [(value)]="selected"
      format="dd.MM.yyyy"
      ariaLabel="German date"
    />
    <pre class="story-output">
Selected: {{ selected() | date: "fullDate" }}</pre
    >
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
class GermanDemo {
  readonly selected = signal<Date | null>(null);
}

@Component({
  selector: "ui-dp-minmax-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDatePicker, DatePipe],
  template: `
    <p class="story-hint">Range: today ± 30 days</p>
    <ui-date-picker
      [(value)]="selected"
      format="yyyy-MM-dd"
      [min]="min"
      [max]="max"
      ariaLabel="Constrained date"
    />
    <pre class="story-output">
Selected: {{ selected() | date: "fullDate" }}</pre
    >
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 320px;
      }
      .story-hint {
        font-size: 0.8125rem;
        margin-bottom: 0.5rem;
        color: var(--ui-text-muted, #5a6470);
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
class MinMaxDemo {
  readonly selected = signal<Date | null>(null);
  readonly min = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  readonly max = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

@Component({
  selector: "ui-dp-sunday-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDatePicker, DatePipe],
  template: `
    <p class="story-hint">Week starts on Sunday</p>
    <ui-date-picker
      [(value)]="selected"
      format="MM/dd/yyyy"
      [firstDayOfWeek]="0"
      ariaLabel="US date (Sunday start)"
    />
    <pre class="story-output">
Selected: {{ selected() | date: "fullDate" }}</pre
    >
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 320px;
      }
      .story-hint {
        font-size: 0.8125rem;
        margin-bottom: 0.5rem;
        color: var(--ui-text-muted, #5a6470);
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
class SundayStartDemo {
  readonly selected = signal<Date | null>(null);
}

@Component({
  selector: "ui-dp-disabled-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDatePicker],
  template: `
    <ui-date-picker
      [disabled]="true"
      format="yyyy-MM-dd"
      placeholder="Disabled"
      ariaLabel="Disabled date"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 320px;
      }
    `,
  ],
})
class DisabledDemo {}

@Component({
  selector: "ui-dp-readonly-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDatePicker, DatePipe],
  template: `
    <ui-date-picker
      [(value)]="selected"
      [readonly]="true"
      format="yyyy-MM-dd"
      ariaLabel="Read-only date"
    />
    <pre class="story-output">Value: {{ selected() | date: "fullDate" }}</pre>
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
class ReadonlyDemo {
  readonly selected = signal<Date | null>(new Date());
}

// ── Story meta ─────────────────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Kit/Date Picker",
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        UIDatePicker,
        IsoDemo,
        EuropeanDemo,
        USDemo,
        GermanDemo,
        MinMaxDemo,
        SundayStartDemo,
        DisabledDemo,
        ReadonlyDemo,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

// ── Stories ─────────────────────────────────────────────────────────

export const ISO: Story = {
  render: () => ({ template: `<ui-dp-iso-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-picker
  [(value)]="selected"
  format="yyyy-MM-dd"
  ariaLabel="ISO date"
/>

<!-- readonly selected = signal<Date | null>(null); -->`,
        language: "html",
      },
    },
  },
};

export const European: Story = {
  render: () => ({ template: `<ui-dp-european-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-picker
  [(value)]="selected"
  format="dd/MM/yyyy"
  ariaLabel="European date"
/>`,
        language: "html",
      },
    },
  },
};

export const US: Story = {
  render: () => ({ template: `<ui-dp-us-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-picker
  [(value)]="selected"
  format="MM/dd/yyyy"
  ariaLabel="US date"
/>`,
        language: "html",
      },
    },
  },
};

export const German: Story = {
  render: () => ({ template: `<ui-dp-german-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-picker
  [(value)]="selected"
  format="dd.MM.yyyy"
  ariaLabel="German date"
/>`,
        language: "html",
      },
    },
  },
};

export const MinMaxConstrained: Story = {
  render: () => ({ template: `<ui-dp-minmax-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-picker
  [(value)]="selected"
  format="yyyy-MM-dd"
  [min]="minDate"
  [max]="maxDate"
  ariaLabel="Constrained date"
/>

<!-- readonly minDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
     readonly maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); -->`,
        language: "html",
      },
    },
  },
};

export const SundayStart: Story = {
  render: () => ({ template: `<ui-dp-sunday-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-picker
  [(value)]="selected"
  format="MM/dd/yyyy"
  [firstDayOfWeek]="0"
  ariaLabel="US date (Sunday start)"
/>`,
        language: "html",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => ({ template: `<ui-dp-disabled-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-picker
  [disabled]="true"
  format="yyyy-MM-dd"
  placeholder="Disabled"
  ariaLabel="Disabled date"
/>`,
        language: "html",
      },
    },
  },
};

export const ReadOnly: Story = {
  render: () => ({ template: `<ui-dp-readonly-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-picker
  [(value)]="selected"
  [readonly]="true"
  format="yyyy-MM-dd"
  ariaLabel="Read-only date"
/>`,
        language: "html",
      },
    },
  },
};
