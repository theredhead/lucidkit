import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRadioGroup } from "../../radio-group.component";

import { DisabledItemStorySource } from "./disabled-item.story";

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
  decorators: [moduleMetadata({ imports: [DisabledItemStorySource] })]
} satisfies Meta<UIRadioGroup>;

export default meta;
type Story = StoryObj<UIRadioGroup>;

export const DisabledItem: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
    template: `
      <ui-radio-group [name]="'plan'">
        <ui-radio-button [value]="'free'">Free</ui-radio-button>
        <ui-radio-button [value]="'pro'">Pro</ui-radio-button>
        <ui-radio-button [value]="'enterprise'" [disabled]="true">Enterprise (contact us)</ui-radio-button>
      </ui-radio-group>
    `,
  })
};
