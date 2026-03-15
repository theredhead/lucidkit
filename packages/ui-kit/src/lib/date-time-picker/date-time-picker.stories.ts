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
  readonly selected = signal<Date | null>(new Date());
}

// ── Story meta ─────────────────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Kit/Date-Time Picker",
  tags: ["autodocs"],
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
