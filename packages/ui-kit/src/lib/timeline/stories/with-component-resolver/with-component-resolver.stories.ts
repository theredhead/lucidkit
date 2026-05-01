import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITimeline } from "../../timeline.component";

import { WithComponentResolverStorySource } from "./with-component-resolver.story";

const meta = {
  title: "@theredhead/UI Kit/Timeline",
  component: WithComponentResolverStorySource,
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
  decorators: [moduleMetadata({ imports: [WithComponentResolverStorySource] })]
} satisfies Meta<WithComponentResolverStorySource>;

export default meta;
type Story = StoryObj<WithComponentResolverStorySource>;

export const WithComponentResolver: Story = {
  args: {
    orientation: "vertical",
    alignment: "start",
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-with-component-resolver-story-demo />",
    })
};
