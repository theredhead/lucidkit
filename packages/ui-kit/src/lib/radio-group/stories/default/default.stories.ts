import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRadioGroup } from "../../radio-group.component";

import { RadioDemo } from "./default.story";

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
  decorators: [moduleMetadata({ imports: [RadioDemo] })]
} satisfies Meta<UIRadioGroup>;

export default meta;
type Story = StoryObj<UIRadioGroup>;

export const Default: Story = {
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
        "```"
      }
    }
  },
  render: () => ({
      template: "<ui-radio-demo />",
    })
};
