import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UICalendarMonthView } from "../../calendar-month-view.component";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Kit/Calendar Month View",
  component: UICalendarMonthView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UICalendarMonthView` renders a classic month-grid calendar " +
          "populated with events from a `CalendarDatasource`.",
      },
    },
  },
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
  decorators: [moduleMetadata({ imports: [DocumentationStorySource] })]
} satisfies Meta<UICalendarMonthView>;

export default meta;
type Story = StoryObj<UICalendarMonthView>;

export const Documentation: Story = {
  tags: ["!dev"],
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
        ].join("\n")
      }
    }
  },
  render: () => ({ template: " " })
};
