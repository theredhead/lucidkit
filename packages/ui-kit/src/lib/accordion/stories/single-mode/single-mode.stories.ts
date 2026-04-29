import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIAccordion } from "../../accordion.component";

import { AccordionSingleDemo } from "./single-mode.story";

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
  decorators: [moduleMetadata({ imports: [AccordionSingleDemo] })]
} satisfies Meta<UIAccordion>;

export default meta;
type Story = StoryObj<UIAccordion>;

export const SingleMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
        "### Composition\n" +
        "`UIAccordion` wraps `UIAccordionItem` children. Each item has a " +
        "`label` and projects its body content.\n\n" +
        "### Modes\n" +
        "| Mode | Behaviour |\n" +
        "|------|-----------|\n" +
        "| `single` | Only one panel open at a time (default) |\n" +
        "| `multi` | Any number of panels can be open simultaneously |\n\n" +
        "### Key Inputs\n" +
        "| Input | Component | Description |\n" +
        "|-------|-----------|-------------|\n" +
        "| `mode` | `UIAccordion` | `'single'` or `'multi'` |\n" +
        "| `requireOpen` | `UIAccordion` | If `false`, all panels can be collapsed (single mode) |\n" +
        "| `label` | `UIAccordionItem` | Panel header text (required) |\n" +
        "| `expanded` | `UIAccordionItem` | Two-way model for open state |\n" +
        "| `disabled` | `UIAccordionItem` | Prevents expanding/collapsing |"
      }
    }
  },
  render: () => ({
      template: "<ui-accordion-single-demo />",
    })
};
