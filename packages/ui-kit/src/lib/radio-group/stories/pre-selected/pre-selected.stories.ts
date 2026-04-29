import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRadioGroup } from "../../radio-group.component";

import { PreSelectedStorySource } from "./pre-selected.story";

const meta = {
  title: "@theredhead/UI Kit/Radio Group",
  component: UIRadioGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A group of mutually exclusive radio buttons. Only one option " +
          "can be selected at a time.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the entire radio group.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the radio group.",
    },
  },
  decorators: [moduleMetadata({ imports: [PreSelectedStorySource] })]
} satisfies Meta<UIRadioGroup>;

export default meta;
type Story = StoryObj<UIRadioGroup>;

export const PreSelected: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
    template: `
      <ui-radio-group [name]="'color'" [value]="'green'">
        <ui-radio-button [value]="'red'">Red</ui-radio-button>
        <ui-radio-button [value]="'green'">Green</ui-radio-button>
        <ui-radio-button [value]="'blue'">Blue</ui-radio-button>
      </ui-radio-group>
    `,
  })
};
