import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { TemplateDemo } from "./custom-template.story";

interface ContactStoryArgs {
  placeholder: string;
  minChars: number;
  disabled: boolean;
  ariaLabel: string;
  itemSelected: (item: unknown) => void;
  itemRemoved: (item: unknown) => void;
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
      description: "Emitted when a contact is picked.",
    },
    itemRemoved: {
      action: "itemRemoved",
      description: "Emitted when a selected contact is removed.",
    },
  },
  decorators: [moduleMetadata({ imports: [TemplateDemo] })],
} satisfies Meta<ContactStoryArgs>;

export default meta;
type Story = StoryObj<ContactStoryArgs>;

export const CustomTemplate: Story = {
  args: {
    placeholder: "Search contacts...",
    minChars: 1,
    disabled: false,
    ariaLabel: "Contact search",
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-ac-template-demo
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
