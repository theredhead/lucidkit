import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { PlaygroundStorySource } from "./playground.story";

const meta = {
  title: "@theredhead/UI Kit/File Upload",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIFileUpload` provides a drag-and-drop zone with a click-to-browse fallback for selecting files. It supports file-type filtering, size limits, single or multi-file selection, and a two-way `files` model.",
      },
    },
  },
  argTypes: {
    accept: {
      control: "text",
      description:
        "Accepted file types (MIME or extension, e.g. `image/*`, `.pdf,.docx`).",
    },
    multiple: {
      control: "boolean",
      description: "Allow selecting multiple files.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the upload zone.",
    },
    label: {
      control: "text",
      description: "Label text displayed inside the drop zone.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
    },
  },
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    accept: "",
    multiple: false,
    disabled: false,
    label: "Drop files here or click to browse",
    ariaLabel: "Upload file",
  },
  render: (args) => ({
    props: args,
    template: `<ui-file-upload
      [accept]="accept"
      [multiple]="multiple"
      [disabled]="disabled"
      [label]="label"
      [ariaLabel]="ariaLabel"
    />`,
  })
};
