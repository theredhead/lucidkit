import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { GanttPopoverDemo } from "./task-popover.story";

const meta = {
  title: "@theredhead/UI Kit/Gantt Chart",
  component: GanttPopoverDemo,
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
  decorators: [moduleMetadata({ imports: [GanttPopoverDemo] })],
} satisfies Meta<GanttPopoverDemo>;

export default meta;
type Story = StoryObj<GanttPopoverDemo>;

export const TaskPopover: Story = {
  args: {
    viewMode: "day",
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
      <ui-gantt-popover-demo
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
