import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITimeline } from "../../timeline.component";

import { VerticalAlternateStorySource } from "./vertical-alternate.story";

const meta = {
  title: "@theredhead/UI Kit/Timeline",
  component: UITimeline,
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
  decorators: [moduleMetadata({ imports: [VerticalAlternateStorySource] })]
} satisfies Meta<UITimeline>;

export default meta;
type Story = StoryObj<UITimeline>;

export const VerticalAlternate: Story = {
  args: {
    orientation: "vertical",
    alignment: "alternate",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-vertical-alternate-story-demo />",
    })
};
