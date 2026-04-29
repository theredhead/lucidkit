import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DisabledDemo } from "./disabled.story";

const meta = {
  title: "@theredhead/UI Kit/Autocomplete",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIAutocomplete` is a type-ahead search input that queries a pluggable datasource as the user types and presents matching suggestions in a dropdown panel.",
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input.",
    },
    minChars: {
      control: "number",
      description: "Minimum characters before querying the datasource.",
    },
    multiple: {
      control: "boolean",
      description: "Enable multi-select with chip tokens.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the autocomplete.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the input.",
    },
  },
  decorators: [moduleMetadata({ imports: [DisabledDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Disabled: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-ac-disabled-demo />",
    })
};
