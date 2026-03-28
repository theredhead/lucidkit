import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { Component, ChangeDetectionStrategy } from "@angular/core";

import { UIAccordion } from "./accordion.component";
import { UIAccordionItem } from "./accordion-item.component";

@Component({
  selector: "ui-accordion-single-demo",
  standalone: true,
  imports: [UIAccordion, UIAccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-accordion mode="single">
      <ui-accordion-item label="Getting Started">
        Follow the installation guide to add the library to your project. Run
        <code>npm install &#64;theredhead/ui-kit</code> to get started.
      </ui-accordion-item>
      <ui-accordion-item label="Configuration">
        Configure your theme by importing the SCSS mixin and applying it to your
        root stylesheet.
      </ui-accordion-item>
      <ui-accordion-item label="Components">
        Browse the full list of available components in the sidebar. Each
        component has interactive demos and API documentation.
      </ui-accordion-item>
      <ui-accordion-item label="Disabled Section" [disabled]="true">
        This section is not available yet.
      </ui-accordion-item>
    </ui-accordion>
  `,
})
class AccordionSingleDemo {}

@Component({
  selector: "ui-accordion-collapsible-demo",
  standalone: true,
  imports: [UIAccordion, UIAccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-accordion mode="single" [requireOpen]="false">
      <ui-accordion-item label="Getting Started">
        Follow the installation guide to add the library to your project.
      </ui-accordion-item>
      <ui-accordion-item label="Configuration">
        Configure your theme by importing the SCSS mixin.
      </ui-accordion-item>
      <ui-accordion-item label="Components">
        Browse the full list of available components.
      </ui-accordion-item>
    </ui-accordion>
  `,
})
class AccordionCollapsibleDemo {}

@Component({
  selector: "ui-accordion-multi-demo",
  standalone: true,
  imports: [UIAccordion, UIAccordionItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-accordion mode="multi">
      <ui-accordion-item label="Personal Information" [expanded]="true">
        Name, email, phone number, and other contact details.
      </ui-accordion-item>
      <ui-accordion-item label="Billing Address">
        Street address, city, state, zip code, and country.
      </ui-accordion-item>
      <ui-accordion-item label="Payment Method">
        Credit card, debit card, or bank transfer details.
      </ui-accordion-item>
    </ui-accordion>
  `,
})
class AccordionMultiDemo {}

const meta: Meta<UIAccordion> = {
  title: "@Theredhead/UI Kit/Accordion",
  component: UIAccordion,
  tags: ["autodocs"],
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
  parameters: {
    docs: {
      description: {
        component:
          "A collapsible content container for organising related sections " +
          "under expandable headers.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        AccordionSingleDemo,
        AccordionCollapsibleDemo,
        AccordionMultiDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIAccordion>;

/**
 * **Single-expand mode** — opening a panel automatically closes
 * the previously open one. The last item is disabled and cannot
 * be expanded. This is the default accordion behaviour.
 */
export const SingleMode: Story = {
  render: () => ({
    template: `<ui-accordion-single-demo />`,
  }),
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
          "| `disabled` | `UIAccordionItem` | Prevents expanding/collapsing |",
      },
      source: {
        code: `<ui-accordion mode="single">
  <ui-accordion-item label="Getting Started">
    Follow the installation guide to add the library to your project.
  </ui-accordion-item>
  <ui-accordion-item label="Configuration">
    Configure your theme by importing the SCSS mixin.
  </ui-accordion-item>
  <ui-accordion-item label="Components">
    Browse the full list of available components.
  </ui-accordion-item>
  <ui-accordion-item label="Disabled Section" [disabled]="true">
    This section is not available yet.
  </ui-accordion-item>
</ui-accordion>`,
        language: "html",
      },
    },
  },
};

/**
 * Single mode with `requireOpen` set to `false`. This allows all
 * panels to be collapsed simultaneously — clicking the open panel
 * again closes it without forcing another to open.
 */
export const SingleCollapsible: Story = {
  render: () => ({
    template: `<ui-accordion-collapsible-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-accordion mode="single" [requireOpen]="false">
  <ui-accordion-item label="Section 1">Content here.</ui-accordion-item>
  <ui-accordion-item label="Section 2">More content.</ui-accordion-item>
  <ui-accordion-item label="Section 3">Even more content.</ui-accordion-item>
</ui-accordion>`,
        language: "html",
      },
    },
  },
};

/**
 * **Multi-expand mode** — any number of panels can be open at the
 * same time. The first panel starts expanded via `[expanded]=\"true\"`.
 * This is useful for forms or settings where multiple sections are
 * relevant simultaneously.
 */
export const MultiMode: Story = {
  render: () => ({
    template: `<ui-accordion-multi-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-accordion mode="multi">
  <ui-accordion-item label="Personal Information" [expanded]="true">
    Name, email, phone number, and other contact details.
  </ui-accordion-item>
  <ui-accordion-item label="Billing Address">
    Street address, city, state, zip code, and country.
  </ui-accordion-item>
  <ui-accordion-item label="Payment Method">
    Credit card, debit card, or bank transfer details.
  </ui-accordion-item>
</ui-accordion>`,
        language: "html",
      },
    },
  },
};
