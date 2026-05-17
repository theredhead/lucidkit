import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";
import { JsonViewInvalidStory } from "./invalid.story";

const meta: Meta = {
  title: "@theredhead/UI Kit/JSON View",
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [JsonViewInvalidStory] })],
};

export default meta;
type Story = StoryObj;

export const InvalidInput: Story = {
  render: () => ({
    template: `<ui-json-view-invalid-story />`,
  }),
};
