import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIGanttChart } from "../../gantt-chart.component";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Kit/Gantt Chart",
  component: UIGanttChart,
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
  decorators: [moduleMetadata({ imports: [DocumentationStorySource] })]
} satisfies Meta<UIGanttChart>;

export default meta;
type Story = StoryObj<UIGanttChart>;

export const Documentation: Story = {
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Datasource-driven** — `GanttArrayDatasource` for in-memory data",
          "- **View modes** — day, week, and month granularity",
          "- **Progress bars** — optional percentage overlay per task",
          "- **Milestones** — diamond markers for zero-duration events",
          "- **Hierarchical** — parent/child task indentation in the sidebar",
          "- **Dependencies** — `dependencies` array on each task",
          "- **Today marker** — vertical line showing the current date",
          "- **Dark-mode ready** — three-tier CSS custom property theming",
          "- **Accessible** — `role=region`, `aria-label`, keyboard focusable bars",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `IGanttDatasource` | *required* | Task data source |",
          "| `viewMode` | `'day' \\| 'week' \\| 'month'` | `'day'` | Timeline granularity |",
          "| `rowHeight` | `number` | `36` | Row height in pixels |",
          "| `showToday` | `boolean` | `true` | Show today marker line |",
          "| `showTaskList` | `boolean` | `true` | Show sidebar with task names |",
          "| `taskListWidth` | `number` | `200` | Sidebar width in pixels |",
          "| `paddingDays` | `number` | `2` | Extra days before/after range |",
          '| `ariaLabel` | `string` | `"Gantt chart"` | Accessible label |',
          "",
          "## Outputs",
          "",
          "| Output | Type | Description |",
          "|--------|------|-------------|",
          "| `taskClicked` | `GanttTask<T>` | Emitted when a bar or milestone is clicked |",
        ].join("\n")
      }
    }
  },
  render: () => ({ template: " " })
};
