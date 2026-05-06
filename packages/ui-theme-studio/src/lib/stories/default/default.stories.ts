import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ThemeStudioDefaultStory } from "./default.story";

const meta = {
  title: "@theredhead/Theme Studio/Theme Studio",
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [ThemeStudioDefaultStory] })],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  parameters: {
    docs: {
      description: {
        story:
          "Click **Open Theme Studio** to open the slide-in drawer. " +
          "Every `--ui-*` design token is listed and can be live-edited. " +
          "Changes are applied instantly to the host document. " +
          "Use **Copy CSS** or **Copy JSON** to export your overrides.",
      },
    },
  },
  render: () => ({
    template: "<ui-story-theme-studio-default />",
  }),
};
