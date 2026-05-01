import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIInput } from "../../input.component";

import { IntegerAdapterStorySource } from "./integer-adapter.story";

const meta = {
  title: "@theredhead/UI Kit/Input",
  component: IntegerAdapterStorySource,
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
  decorators: [moduleMetadata({ imports: [IntegerAdapterStorySource] })]
} satisfies Meta<IntegerAdapterStorySource>;

export default meta;
type Story = StoryObj<IntegerAdapterStorySource>;

export const IntegerAdapter: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "The `IntegerTextAdapter` validates that the input contains only " +
        "an integer (optional `+`/`-` sign and digits). Shows a **hash** " +
        "prefix icon."
      }
    }
  },
  render: () => ({
      template: "<ui-integer-adapter-story-demo />",
    })
};
