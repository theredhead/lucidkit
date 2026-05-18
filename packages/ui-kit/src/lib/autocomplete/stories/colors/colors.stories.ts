import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ColorsDemo } from "./colors.story";

const meta: Meta<ColorsDemo> = {
  title: "@theredhead/UI Kit/Autocomplete",
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [ColorsDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj<ColorsDemo>;

export const Colors: Story = {
  name: "Per-chip colour (web colours)",
  render: () => ({
    template: `<ui-ac-colors-demo />`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "Each selected chip is coloured with the CSS named colour it represents. " +
          "Foreground colour is chosen automatically for WCAG contrast. " +
          "Type any CSS colour name (e.g. `coral`, `teal`, `indigo`) to add it.",
      },
    },
  },
};
