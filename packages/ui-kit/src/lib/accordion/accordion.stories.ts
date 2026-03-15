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

/** Single-expand mode — only one panel open at a time. */
export const SingleMode: Story = {
  render: () => ({
    template: `<ui-accordion-single-demo />`,
  }),
};

/** Single mode with requireOpen=false — all panels can be collapsed. */
export const SingleCollapsible: Story = {
  render: () => ({
    template: `<ui-accordion-collapsible-demo />`,
  }),
};

/** Multi-expand mode — any number of panels can be open. */
export const MultiMode: Story = {
  render: () => ({
    template: `<ui-accordion-multi-demo />`,
  }),
};
