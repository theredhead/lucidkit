import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { GanttWeekDemo } from "./week-view.story";

const meta = {
  title: "@theredhead/UI Kit/Gantt Chart",
  component: GanttWeekDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIGanttChart` is a pure-CSS Gantt chart component driven by an",
          "`IGanttDatasource`. It renders a scrollable timeline with task bars,",
          'progress overlays, milestones, a "today" marker, and hierarchical',
          "task indentation.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    viewMode: {
      control: "select",
      options: ["day", "week", "month"],
      description: "Time granularity for the timeline columns.",
    },
    rowHeight: {
      control: "number",
      description: "Height of each task row in pixels.",
    },
    showToday: {
      control: "boolean",
      description: "Show a vertical marker for the current date.",
    },
    showTaskList: {
      control: "boolean",
      description: "Show the task-name sidebar.",
    },
    taskListWidth: {
      control: "number",
      description: "Width of the task-name sidebar in pixels.",
    },
    paddingDays: {
      control: "number",
      description: "Extra days before the first task and after the last.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the chart.",
    },
  },
  decorators: [moduleMetadata({ imports: [GanttWeekDemo] })],
} satisfies Meta<GanttWeekDemo>;

export default meta;
type Story = StoryObj<GanttWeekDemo>;

export const WeekView: Story = {
  args: {
    viewMode: "week",
    rowHeight: 36,
    showToday: true,
    showTaskList: true,
    taskListWidth: 200,
    paddingDays: 2,
    ariaLabel: "Gantt chart",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-gantt-week-demo
        [viewMode]="viewMode"
        [rowHeight]="rowHeight"
        [showToday]="showToday"
        [showTaskList]="showTaskList"
        [taskListWidth]="taskListWidth"
        [paddingDays]="paddingDays"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
};
