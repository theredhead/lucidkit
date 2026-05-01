import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIInput } from "../../input.component";

import { SlugAdapterStorySource } from "./slug-adapter.story";

const meta = {
  title: "@theredhead/UI Kit/Input",
  component: SlugAdapterStorySource,
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
  decorators: [moduleMetadata({ imports: [SlugAdapterStorySource] })]
} satisfies Meta<SlugAdapterStorySource>;

export default meta;
type Story = StoryObj<SlugAdapterStorySource>;

export const SlugAdapter: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "The `SlugTextAdapter` transforms input into a URL slug: lowercases, " +
        "replaces spaces/underscores with hyphens, strips special characters, " +
        "and collapses consecutive hyphens. Shows a **link** prefix icon."
      }
    }
  },
  render: () => ({
      template: "<ui-slug-adapter-story-demo />",
    })
};
