import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { BasicDemo } from "./basic.story";

interface BasicStoryArgs {
  placeholder: string;
  minChars: number;
  disabled: boolean;
  ariaLabel: string;
  itemSelected: (item: string) => void;
  itemRemoved: (item: string) => void;
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
    minChars: {
      control: "number",
      description: "Minimum characters before querying the datasource.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the autocomplete.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the input.",
    },
    itemSelected: {
      action: "itemSelected",
      description: "Emitted when a suggestion is picked.",
    },
    itemRemoved: {
      action: "itemRemoved",
      description: "Emitted when a selected item is removed.",
    },
  },
  decorators: [moduleMetadata({ imports: [BasicDemo] })],
} satisfies Meta<BasicStoryArgs>;

export default meta;
type Story = StoryObj<BasicStoryArgs>;

export const Default: Story = {
  args: {
    placeholder: "Search fruits...",
    minChars: 1,
    disabled: false,
    ariaLabel: "Fruit search",
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-ac-basic-demo
        [placeholder]="placeholder"
        [minChars]="minChars"
        [disabled]="disabled"
        [ariaLabel]="ariaLabel"
        (itemSelected)="itemSelected($event)"
        (itemRemoved)="itemRemoved($event)"
      />
    `,
  }),
};
