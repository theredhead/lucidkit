import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITimeline } from "../../timeline.component";

import { VerticalStartStorySource } from "./vertical-start.story";

const meta = {
  title: "@theredhead/UI Kit/Timeline",
  component: VerticalStartStorySource,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"] satisfies string[],
      description: "Layout direction of the timeline.",
    },
    alignment: {
      control: "select",
      options: ["start", "end", "alternate"] satisfies string[],
      description: "Which side events appear on.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the timeline.",
    },
  },
  decorators: [moduleMetadata({ imports: [VerticalStartStorySource] })]
} satisfies Meta<VerticalStartStorySource>;

export default meta;
type Story = StoryObj<VerticalStartStorySource>;

export const VerticalStart: Story = {
  args: {
    orientation: "vertical",
    alignment: "start",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-vertical-start-story-demo />",
    })
};
