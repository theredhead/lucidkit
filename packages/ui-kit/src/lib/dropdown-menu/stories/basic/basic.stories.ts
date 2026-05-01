import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { BasicStorySource } from "./basic.story";

const meta = {
  title: "@theredhead/UI Kit/Dropdown Menu",
  component: BasicStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dropdown action menu triggered by a button or custom element.",
      },
    },
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "end"],
      description: "Horizontal alignment of the menu relative to the trigger.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the menu.",
    },
    edit: {
      action: "edit",
      description: "Emitted when the Edit item is clicked.",
    },
    duplicate: {
      action: "duplicate",
      description: "Emitted when the Duplicate item is clicked.",
    },
    archive: {
      action: "archive",
      description: "Emitted when the Archive item is clicked.",
    },
  },
  decorators: [moduleMetadata({ imports: [BasicStorySource] })],
} satisfies Meta<BasicStorySource>;

export default meta;
type Story = StoryObj<BasicStorySource>;

export const Basic: Story = {
  args: {
    align: "start",
    ariaLabel: "Menu",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `<ui-basic-story-demo
      [align]="align"
      [ariaLabel]="ariaLabel"
      (edit)="edit($event)"
      (duplicate)="duplicate($event)"
      (archive)="archive($event)"
    />`,
  }),
};
