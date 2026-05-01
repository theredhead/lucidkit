import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DisabledDemo } from "./disabled.story";

interface DisabledStoryArgs {
  placeholder: string;
  ariaLabel: string;
}

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
    ariaLabel: {
      control: "text",
      description: "Accessible label for the input.",
    },
  },
  decorators: [moduleMetadata({ imports: [DisabledDemo] })],
} satisfies Meta<DisabledStoryArgs>;

export default meta;
type Story = StoryObj<DisabledStoryArgs>;

export const Disabled: Story = {
  args: {
    placeholder: "Disabled autocomplete",
    ariaLabel: "Disabled autocomplete",
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-ac-disabled-demo
        [placeholder]="placeholder"
        [ariaLabel]="ariaLabel"
      />
    `,
  }),
};
