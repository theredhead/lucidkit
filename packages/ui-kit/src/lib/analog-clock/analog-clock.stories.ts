import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UIAnalogClock } from "./analog-clock.component";
import { UIIcons } from "../icon";

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

// ── Demo: Day vs Night ───────────────────────────────────────────

@Component({
  selector: "ui-clock-day-night-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .day-night {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .day-night-item {
        text-align: center;
        font-size: 0.85rem;
        color: var(--ui-clock-text, #374151);
      }
    `,
  ],
  template: `
    <div class="day-night">
      <div class="day-night-item">
        <ui-analog-clock [size]="180" [time]="morning" />
        <div style="margin-top: 0.5rem">8:00 AM</div>
      </div>
      <div class="day-night-item">
        <ui-analog-clock [size]="180" [time]="afternoon" />
        <div style="margin-top: 0.5rem">2:30 PM</div>
      </div>
      <div class="day-night-item">
        <ui-analog-clock [size]="180" [time]="evening" />
        <div style="margin-top: 0.5rem">9:15 PM</div>
      </div>
      <div class="day-night-item">
        <ui-analog-clock [size]="180" [time]="lateNight" />
        <div style="margin-top: 0.5rem">3:45 AM</div>
      </div>
    </div>
  `,
})
class ClockDayNightDemo {
  public readonly morning = new Date(2025, 0, 1, 8, 0, 0);
  public readonly afternoon = new Date(2025, 0, 1, 14, 30, 0);
  public readonly evening = new Date(2025, 0, 1, 21, 15, 0);
  public readonly lateNight = new Date(2025, 0, 1, 3, 45, 0);
}

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

// ── Demo: World clocks (live-ticking) ────────────────────────────

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
        font-size: 0.85rem;
        color: var(--ui-clock-text, #374151);
      }
      .city-name {
        margin-top: 0.5rem;
        font-weight: 600;
      }
      .tz-offset {
        font-size: 0.75rem;
        opacity: 0.6;
      }
    `,
  ],
  template: `
    <div class="world-clocks">
      @for (city of zones; track city.label) {
        <div class="world-clock">
          <ui-analog-clock
            [size]="160"
            [time]="city.time()"
            [showSeconds]="false"
            [ariaLabel]="'Time in ' + city.label"
          />
          <div class="city-name">{{ city.label }}</div>
          <div class="tz-offset">
            UTC{{ city.offset >= 0 ? "+" : "" }}{{ city.offset }}
          </div>
        </div>
      }
    </div>
  `,
})
class ClockWorldDemo implements OnInit, OnDestroy {
  public readonly zones = [
    { label: "London", offset: 0, time: signal(this.offsetTime(0)) },
    { label: "New York", offset: -5, time: signal(this.offsetTime(-5)) },
    { label: "Tokyo", offset: 9, time: signal(this.offsetTime(9)) },
    { label: "Sydney", offset: 11, time: signal(this.offsetTime(11)) },
  ];

  private intervalId: ReturnType<typeof setInterval> | null = null;

  public ngOnInit(): void {
    this.intervalId = setInterval(() => {
      for (const z of this.zones) {
        z.time.set(this.offsetTime(z.offset));
      }
    }, 1000);
  }

  public ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  private offsetTime(hoursOffset: number): Date {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
    return new Date(utc + hoursOffset * 3_600_000);
  }
}

// ── Demo: Custom icons ──────────────────────────────────────────

