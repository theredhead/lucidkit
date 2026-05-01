import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITimeline } from "../../timeline.component";

import { HorizontalStorySource } from "./horizontal.story";

const meta = {
  title: "@theredhead/UI Kit/Timeline",
  component: HorizontalStorySource,
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
  decorators: [moduleMetadata({ imports: [HorizontalStorySource] })]
} satisfies Meta<HorizontalStorySource>;

export default meta;
type Story = StoryObj<HorizontalStorySource>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    alignment: "start",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-horizontal-story-demo />",
    })
};
