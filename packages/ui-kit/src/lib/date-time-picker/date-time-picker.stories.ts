import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { DatePipe } from "@angular/common";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIDateTimePicker } from "./date-time-picker.component";

// ── Demo wrapper components ────────────────────────────────────────

@Component({
  selector: "ui-dtp-iso24-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDateTimePicker, DatePipe],
  template: `
    <ui-date-time-picker
      [(value)]="selected"
      format="yyyy-MM-dd"
      [timeMode]="24"
      ariaLabel="Appointment"
    />
    <pre class="story-output">{{ selected() | date: "full" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
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
class Iso24Demo {
  readonly selected = signal<Date | null>(new Date());
}

@Component({
  selector: "ui-dtp-eu12-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDateTimePicker, DatePipe],
  template: `
    <ui-date-time-picker
      [(value)]="selected"
      format="dd/MM/yyyy"
      [timeMode]="12"
      ariaLabel="Meeting"
    />
    <pre class="story-output">{{ selected() | date: "full" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
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
class Eu12Demo {
  readonly selected = signal<Date | null>(new Date());
}

@Component({
  selector: "ui-dtp-us12-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDateTimePicker, DatePipe],
  template: `
    <ui-date-time-picker
      [(value)]="selected"
      format="MM/dd/yyyy"
      [timeMode]="12"
      [firstDayOfWeek]="0"
      ariaLabel="US appointment"
    />
    <pre class="story-output">{{ selected() | date: "full" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
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
class Us12Demo {
  readonly selected = signal<Date | null>(new Date());
}

@Component({
  selector: "ui-dtp-constrained-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDateTimePicker, DatePipe],
  template: `
    <p class="story-hint">
      Date range: ± 14 days &nbsp;|&nbsp; Time range: 09:00–17:00
    </p>
    <ui-date-time-picker
      [(value)]="selected"
      format="yyyy-MM-dd"
      [timeMode]="24"
      [minDate]="minDate"
      [maxDate]="maxDate"
      minTime="09:00"
      maxTime="17:00"
      ariaLabel="Office hours booking"
    />
    <pre class="story-output">{{ selected() | date: "full" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
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
class ConstrainedDemo {
  readonly selected = signal<Date | null>(new Date());
  readonly minDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  readonly maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
}

@Component({
  selector: "ui-dtp-step-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDateTimePicker, DatePipe],
  template: `
    <p class="story-hint">15-minute time step</p>
    <ui-date-time-picker
      [(value)]="selected"
      format="dd.MM.yyyy"
      [timeMode]="24"
      [minuteStep]="15"
      ariaLabel="Scheduled event"
    />
    <pre class="story-output">{{ selected() | date: "full" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
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
class StepDemo {
  readonly selected = signal<Date | null>(new Date());
}

@Component({
  selector: "ui-dtp-disabled-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDateTimePicker],
  template: `
    <ui-date-time-picker
      [disabled]="true"
      format="yyyy-MM-dd"
      ariaLabel="Disabled"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
      }
    `,
  ],
})
class DisabledDemo {}

@Component({
  selector: "ui-dtp-readonly-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDateTimePicker, DatePipe],
  template: `
    <ui-date-time-picker
      [(value)]="selected"
      [readonly]="true"
      format="yyyy-MM-dd"
      ariaLabel="Read-only"
    />
    <pre class="story-output">{{ selected() | date: "full" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 480px;
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
  title: "@Theredhead/UI Kit/Date-Time Picker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIDateTimePicker` combines `UIDatePicker` and `UITimePicker` into a single cohesive control for selecting a full date-and-time value. It inherits all configuration options from both sub-components.",
          "",
          "## Key Features",
          "",
          "- **Unified `Date` model** — a single two-way bound `Date` object carries both date and time",
          "- **Independent format & mode** — date format (`yyyy-MM-dd`, `dd/MM/yyyy`, etc.) and time mode (12 / 24) are configured separately",
          "- **Date & time constraints** — `minDate` / `maxDate` restrict the calendar; `minTime` / `maxTime` restrict the clock",
          '- **Minute step** — inherited from the time picker, e.g. `[minuteStep]="15"` for quarter-hour scheduling',
          "- **Disabled & read-only** — both halves respect these states simultaneously",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          '| `format` | `string` | `"yyyy-MM-dd"` | Date display format (Angular date-pipe tokens) |',
          "| `timeMode` | `12 \\| 24` | `24` | 12-hour (AM/PM) or 24-hour time |",
          '| `datePlaceholder` | `string` | `""` | Placeholder for the date field |',
          "| `minDate` | `Date` | — | Earliest selectable date |",
          "| `maxDate` | `Date` | — | Latest selectable date |",
          '| `minTime` | `string` | — | Earliest selectable time (`"HH:mm"`) |',
          '| `maxTime` | `string` | — | Latest selectable time (`"HH:mm"`) |',
          "| `minuteStep` | `number` | `1` | Minute increment for arrow-key stepping |",
          "| `firstDayOfWeek` | `0 \\| 1` | `1` | Calendar week start day |",
          "| `disabled` | `boolean` | `false` | Disables both date and time inputs |",
          "| `readonly` | `boolean` | `false` | Makes the value visible but not editable |",
          '| `ariaLabel` | `string` | `"Date and time"` | Accessible label |',
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `value` | `Date \\| null` | Two-way bound `Date` combining date and time |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `valueChange` | `Date` | Emitted when either date or time changes |",
          "| `dateChange` | `Date` | Emitted when only the date portion changes |",
          "| `timeChange` | `string` | Emitted when only the time portion changes |",
        ].join("\n"),
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        UIDateTimePicker,
        Iso24Demo,
        Eu12Demo,
        Us12Demo,
        ConstrainedDemo,
        StepDemo,
        DisabledDemo,
        ReadonlyDemo,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

// ── Stories ─────────────────────────────────────────────────────────

/**
 * **ISO + 24-hour** — The default configuration: ISO date format `yyyy-MM-dd`
 * with 24-hour time (no AM/PM). Best for applications that communicate with
 * APIs expecting ISO 8601 date-time strings.
 */
export const ISO24Hour: Story = {
  render: () => ({ template: `<ui-dtp-iso24-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-time-picker
  [(value)]="selected"
  format="yyyy-MM-dd"
  [timeMode]="24"
  ariaLabel="Appointment"
/>

<!-- readonly selected = signal<Date | null>(new Date()); -->`,
        language: "html",
      },
    },
  },
};

/**
 * **European + 12-hour** — Day-first date (`dd/MM/yyyy`) paired with
 * 12-hour time and AM/PM toggle. Common in UK-style interfaces.
 */
export const European12Hour: Story = {
  render: () => ({ template: `<ui-dtp-eu12-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-time-picker
  [(value)]="selected"
  format="dd/MM/yyyy"
  [timeMode]="12"
  ariaLabel="Meeting"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **US + 12-hour** — Month-first date (`MM/dd/yyyy`) with 12-hour time
 * and Sunday as the first day of the week. Matches the typical US
 * locale conventions.
 */
export const US12Hour: Story = {
  render: () => ({ template: `<ui-dtp-us12-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-time-picker
  [(value)]="selected"
  format="MM/dd/yyyy"
  [timeMode]="12"
  [firstDayOfWeek]="0"
  ariaLabel="US appointment"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Constrained range** — Both date and time are restricted: the calendar
 * allows ±14 days from today, and the time picker is locked to business
 * hours (09:00–17:00). Ideal for office-hours booking scenarios.
 */
export const ConstrainedRange: Story = {
  render: () => ({ template: `<ui-dtp-constrained-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-time-picker
  [(value)]="selected"
  format="yyyy-MM-dd"
  [timeMode]="24"
  [minDate]="minDate"
  [maxDate]="maxDate"
  minTime="09:00"
  maxTime="17:00"
  ariaLabel="Office hours booking"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **15-minute step** — The minute field increments in 15-minute intervals
 * (0, 15, 30, 45) using the German dot-separator date format. Perfect for
 * scheduling systems that operate on quarter-hour slots.
 */
export const FifteenMinuteStep: Story = {
  render: () => ({ template: `<ui-dtp-step-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-time-picker
  [(value)]="selected"
  format="dd.MM.yyyy"
  [timeMode]="24"
  [minuteStep]="15"
  ariaLabel="Scheduled event"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Disabled** — Both the date and time sub-components are disabled.
 * The entire control is visually dimmed and non-interactive.
 */
export const Disabled: Story = {
  render: () => ({ template: `<ui-dtp-disabled-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-time-picker
  [disabled]="true"
  format="yyyy-MM-dd"
  ariaLabel="Disabled"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Read-only** — The date-time value is displayed but cannot be changed.
 * Both sub-components maintain normal styling and the value remains
 * accessible programmatically.
 */
export const ReadOnly: Story = {
  render: () => ({ template: `<ui-dtp-readonly-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-date-time-picker
  [(value)]="selected"
  [readonly]="true"
  format="yyyy-MM-dd"
  ariaLabel="Read-only"
/>`,
        language: "html",
      },
    },
  },
};
