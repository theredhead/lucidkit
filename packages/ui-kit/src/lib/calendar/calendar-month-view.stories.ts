import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { UICalendarMonthView } from "./calendar-month-view.component";
import { ArrayCalendarDatasource } from "./array-calendar-datasource";
import type { CalendarEvent } from "./calendar.types";
import { UIButton } from "../button/button.component";

// ── Shared fixtures ──────────────────────────────────────────────

function sampleEvents(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  return [
    {
      id: "1",
      title: "Team standup",
      start: new Date(y, m, 3, 9, 0),
      allDay: false,
    },
    {
      id: "2",
      title: "Design review",
      start: new Date(y, m, 3, 14, 0),
      color: "#ea4335",
    },
    {
      id: "3",
      title: "Sprint planning",
      start: new Date(y, m, 7, 10, 0),
      color: "#4285f4",
    },
    {
      id: "4",
      title: "Conference",
      start: new Date(y, m, 12),
      end: new Date(y, m, 14),
      allDay: true,
      color: "#34a853",
    },
    {
      id: "5",
      title: "Dentist appointment",
      start: new Date(y, m, 18, 11, 30),
      color: "#fbbc04",
    },
    {
      id: "6",
      title: "Product demo",
      start: new Date(y, m, 21, 15, 0),
    },
    {
      id: "7",
      title: "Retrospective",
      start: new Date(y, m, 24, 16, 0),
      color: "#9c27b0",
    },
    {
      id: "8",
      title: "Hackathon",
      start: new Date(y, m, 26),
      end: new Date(y, m, 27),
      allDay: true,
      color: "#ff6d00",
    },
  ];
}

function busyDayEvents(): CalendarEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  return [
    { id: "b1", title: "Standup", start: new Date(y, m, 10, 9, 0) },
    {
      id: "b2",
      title: "Code review",
      start: new Date(y, m, 10, 10, 0),
      color: "#4285f4",
    },
    {
      id: "b3",
      title: "Lunch & learn",
      start: new Date(y, m, 10, 12, 0),
      color: "#34a853",
    },
    {
      id: "b4",
      title: "1:1 with manager",
      start: new Date(y, m, 10, 14, 0),
      color: "#fbbc04",
    },
    {
      id: "b5",
      title: "Sprint review",
      start: new Date(y, m, 10, 15, 30),
      color: "#ea4335",
    },
    {
      id: "b6",
      title: "Team social",
      start: new Date(y, m, 10, 17, 0),
      color: "#9c27b0",
    },
  ];
}

// ── Demo: Empty calendar ─────────────────────────────────────────

@Component({
  selector: "ui-cal-empty-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ui-calendar-month-view [datasource]="ds" />`,
})
class CalendarEmptyDemo {
  public readonly ds = new ArrayCalendarDatasource([]);
}

// ── Demo: With events (interactive) ──────────────────────────────

@Component({
  selector: "ui-cal-events-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .demo-info {
        margin-top: 1rem;
        font-size: 0.85rem;
        color: #6b7280;
      }
    `,
  ],
  template: `
    <ui-calendar-month-view
      [datasource]="ds"
      [(selectedDate)]="selected"
      [showWeekNumbers]="showWeekNumbers()"
      [maxEventsPerDay]="maxEventsPerDay()"
      (dateSelected)="onDate($event)"
      (eventSelected)="onEvent($event)"
    />
    <div class="demo-info">
      <p><strong>Selected:</strong> {{ selected().toDateString() }}</p>
      @if (lastEvent) {
        <p><strong>Last event clicked:</strong> {{ lastEvent }}</p>
      }
    </div>
  `,
})
class CalendarEventsDemo {
  public readonly showWeekNumbers = input<boolean>(false);
  public readonly maxEventsPerDay = input<number>(3);
  public readonly ds = new ArrayCalendarDatasource(sampleEvents());
  public readonly selected = signal(new Date());
  public lastEvent: string | null = null;

  public onDate(d: Date): void {
    this.selected.set(d);
  }

  public onEvent(e: CalendarEvent): void {
    this.lastEvent = `${e.title} (${e.start.toLocaleString()})`;
  }
}

// ── Demo: Overflow (busy day) ────────────────────────────────────

@Component({
  selector: "ui-cal-overflow-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-calendar-month-view [datasource]="ds" [maxEventsPerDay]="2" />
  `,
})
class CalendarOverflowDemo {
  public readonly ds = new ArrayCalendarDatasource(busyDayEvents());
}

// ── Demo: Week numbers ──────────────────────────────────────────

