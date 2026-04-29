import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MinMaxConstraintsStorySource } from "./min-max-constraints.story";

const meta = {
  title: "@theredhead/UI Kit/Date Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`DateInputAdapter` turns a plain `UIInput` into a date picker " +
          "with an inline calendar popup. It validates typed text and " +
          "supports international formats, min/max constraints, and " +
          "configurable first day of the week.",
      },
    },
  },
  argTypes: {
    format: {
      control: "text",
      description: "Date format string (e.g. `yyyy-MM-dd`, `dd/MM/yyyy`).",
    },
    firstDayOfWeek: {
      control: { type: "range", min: 0, max: 6, step: 1 },
      description: "First day of the week (0 = Sunday, 1 = Monday).",
    },
  },
  decorators: [moduleMetadata({ imports: [MinMaxConstraintsStorySource] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const MinMaxConstraints: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-min-max-constraints-story-demo />",
    })
};
