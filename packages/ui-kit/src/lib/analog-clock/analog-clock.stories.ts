import { ChangeDetectionStrategy, Component } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UIAnalogClock } from "./analog-clock.component";

// ── Demo: Live (default) ─────────────────────────────────────────

@Component({
  selector: "ui-clock-live-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ui-analog-clock />`,
})
class ClockLiveDemo {}

// ── Demo: Fixed time ─────────────────────────────────────────────

@Component({
  selector: "ui-clock-fixed-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ui-analog-clock [time]="time" />`,
})
class ClockFixedDemo {
  public readonly time = new Date(2025, 0, 1, 10, 10, 30);
}

// ── Demo: No seconds ─────────────────────────────────────────────

@Component({
  selector: "ui-clock-no-seconds-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ui-analog-clock [showSeconds]="false" />`,
})
class ClockNoSecondsDemo {}

// ── Demo: Minimal (no numbers, no tick marks) ────────────────────

@Component({
  selector: "ui-clock-minimal-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-analog-clock [showNumbers]="false" [showTickMarks]="false" />
  `,
})
class ClockMinimalDemo {}

// ── Demo: Small size ─────────────────────────────────────────────

@Component({
  selector: "ui-clock-small-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ui-analog-clock [size]="80" />`,
})
class ClockSmallDemo {}

// ── Demo: Large size ─────────────────────────────────────────────

@Component({
  selector: "ui-clock-large-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ui-analog-clock [size]="400" />`,
})
class ClockLargeDemo {}

// ── Demo: Size gallery ───────────────────────────────────────────

@Component({
  selector: "ui-clock-sizes-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .gallery {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        flex-wrap: wrap;
      }
      .gallery-item {
        text-align: center;
        font-size: 0.8rem;
        color: var(--ui-clock-text, #374151);
      }
    `,
  ],
  template: `
    <div class="gallery">
      @for (s of sizes; track s) {
        <div class="gallery-item">
          <ui-analog-clock [size]="s" />
          <div style="margin-top: 0.5rem">{{ s }}px</div>
        </div>
      }
    </div>
  `,
})
class ClockSizesDemo {
  public readonly sizes = [60, 100, 160, 240];
}

// ── Demo: Comparison (with/without features) ─────────────────────

@Component({
  selector: "ui-clock-comparison-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .comparison {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .comparison-item {
        text-align: center;
        font-size: 0.8rem;
        color: var(--ui-clock-text, #374151);
      }
    `,
  ],
  template: `
    <div class="comparison">
      <div class="comparison-item">
        <ui-analog-clock [size]="160" />
        <div style="margin-top: 0.5rem">Full</div>
      </div>
      <div class="comparison-item">
        <ui-analog-clock [size]="160" [showSeconds]="false" />
        <div style="margin-top: 0.5rem">No seconds</div>
      </div>
      <div class="comparison-item">
        <ui-analog-clock [size]="160" [showNumbers]="false" />
        <div style="margin-top: 0.5rem">No numbers</div>
      </div>
      <div class="comparison-item">
        <ui-analog-clock
          [size]="160"
          [showNumbers]="false"
          [showTickMarks]="false"
        />
        <div style="margin-top: 0.5rem">Minimal</div>
      </div>
    </div>
  `,
})
class ClockComparisonDemo {}

// ── Demo: World clocks ───────────────────────────────────────────

