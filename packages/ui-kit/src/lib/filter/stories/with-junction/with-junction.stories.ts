import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIFilterStoryDemo } from "./with-junction.story";

const meta = {
  title: "@theredhead/UI Kit/Filter",
  component: UIFilterStoryDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIFilter` is a dynamic filter-builder component that lets users construct query predicates by selecting a **field**, an **operator**, and a **value** — similar to the filter UI found in spreadsheets or database query builders.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the filter UI.",
    },
    allowJunction: {
      control: "boolean",
      description: "Enable AND/OR junction between filter rows.",
    },
    allowSimple: {
      control: "boolean",
      description: "Allow the simple (single-field) filter mode.",
    },
    allowAdvanced: {
      control: "boolean",
      description: "Allow the advanced (multi-field) filter mode.",
    },
    modeLocked: {
      control: "boolean",
      description: "Lock the current filter mode (prevent switching).",
    },
    showSaveButton: {
      control: "boolean",
      description: "Show a Save button to persist the filter.",
    },
  },
  decorators: [moduleMetadata({ imports: [UIFilterStoryDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj<UIFilterStoryDemo>;

export const WithJunction: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-filter-story-demo />",
    })
};
