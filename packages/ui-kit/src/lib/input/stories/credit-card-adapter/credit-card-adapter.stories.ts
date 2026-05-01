import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIInput } from "../../input.component";

import { CreditCardAdapterStorySource } from "./credit-card-adapter.story";

const meta = {
  title: "@theredhead/UI Kit/Input",
  component: CreditCardAdapterStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A thin wrapper around a native `<input>` or `<textarea>` element. " +
          "Supports `[(value)]` for simple two-way binding or `[(text)]` + " +
          "`[(value)]` when an adapter transforms raw text into a processed value.\n\n" +
          "**Adapters** can provide prefix/suffix icons and respond to icon clicks.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "number",
        "date",
        "email",
        "password",
        "tel",
        "url",
      ] as const,
      description: "Native input type. Ignored when `multiline` is `true`.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the input is empty.",
    },
    disabled: {
      control: "boolean",
      description: "Whether the input is disabled.",
    },
    multiline: {
      control: "boolean",
      description:
        "When `true`, renders a `<textarea>` instead of an `<input>`.",
    },
    rows: {
      control: "number",
      description:
        "Number of visible rows (only applies when `multiline` is `true`).",
    },
  },
  decorators: [moduleMetadata({ imports: [CreditCardAdapterStorySource] })]
} satisfies Meta<CreditCardAdapterStorySource>;

export default meta;
type Story = StoryObj<CreditCardAdapterStorySource>;

export const CreditCardAdapter: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "The `CreditCardTextAdapter` strips spaces and dashes, validates that " +
        "the number has 13–19 digits, and runs a **Luhn checksum**. Shows a " +
        "**credit-card** prefix icon."
      }
    }
  },
  render: () => ({
      template: "<ui-credit-card-adapter-story-demo />",
    })
};