@Component({
  selector: "ui-cal-weeknumbers-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-calendar-month-view [datasource]="ds" [showWeekNumbers]="true" />
  `,
})
class CalendarWeekNumbersDemo {
  public readonly ds = new ArrayCalendarDatasource(sampleEvents());
}

// ── Demo: Custom palette ─────────────────────────────────────────

@Component({
  selector: "ui-cal-palette-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-calendar-month-view [datasource]="ds" [palette]="palette" />
  `,
})
class CalendarPaletteDemo {
  public readonly palette = [
    "#1e3a5f",
    "#3d5a80",
    "#5a8dba",
    "#7eb4d2",
    "#a6d0e4",
  ] as const;

  public readonly ds = new ArrayCalendarDatasource(
    sampleEvents().map(({ color: _, ...e }) => e),
  );
}

// ── Demo: Dynamic events ─────────────────────────────────────────

@Component({
  selector: "ui-cal-dynamic-demo",
  standalone: true,
  imports: [UICalendarMonthView, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-calendar-month-view [datasource]="ds" />

    <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
      <ui-button variant="outlined" (click)="addEvent()"
        >+ Add random event</ui-button
      >
      <ui-button variant="outlined" (click)="clear()">Clear all</ui-button>
    </div>
  `,
})
class CalendarDynamicDemo {
  public readonly ds = new ArrayCalendarDatasource(sampleEvents());

  private counter = 100;
  private readonly colors = [
    "#4285f4",
    "#ea4335",
    "#34a853",
    "#fbbc04",
    "#9c27b0",
  ];

  public addEvent(): void {
    const now = new Date();
    const day = Math.floor(Math.random() * 28) + 1;
    this.ds.addEvent({
      id: `dyn-${this.counter++}`,
      title: `Event #${this.counter}`,
      start: new Date(now.getFullYear(), now.getMonth(), day, 10, 0),
      color: this.colors[this.counter % this.colors.length],
    });
  }

  public clear(): void {
    this.ds.setEvents([]);
  }
}

// ── Demo: Multi-day events ───────────────────────────────────────

@Component({
  selector: "ui-cal-multiday-demo",
  standalone: true,
  imports: [UICalendarMonthView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ui-calendar-month-view [datasource]="ds" /> `,
})
class CalendarMultiDayDemo {
  public readonly ds = new ArrayCalendarDatasource(
    (() => {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      return [
        {
          id: "md1",
          title: "Vacation",
          start: new Date(y, m, 5),
          end: new Date(y, m, 9),
          allDay: true,
          color: "#34a853",
        },
        {
          id: "md2",
          title: "Sprint",
          start: new Date(y, m, 14),
          end: new Date(y, m, 25),
          allDay: true,
          color: "#4285f4",
        },
        {
          id: "md3",
          title: "Workshop",
          start: new Date(y, m, 18),
          end: new Date(y, m, 20),
          allDay: true,
          color: "#ff6d00",
        },
        {
          id: "md4",
          title: "Standup",
          start: new Date(y, m, 18, 9, 0),
        },
      ] satisfies CalendarEvent[];
    })(),
  );
}

// ── Meta ─────────────────────────────────────────────────────────

const meta: Meta<UICalendarMonthView> = {
  title: "@Theredhead/UI Kit/Calendar Month View",
  component: UICalendarMonthView,
  tags: ["autodocs"],
  argTypes: {
    showWeekNumbers: {
      control: "boolean",
      description: "Show ISO week numbers in the first column.",
    },
    maxEventsPerDay: {
      control: "number",
      description: "Maximum events shown per day before an overflow indicator.",
    },
    disabled: {
      control: "boolean",
      description: "Disables date selection.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the calendar.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "`UICalendarMonthView` renders a classic month-grid calendar " +
          "populated with events from a `CalendarDatasource`.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CalendarEmptyDemo,
        CalendarEventsDemo,
        CalendarOverflowDemo,
        CalendarWeekNumbersDemo,
        CalendarPaletteDemo,
        CalendarDynamicDemo,
        CalendarMultiDayDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UICalendarMonthView>;

// ── Stories ──────────────────────────────────────────────────────

/**
 * **Default** — A populated calendar showing event badges, day
 * selection, and event click handling. Use the controls to toggle
 * week numbers and adjust the max events per day. Click a day to
 * select it, click an event badge to see its details below.
 */
export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-cal-events-demo
      [showWeekNumbers]="showWeekNumbers"
      [maxEventsPerDay]="maxEventsPerDay"
    />`,
  }),
  args: {
    showWeekNumbers: false,
    maxEventsPerDay: 3,
  },
  argTypes: {
    showWeekNumbers: { control: "boolean" },
    maxEventsPerDay: { control: { type: "number", min: 1, max: 10, step: 1 } },
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-calendar-month-view
  [datasource]="ds"
  [(selectedDate)]="selected"
  (dateSelected)="onDate($event)"
  (eventSelected)="onEvent($event)"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UICalendarMonthView, ArrayCalendarDatasource } from '@theredhead/ui-kit';
import type { CalendarEvent } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UICalendarMonthView],
  template: \\\`
    <ui-calendar-month-view
      [datasource]="ds"
      [(selectedDate)]="selected"
      (dateSelected)="onDate($event)"
      (eventSelected)="onEvent($event)"
    />
  \\\`,
})
export class ExampleComponent {
  readonly ds = new ArrayCalendarDatasource([
    { id: '1', title: 'Team standup', start: new Date(), color: '#4285f4' },
  ]);
  readonly selected = signal(new Date());

  onDate(d: Date) { this.selected.set(d); }
  onEvent(e: CalendarEvent) { console.log(e.title); }
}

// ── SCSS ──
/* No custom styles needed — calendar tokens handle theming. */
`,
      },
    },
  },
};

