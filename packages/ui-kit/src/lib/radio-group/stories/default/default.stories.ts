import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { RadioDemo } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Radio Group",
  component: RadioDemo,
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
  decorators: [moduleMetadata({ imports: [RadioDemo] })],
} satisfies Meta<RadioDemo>;

export default meta;
type Story = StoryObj<RadioDemo>;

export const Default: Story = {
  args: {
    disabled: false,
    ariaLabel: "Choose a fruit",
  },
  parameters: {
    docs: {
      description: {
        story:
          "### Composition\n" +
          "`UIRadioGroup` wraps one or more `UIRadioButton` children. The " +
          "group manages selection state and keyboard navigation (arrow keys).\n\n" +
          "### Features\n" +
          "- **Two-way binding** — `[(value)]` model signal on the group\n" +
          "- **Individual disable** — disable specific options with `[disabled]` on `UIRadioButton`\n" +
          "- **Group disable** — disable the entire group with `[disabled]` on `UIRadioGroup`\n" +
          '- **Accessible** — proper `role="radiogroup"` with arrow-key navigation\n\n' +
          "### Usage\n" +
          "```html\n" +
          '<ui-radio-group name="plan" [(value)]="selectedPlan">\n' +
          '  <ui-radio-button value="free">Free</ui-radio-button>\n' +
          '  <ui-radio-button value="pro">Pro</ui-radio-button>\n' +
          "</ui-radio-group>\n" +
          "```",
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<ui-radio-demo
      [disabled]="disabled"
      [ariaLabel]="ariaLabel"
    />`,
  }),
};
