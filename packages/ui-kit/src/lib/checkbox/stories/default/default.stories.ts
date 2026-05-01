import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type CheckboxVariant, UICheckbox } from "../../checkbox.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Checkbox",
  component: DefaultStorySource,
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Features\n" +
        "- **Two-way binding** via the `checked` model signal — `[(checked)]`\n" +
        '- **Switch variant** — set `variant="switch"` for iOS / Material-style toggles\n' +
        '- **Indeterminate state** — visual third state for "select all" patterns\n' +
        "- **Label projection** — text content is projected as the label\n" +
        '- **Accessible** — renders a native `<input type="checkbox">` with proper ARIA\n\n' +
        "### Usage\n" +
        "```html\n" +
        '<ui-checkbox [(checked)]="agreeToTerms">I accept the terms</ui-checkbox>\n' +
        '<ui-checkbox variant="switch" [(checked)]="darkMode">Dark mode</ui-checkbox>\n' +
        "```"
      }
    }
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
