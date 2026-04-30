import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { FlatDemo } from "./flat.story";

const meta = {
  title: "@theredhead/UI Blocks/Property Sheet",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIPropertySheet` is a key-value inspector panel that renders a schema of typed fields against a data object.",
          "",
          "Each field definition maps to an appropriate editor widget: `UIInput`, `UISelect`, `UICheckbox`, `UIColorPicker`, or `UISlider`.",
          "",
          "## Features",
          "",
          "- **Grouped fields** — fields with the same `group` are rendered under a shared heading.",
          "- **Typed editors** — `string`, `number`, `boolean`, `select`, `color`, `slider`.",
          "- **Two-way binding** — `[(data)]` keeps the source object in sync.",
          "- **Change events** — `propertyChange` emits key, value, and the full updated object.",
          "- **Read-only** — set `readonly: true` on individual fields.",
          "",
          "## CSS Custom Properties",
          "",
          "`--ui-surface`, `--ui-text`, `--ui-border`, `--ui-group-bg`, `--ui-text-muted`",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "Accessible label for the property sheet.",
    },
  },
  decorators: [moduleMetadata({ imports: [FlatDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Flat: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-property-sheet-flat-demo />",
    })
};
