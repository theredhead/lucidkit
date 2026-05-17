import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { JsonViewDefaultStory } from "./default.story";

const meta: Meta = {
  title: "@theredhead/UI Kit/JSON View",
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [JsonViewDefaultStory] })],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<ui-json-view-default-story />`,
  }),
};
