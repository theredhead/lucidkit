import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UITimePicker } from "./time-picker.component";

// ── Demo wrapper components ────────────────────────────────────────

@Component({
  selector: "ui-tp-24h-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimePicker],
  template: `
    <ui-time-picker [(value)]="selected" [mode]="24" ariaLabel="24-hour time" />
    <pre class="story-output">Value: {{ selected() ?? "null" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 300px;
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
class TwentyFourHourDemo {
  readonly selected = signal<string | null>("14:30");
}

@Component({
  selector: "ui-tp-12h-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimePicker],
  template: `
    <ui-time-picker [(value)]="selected" [mode]="12" ariaLabel="12-hour time" />
    <pre class="story-output">
Value (24h internal): {{ selected() ?? "null" }}</pre
    >
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 300px;
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
class TwelveHourDemo {
  readonly selected = signal<string | null>("14:30");
}

@Component({
  selector: "ui-tp-step-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimePicker],
  template: `
    <p class="story-hint">15-minute step (use arrow keys in minute field)</p>
    <ui-time-picker
      [(value)]="selected"
      [mode]="24"
      [minuteStep]="15"
      ariaLabel="Stepped time"
    />
    <pre class="story-output">Value: {{ selected() ?? "null" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 300px;
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
  readonly selected = signal<string | null>("09:00");
}

@Component({
  selector: "ui-tp-minmax-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimePicker],
  template: `
    <p class="story-hint">Business hours: 09:00 – 17:00</p>
    <ui-time-picker
      [(value)]="selected"
      [mode]="24"
      min="09:00"
      max="17:00"
      ariaLabel="Business hours"
    />
    <pre class="story-output">Value: {{ selected() ?? "null" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 300px;
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
  readonly selected = signal<string | null>("12:00");
}

@Component({
  selector: "ui-tp-disabled-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimePicker],
  template: `
    <ui-time-picker [disabled]="true" [mode]="24" ariaLabel="Disabled time" />
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 300px;
      }
    `,
  ],
})
class DisabledDemo {}

@Component({
  selector: "ui-tp-readonly-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimePicker],
  template: `
    <ui-time-picker
      [(value)]="selected"
      [readonly]="true"
      [mode]="24"
      ariaLabel="Read-only time"
    />
    <pre class="story-output">Value: {{ selected() ?? "null" }}</pre>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 300px;
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
  readonly selected = signal<string | null>("08:45");
}

// ── Story meta ─────────────────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Kit/Time Picker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UITimePicker` is a keyboard-driven time input with separate hour and minute fields. It supports 12-hour (AM/PM) and 24-hour modes, minute stepping, and min/max time constraints.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        UITimePicker,
        TwentyFourHourDemo,
        TwelveHourDemo,
        StepDemo,
        MinMaxDemo,
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
 * **24-hour mode** — The default mode. Hours range from 00 to 23 with no
 * AM/PM toggle. Pre-populated with 14:30 to demonstrate afternoon times.
 * Use arrow keys in each field to increment/decrement.
 */
export const TwentyFourHour: Story = {
  render: () => ({ template: `<ui-tp-24h-demo />` }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          '- **12- or 24-hour mode** — set `[mode]="12"` for AM/PM toggle or `[mode]="24"` for military time',
          "- **Minute step** — constrain minute values to multiples (e.g. 15-minute intervals) via `[minuteStep]`",
          "- **Min / max time** — restrict the selectable range to business hours or any other window",
          "- **Keyboard navigation** — arrow keys increment/decrement hours and minutes within bounds",
          '- **String value** — the model uses `"HH:mm"` format strings (always 24-hour internally)',
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `mode` | `12 \\| 24` | `24` | Display mode — 12-hour with AM/PM or 24-hour |",
          "| `disabled` | `boolean` | `false` | Disables the entire time picker |",
          "| `readonly` | `boolean` | `false` | Makes the value visible but not editable |",
          '| `min` | `string` | — | Earliest selectable time (`"HH:mm"` format) |',
          '| `max` | `string` | — | Latest selectable time (`"HH:mm"` format) |',
          "| `minuteStep` | `number` | `1` | Minute increment for arrow-key stepping |",
          '| `ariaLabel` | `string` | `"Time picker"` | Accessible label for the control |',
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          '| `value` | `string \\| null` | Two-way bound time in `"HH:mm"` format (24-hour) |',
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `timeChange` | `string` | Emitted when the time value changes |",
        ].join("\n"),
      },
      source: {
        code: `<ui-time-picker
  [(value)]="selected"
  [mode]="24"
  ariaLabel="24-hour time"
/>

<!-- readonly selected = signal<string | null>('14:30'); -->`,
        language: "html",
      },
    },
  },
};

/**
 * **12-hour mode** — Displays hours 1–12 with an AM/PM toggle. The internal
 * value is always stored in 24-hour `"HH:mm"` format so downstream code
 * doesn't need to convert. The initial value of `"14:30"` displays as
 * `2:30 PM`.
 */
export const TwelveHour: Story = {
  render: () => ({ template: `<ui-tp-12h-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-time-picker
  [(value)]="selected"
  [mode]="12"
  ariaLabel="12-hour time"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **15-minute step** — Setting `[minuteStep]="15"` constrains minutes to
 * 0, 15, 30, or 45. Arrow keys in the minute field jump by 15-minute
 * intervals. This is perfect for appointment or meeting schedulers.
 */
export const FifteenMinuteStep: Story = {
  render: () => ({ template: `<ui-tp-step-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-time-picker
  [(value)]="selected"
  [mode]="24"
  [minuteStep]="15"
  ariaLabel="Stepped time"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Min / max constrained** — Limits the selectable range to business hours
 * (09:00–17:00). Attempting to navigate outside this range with arrow keys
 * clamps the value to the nearest boundary.
 */
export const MinMaxConstrained: Story = {
  render: () => ({ template: `<ui-tp-minmax-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-time-picker
  [(value)]="selected"
  [mode]="24"
  min="09:00"
  max="17:00"
  ariaLabel="Business hours"
/>`,
        language: "html",
      },
    },
  },
};

/**
 * **Disabled** — The time picker is fully non-interactive. Fields cannot
 * be focused and the control is visually dimmed.
 */
export const Disabled: Story = {
  render: () => ({ template: `<ui-tp-disabled-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-time-picker [disabled]="true" [mode]="24" ariaLabel="Disabled time" />`,
        language: "html",
      },
    },
  },
};

/**
 * **Read-only** — The time value is displayed but cannot be modified.
 * The control maintains normal styling and the value can be read
 * programmatically.
 */
export const ReadOnly: Story = {
  render: () => ({ template: `<ui-tp-readonly-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-time-picker
  [(value)]="selected"
  [readonly]="true"
  [mode]="24"
  ariaLabel="Read-only time"
/>`,
        language: "html",
      },
    },
  },
};
