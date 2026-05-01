import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIInput } from "../../input.component";

import { MoneyAdapterStorySource } from "./money-adapter.story";

const meta = {
  title: "@theredhead/UI Kit/Input",
  component: MoneyAdapterStorySource,
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
  decorators: [moduleMetadata({ imports: [MoneyAdapterStorySource] })]
} satisfies Meta<MoneyAdapterStorySource>;

export default meta;
type Story = StoryObj<MoneyAdapterStorySource>;

export const MoneyAdapter: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "The `MoneyTextAdapter` strips commas and whitespace. Validates the " +
        "amount against the currency's decimal rules (e.g. JPY allows 0 " +
        "decimal places, USD/EUR allow 2). The prefix icon changes to match " +
        "the currency. Currency is inferred from the browser locale by " +
        "default, or set explicitly via the constructor. Use `provideDefaultCurrency()` " +
        "to override the default globally via DI."
      }
    }
  },
  render: () => ({
      template: "<ui-money-adapter-story-demo />",
    })
};
