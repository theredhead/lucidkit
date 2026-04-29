import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIInput } from "../../input.component";

import { DateAdapterStorySource } from "./date-adapter.story";

const meta = {
  title: "@theredhead/UI Kit/Input",
  component: UIInput,
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
  decorators: [moduleMetadata({ imports: [DateAdapterStorySource] })]
} satisfies Meta<UIInput>;

export default meta;
type Story = StoryObj<UIInput>;

export const DateAdapter: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "The `DateTextAdapter` validates ISO 8601 date strings (`YYYY-MM-DD`). " +
        "It checks both format and calendar validity (e.g. rejects `2025-02-30`). " +
        "Shows a **calendar** prefix icon."
      }
    }
  },
  render: () => ({
      template: "<ui-date-adapter-story-demo />",
    })
};
