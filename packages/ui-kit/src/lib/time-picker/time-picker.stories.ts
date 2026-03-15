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
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
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
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
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
        color: var(--tv-text-muted, #5a6470);
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
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
        color: var(--tv-text-muted, #5a6470);
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
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
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
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
  title: "@theredhead/UI Kit/Time Picker",
  tags: ["autodocs"],
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

export const TwentyFourHour: Story = {
  render: () => ({ template: `<ui-tp-24h-demo />` }),
};

export const TwelveHour: Story = {
  render: () => ({ template: `<ui-tp-12h-demo />` }),
};

export const FifteenMinuteStep: Story = {
  render: () => ({ template: `<ui-tp-step-demo />` }),
};

export const MinMaxConstrained: Story = {
  render: () => ({ template: `<ui-tp-minmax-demo />` }),
};

export const Disabled: Story = {
  render: () => ({ template: `<ui-tp-disabled-demo />` }),
};

export const ReadOnly: Story = {
  render: () => ({ template: `<ui-tp-readonly-demo />` }),
};
