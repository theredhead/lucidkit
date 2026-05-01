import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UICalendarMonthView } from "../../calendar-month-view.component";

import { CalendarWeekNumbersDemo } from "./week-numbers.story";

const meta = {
  title: "@theredhead/UI Kit/Calendar Month View",
  component: CalendarWeekNumbersDemo,
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
  decorators: [moduleMetadata({ imports: [CalendarWeekNumbersDemo] })],
} satisfies Meta<CalendarWeekNumbersDemo>;

export default meta;
type Story = StoryObj<CalendarWeekNumbersDemo>;

export const WeekNumbers: Story = {
  args: {
    showWeekNumbers: true,
    maxEventsPerDay: 3,
    disabled: false,
    ariaLabel: "Calendar month view",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-cal-weeknumbers-demo
        [showWeekNumbers]="showWeekNumbers"
        [maxEventsPerDay]="maxEventsPerDay"
        [disabled]="disabled"
        [ariaLabel]="ariaLabel"
      />`,
  }),
};