/**
 * **Empty** — A month grid with no events, showing the basic
 * structure with day numbers, weekday headers, and navigation controls.
 */
export const Empty: Story = {
  render: () => ({ template: `<ui-cal-empty-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `const ds = new ArrayCalendarDatasource([]);

<ui-calendar-month-view [datasource]="ds" />`,
      },
    },
  },
};

/**
 * **Overflow (busy day)** — When a day has more events than
 * `maxEventsPerDay`, a "+N more" label appears. Click the day cell to
 * open a popover (via `PopoverService`) showing all events with colour
 * dots and times. The popover opens for any day with events.
 */
export const Overflow: Story = {
  render: () => ({ template: `<ui-cal-overflow-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-calendar-month-view
  [datasource]="busyDs"
  [maxEventsPerDay]="2"
/>`,
      },
    },
  },
};

/**
 * **Week numbers** — Set `[showWeekNumbers]="true"` to display an
 * ISO 8601 week-number column on the leading edge of the grid.
 */
export const WeekNumbers: Story = {
  render: () => ({ template: `<ui-cal-weeknumbers-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-calendar-month-view
  [datasource]="ds"
  [showWeekNumbers]="true"
/>`,
      },
    },
  },
};

/**
 * **Custom palette** — Supply a custom colour palette for events that
 * don't specify their own `color`. The default 8-colour palette is
 * replaced with a monochrome blue range.
 */
export const CustomPalette: Story = {
  render: () => ({ template: `<ui-cal-palette-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `const palette = ['#1e3a5f', '#3d5a80', '#5a8dba', '#7eb4d2', '#a6d0e4'];

<ui-calendar-month-view
  [datasource]="ds"
  [palette]="palette"
/>`,
      },
    },
  },
};

/**
 * **Dynamic events** — Demonstrates the reactive datasource.
 * Click "Add random event" to add events at runtime;
 * the grid re-renders automatically via the `changed` emitter.
 */
export const DynamicEvents: Story = {
  render: () => ({ template: `<ui-cal-dynamic-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `ds.addEvent({
  id: 'new-1',
  title: 'New Event',
  start: new Date(),
  color: '#4285f4',
});`,
      },
    },
  },
};

/**
 * **Multi-day events** — Events with both `start` and `end` dates
 * appear across all spanned day cells. Overlapping multi-day events
 * stack within the badge area.
 */
export const MultiDayEvents: Story = {
  render: () => ({ template: `<ui-cal-multiday-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `const events: CalendarEvent[] = [
  {
    id: 'v1',
    title: 'Vacation',
    start: new Date(2025, 2, 5),
    end:   new Date(2025, 2, 9),
    allDay: true,
    color: '#34a853',
  },
];`,
      },
    },
  },
};

/**
 * _API Reference_ — features, inputs, and outputs.
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
          "- **Datasource-driven** — plug in any `CalendarDatasource` implementation",
          "- **Navigation** — prev / next / go-to-today controls",
          "- **Day selection** — two-way `selectedDate` model, `dateSelected` output",
          "- **Event badges** — colour-coded, overflow indicator (`+N more`)",
          "- **Day-detail popover** — click any day with events to see full details via PopoverService",
          "- **Week numbers** — optional ISO week-number leading column",
          "- **Multi-day events** — span across multiple day cells",
          "- **Dark-mode ready** — three-tier CSS custom property theming",
          "- **Accessible** — `role=grid`, `role=gridcell`, `aria-current`, keyboard nav",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `CalendarDatasource` | *required* | Event provider |",
          "| `selectedDate` | `Date` | today | Currently selected date (two-way) |",
          "| `maxEventsPerDay` | `number` | `3` | Max visible event badges per cell |",
          "| `palette` | `string[]` | 8-colour default | Fallback colours for events |",
          '| `ariaLabel` | `string` | `"Calendar month view"` | Accessible region label |',
          "| `showWeekNumbers` | `boolean` | `false` | Show ISO week-number leading column |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `dateSelected` | `Date` | Emitted when a day cell is clicked |",
          "| `eventSelected` | `CalendarEvent` | Emitted when an event badge is clicked |",
          "| `monthChanged` | `Date` | Emitted when the displayed month changes |",
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};