@Component({
  selector: "ui-clock-custom-icons-demo",
  standalone: true,
  imports: [UIAnalogClock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .custom-icons {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .custom-icons-item {
        text-align: center;
        font-size: 0.85rem;
        color: var(--ui-clock-text, #374151);
      }
    `,
  ],
  template: `
    <div class="custom-icons">
      <div class="custom-icons-item">
        <ui-analog-clock
          [size]="180"
          [time]="dayTime"
          [dayIcon]="sparkles"
          dayIconColor="#ec4899"
        />
        <div style="margin-top: 0.5rem">Sparkles (day)</div>
      </div>
      <div class="custom-icons-item">
        <ui-analog-clock
          [size]="180"
          [time]="nightTime"
          [nightIcon]="star"
          nightIconColor="#fbbf24"
        />
        <div style="margin-top: 0.5rem">Star (night)</div>
      </div>
      <div class="custom-icons-item">
        <ui-analog-clock
          [size]="180"
          [time]="nightTime"
          [nightIcon]="flame"
          nightIconColor="#ef4444"
        />
        <div style="margin-top: 0.5rem">Flame (night)</div>
      </div>
    </div>
  `,
})
class ClockCustomIconsDemo {
  public readonly dayTime = new Date(2025, 0, 1, 10, 0, 0);
  public readonly nightTime = new Date(2025, 0, 1, 22, 0, 0);
  public readonly sparkles = UIIcons.Lucide.Weather.Sparkles;
  public readonly star = UIIcons.Lucide.Weather.Star;
  public readonly flame = UIIcons.Lucide.Weather.Flame;
}

// ── Meta ─────────────────────────────────────────────────────────

const meta: Meta<UIAnalogClock> = {
  title: "@theredhead/UI Kit/Analog Clock",
  component: UIAnalogClock,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIAnalogClock` renders a classic analog clock face as inline SVG.",
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
    dayIconColor: {
      control: "color",
      description: "Stroke colour for the daytime indicator icon",
    },
    nightIconColor: {
      control: "color",
      description: "Stroke colour for the nighttime indicator icon",
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
        ClockDayNightDemo,
        ClockCustomIconsDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIAnalogClock>;

// ── Stories ──────────────────────────────────────────────────────

/**
 * **Live clock** — The default configuration. The clock ticks in real time
 * with second, minute, and hour hands. Use the controls panel to resize
 * the clock and toggle features interactively.
 */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-analog-clock
      [size]="size"
      [showSeconds]="showSeconds"
      [showNumbers]="showNumbers"
      [showTickMarks]="showTickMarks"
    />`,
  }),
  args: {
    size: 200,
    showSeconds: true,
    showNumbers: true,
    showTickMarks: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-analog-clock />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`<ui-analog-clock />\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — clock tokens handle theming. */
`,
      },
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
        language: "html",
        code: `
// ── HTML ──
<ui-analog-clock [time]="fixedTime" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`<ui-analog-clock [time]="fixedTime" />\`,
})
export class ExampleComponent {
  fixedTime = new Date(2025, 0, 1, 10, 10, 30);
}

// ── SCSS ──
/* No custom styles needed. */
`,
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
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-analog-clock [showSeconds]="false" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`<ui-analog-clock [showSeconds]="false" />\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
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
        language: "html",
        code: `
// ── HTML ──
<ui-analog-clock [showNumbers]="false" [showTickMarks]="false" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`
    <ui-analog-clock [showNumbers]="false" [showTickMarks]="false" />
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed. */
`,
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
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-analog-clock [size]="80" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`<ui-analog-clock [size]="80" />\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
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
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-analog-clock [size]="400" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`<ui-analog-clock [size]="400" />\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **Day vs Night** — The clock automatically detects whether the displayed
 * time is day (6 AM–6 PM) or night (6 PM–6 AM). Daytime shows a sun icon;
 * nighttime shows a moon crescent with stars and a deep blue face.
 */
export const DayVsNight: Story = {
  render: () => ({ template: `<ui-clock-day-night-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Day (sun indicator, light face) -->
<ui-analog-clock [time]="morningTime" />

<!-- Night (moon + stars, deep blue face) -->
<ui-analog-clock [time]="nightTime" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`
    <ui-analog-clock [time]="morningTime" />
    <ui-analog-clock [time]="nightTime" />
  \`,
})
export class ExampleComponent {
  morningTime = new Date(2025, 0, 1, 8, 0, 0);
  nightTime = new Date(2025, 0, 1, 22, 0, 0);
}

// ── SCSS ──
/* Day/night theming is automatic — no custom styles needed. */
`,
      },
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
        language: "html",
        code: `
// ── HTML ──
@for (s of sizes; track s) {
  <ui-analog-clock [size]="s" />
}

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`
    @for (s of sizes; track s) {
      <ui-analog-clock [size]="s" />
    }
  \`,
})
export class ExampleComponent {
  sizes = [60, 100, 160, 240];
}

// ── SCSS ──
/* No custom styles needed. */
`,
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
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-analog-clock [size]="160" />
<ui-analog-clock [size]="160" [showSeconds]="false" />
<ui-analog-clock [size]="160" [showNumbers]="false" />
<ui-analog-clock [size]="160" [showNumbers]="false" [showTickMarks]="false" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \`
    <ui-analog-clock [size]="160" />
    <ui-analog-clock [size]="160" [showSeconds]="false" />
    <ui-analog-clock [size]="160" [showNumbers]="false" />
    <ui-analog-clock [size]="160" [showNumbers]="false" [showTickMarks]="false" />
  \`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * **World clocks** — Four live-ticking clocks showing London, New York,
 * Tokyo, and Sydney. Each clock displays the correct day/night indicator
 * based on the local time in that city. UTC offset labels appear beneath.
 */
export const WorldClocks: Story = {
  render: () => ({ template: `<ui-clock-world-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
@for (city of zones; track city.label) {
  <ui-analog-clock
    [size]="160"
    [time]="city.time()"
    [showSeconds]="false"
    [ariaLabel]="'Time in ' + city.label"
  />
}

// ── TypeScript ──
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { UIAnalogClock } from '@theredhead/ui-kit';

@Component({
  selector: 'app-world-clocks',
  standalone: true,
  imports: [UIAnalogClock],
  template: \\\`…\\\`,
})
export class WorldClocksComponent implements OnInit, OnDestroy {
  zones = [
    { label: 'London',   offset:  0, time: signal(this.offset(0)) },
    { label: 'New York', offset: -5, time: signal(this.offset(-5)) },
    { label: 'Tokyo',    offset:  9, time: signal(this.offset(9)) },
    { label: 'Sydney',   offset: 11, time: signal(this.offset(11)) },
  ];

  private id: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.id = setInterval(() => {
      for (const z of this.zones) z.time.set(this.offset(z.offset));
    }, 1000);
  }

  ngOnDestroy() {
    if (this.id) clearInterval(this.id);
  }

  private offset(h: number): Date {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
    return new Date(utc + h * 3_600_000);
  }
}

// ── SCSS ──
/* No custom styles needed — day/night theming is automatic. */
`,
      },
    },
  },
};

/**
 * **Custom icons** — The `dayIcon` / `nightIcon` inputs accept any Lucide
 * icon SVG string (or your own 24 × 24 SVG inner content). Combine with
 * `dayIconColor` / `nightIconColor` to fully customise the indicator.
 */
export const CustomIcons: Story = {
  render: () => ({ template: `<ui-clock-custom-icons-demo />` }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-analog-clock
  [dayIcon]="sparkles"
  dayIconColor="#ec4899"
  [nightIcon]="star"
  nightIconColor="#fbbf24"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIAnalogClock, UIIcons } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIAnalogClock],
  template: \\\`
    <ui-analog-clock
      [dayIcon]="sparkles"
      dayIconColor="#ec4899"
      [nightIcon]="star"
      nightIconColor="#fbbf24"
    />
  \\\`,
})
export class ExampleComponent {
  sparkles = UIIcons.Lucide.Weather.Sparkles;
  star = UIIcons.Lucide.Weather.Star;
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * _API Reference_ — features, inputs, and icon customisation.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Live ticking** — when no `time` is provided the clock updates every second",
          "- **Fixed time** — pass a `Date` to `[time]` to freeze the hands",
          "- **Configurable** — toggle second hand, hour numbers, and tick marks",
          "- **Scalable** — set any `[size]` in pixels; the SVG scales cleanly",
          "- **Dark-mode ready** — three-tier CSS custom property theming",
          "- **Day/night indicator** — sun icon during the day, moon & stars at night, with tinted face colors",
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
          "| `dayIcon` | `string` | Sun (Lucide) | SVG inner content for the day indicator |",
          "| `nightIcon` | `string` | MoonStar (Lucide) | SVG inner content for the night indicator |",
          '| `dayIconColor` | `string` | `"#f59e0b"` | Stroke colour for the day icon |',
          '| `nightIconColor` | `string` | `"#e8e0c0"` | Stroke colour for the night icon |',
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};
