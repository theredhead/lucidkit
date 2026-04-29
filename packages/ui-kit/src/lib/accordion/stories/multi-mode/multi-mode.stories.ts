import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIAccordion } from "../../accordion.component";

import { AccordionMultiDemo } from "./multi-mode.story";

const meta = {
  title: "@theredhead/UI Kit/Accordion",
  component: UIAccordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A collapsible content container for organising related sections " +
          "under expandable headers.",
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "multi"],
      description:
        "Single: one panel at a time. Multi: multiple panels open simultaneously.",
    },
    requireOpen: {
      control: "boolean",
      description: "When true, at least one panel stays open (single mode).",
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire accordion.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the accordion.",
    },
  },
  decorators: [moduleMetadata({ imports: [AccordionMultiDemo] })]
} satisfies Meta<UIAccordion>;

export default meta;
type Story = StoryObj<UIAccordion>;

export const MultiMode: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-accordion-multi-demo />",
    })
};
