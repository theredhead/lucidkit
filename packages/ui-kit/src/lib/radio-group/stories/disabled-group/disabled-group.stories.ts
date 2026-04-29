import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRadioGroup } from "../../radio-group.component";

import { DisabledGroupStorySource } from "./disabled-group.story";

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
  decorators: [moduleMetadata({ imports: [DisabledGroupStorySource] })]
} satisfies Meta<UIRadioGroup>;

export default meta;
type Story = StoryObj<UIRadioGroup>;

export const DisabledGroup: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
    template: `
      <ui-radio-group [name]="'size'" [value]="'md'" [disabled]="true">
        <ui-radio-button [value]="'sm'">Small</ui-radio-button>
        <ui-radio-button [value]="'md'">Medium</ui-radio-button>
        <ui-radio-button [value]="'lg'">Large</ui-radio-button>
      </ui-radio-group>
    `,
  })
};