@Component({
  selector: "ui-clock-world-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .world-clocks {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .world-clock {
        text-align: center;
        font-size: 0.8rem;
        color: var(--ui-clock-text, #374151);
      }
      .city-name {
        margin-top: 0.5rem;
        font-weight: 600;
      }
    `,
  ],
  template: `
    <div class="world-clocks">
      @for (city of cities; track city.label) {
        <div class="world-clock">
          <ui-analog-clock
            [size]="140"
            [time]="city.time"
            [showSeconds]="false"
            [ariaLabel]="'Time in ' + city.label"
          />
          <div class="city-name">{{ city.label }}</div>
        </div>
      }
    </div>
  `,
})
class ClockWorldDemo {
  public readonly cities = [
    { label: "London", time: this.offsetTime(0) },
    { label: "New York", time: this.offsetTime(-5) },
    { label: "Tokyo", time: this.offsetTime(9) },
    { label: "Sydney", time: this.offsetTime(11) },
  ];

  private offsetTime(hoursOffset: number): Date {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
    return new Date(utc + hoursOffset * 3_600_000);
  }
}

// ── Meta ─────────────────────────────────────────────────────────

const meta: Meta<UIAnalogClock> = {
  title: "@Theredhead/UI Kit/Analog Clock",
  component: UIAnalogClock,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIAnalogClock` renders a classic analog clock face as inline SVG.",
          "",
          "## Key Features",
          "",
          "- **Live ticking** — when no `time` is provided the clock updates every second",
          "- **Fixed time** — pass a `Date` to `[time]` to freeze the hands",
          "- **Configurable** — toggle second hand, hour numbers, and tick marks",
          "- **Scalable** — set any `[size]` in pixels; the SVG scales cleanly",
          "- **Dark-mode ready** — three-tier CSS custom property theming",
          '- **Accessible** — `role="img"` with configurable `ariaLabel`',
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `time` | `Date \\| null` | `null` | Fixed time to display; `null` = live |",
          "| `size` | `number` | `200` | Diameter in CSS pixels |",
          "| `showSeconds` | `boolean` | `true` | Show the second hand |",
          "| `showNumbers` | `boolean` | `true` | Show 1–12 hour numbers |",
          "| `showTickMarks` | `boolean` | `true` | Show minute/hour tick marks |",
          '| `ariaLabel` | `string` | `"Analog clock"` | Accessible label |',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "range", min: 40, max: 500, step: 10 },
      description: "Clock diameter in CSS pixels",
    },
    showSeconds: {
      control: "boolean",
      description: "Whether to show the second hand",
    },
    showNumbers: {
      control: "boolean",
      description: "Whether to show hour numbers (1–12)",
    },
    showTickMarks: {
      control: "boolean",
      description: "Whether to show tick marks around the rim",
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        ClockLiveDemo,
        ClockFixedDemo,
        ClockNoSecondsDemo,
        ClockMinimalDemo,
        ClockSmallDemo,
        ClockLargeDemo,
        ClockSizesDemo,
        ClockComparisonDemo,
        ClockWorldDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIAnalogClock>;

// ── Stories ──────────────────────────────────────────────────────

/**
 * **Live clock** — The default configuration. The clock ticks in real time
 * with second, minute, and hour hands. No `time` input needed.
 */
export const Default: Story = {
  render: () => ({ template: `<ui-clock-live-demo />` }),
  parameters: {
    docs: {
      source: { code: `<ui-analog-clock />` },
    },
  },
};

/**
 * **Fixed time** — Pass a `Date` object to freeze the clock at a specific
 * time. Useful for dashboards or documentation screenshots.
 */
export const FixedTime: Story = {
  render: () => ({ template: `<ui-clock-fixed-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-analog-clock [time]="new Date(2025, 0, 1, 10, 10, 30)" />`,
      },
    },
  },
};

/**
 * **No second hand** — A cleaner look without the ticking second hand.
 */
export const NoSeconds: Story = {
  render: () => ({ template: `<ui-clock-no-seconds-demo />` }),
  parameters: {
    docs: {
      source: { code: `<ui-analog-clock [showSeconds]="false" />` },
    },
  },
};

/**
 * **Minimal** — Numbers and tick marks hidden for a sleek, modern look.
 * Only the hands and center cap remain.
 */
export const Minimal: Story = {
  render: () => ({ template: `<ui-clock-minimal-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-analog-clock [showNumbers]="false" [showTickMarks]="false" />`,
      },
    },
  },
};

/**
 * **Small (80 px)** — Compact size suitable for status bars or inline
 * indicators.
 */
export const Small: Story = {
  render: () => ({ template: `<ui-clock-small-demo />` }),
  parameters: {
    docs: {
      source: { code: `<ui-analog-clock [size]="80" />` },
    },
  },
};

/**
 * **Large (400 px)** — Oversized clock for wall-display or kiosk UIs.
 */
export const Large: Story = {
  render: () => ({ template: `<ui-clock-large-demo />` }),
  parameters: {
    docs: {
      source: { code: `<ui-analog-clock [size]="400" />` },
    },
  },
};

/**
 * **Size gallery** — Multiple sizes displayed side by side to illustrate
 * how the SVG scales cleanly at any dimension.
 */
export const SizeGallery: Story = {
  render: () => ({ template: `<ui-clock-sizes-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `@for (s of [60, 100, 160, 240]; track s) {
  <ui-analog-clock [size]="s" />
}`,
      },
    },
  },
};

/**
 * **Feature comparison** — Four clocks side by side showing Full,
 * No seconds, No numbers, and Minimal configurations.
 */
export const Comparison: Story = {
  render: () => ({ template: `<ui-clock-comparison-demo />` }),
};

/**
 * **World clocks** — Four fixed-time clocks representing different
 * time zones, with city labels beneath each one.
 */
export const WorldClocks: Story = {
  render: () => ({ template: `<ui-clock-world-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-analog-clock
  [size]="140"
  [time]="londonTime"
  [showSeconds]="false"
  ariaLabel="Time in London"
/>`,
      },
    },
  },
};
