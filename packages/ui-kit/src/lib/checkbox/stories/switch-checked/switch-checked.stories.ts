import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type CheckboxVariant, UICheckbox } from "../../checkbox.component";

import { SwitchCheckedStorySource } from "./switch-checked.story";

const meta = {
  title: "@theredhead/UI Kit/Checkbox",
  component: UICheckbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dual-purpose boolean input that renders as either a traditional " +
          "checkbox or a toggle switch.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["checkbox", "switch"] satisfies CheckboxVariant[],
      description:
        "Controls the visual appearance. `checkbox` renders a traditional " +
        "tick box; `switch` renders a sliding toggle.",
    },
    checked: {
      control: "boolean",
      description:
        "Two-way bindable model signal (`[(checked)]`). Represents " +
        "the on/off state of the control.",
    },
    disabled: {
      control: "boolean",
      description:
        "Disables the control, preventing interaction and applying " +
        "a muted visual style.",
    },
    indeterminate: {
      control: "boolean",
      description:
        "Shows a horizontal dash instead of a tick mark. Useful for " +
        '"select all" controls where only some children are selected. ' +
        "Only applies to the `checkbox` variant.",
    },
  },
  decorators: [moduleMetadata({ imports: [SwitchCheckedStorySource] })]
} satisfies Meta<UICheckbox>;

export default meta;
type Story = StoryObj<UICheckbox>;

export const SwitchChecked: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-switch-checked-story-demo />",
    })
};
