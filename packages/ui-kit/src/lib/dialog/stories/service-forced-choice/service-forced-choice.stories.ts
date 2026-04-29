import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ServiceForcedDemo } from "./service-forced-choice.story";

const meta = {
  title: "@theredhead/UI Kit/Dialog",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIDialog` supports two usage patterns: **declarative** (template-driven with `<ui-dialog>`) and **imperative** (service-based via `ModalService`).",
          "",
          "## Choosing between Declarative and Service-based",
          "",
          "Use the **declarative `<ui-dialog>`** when the dialog content is known at compile time and lives alongside its trigger in the same template. It offers simple two-way binding with `[(open)]` and content projection via `<ui-dialog-header>`, `<ui-dialog-body>`, and `<ui-dialog-footer>` slots.",
          "",
          "Use the **imperative `ModalService`** when you need to open a dialog dynamically — for example from a service, route guard, or when the content component is determined at runtime. It provides typed results via `ModalRef.closed`, programmatic input/output forwarding, and the ability to reuse dialog components across features.",
          "",
          "| Scenario | Recommended |",
          "|----------|-------------|",
          "| Content known at compile time, tied to a view | Declarative `<ui-dialog>` |",
          "| Template-driven open/close with `[(open)]` | Declarative `<ui-dialog>` |",
          "| Content determined at runtime | `ModalService` |",
          "| Opening from a service, guard, or resolver | `ModalService` |",
          "| Typed result observable needed | `ModalService` |",
          "| Reusable dialog across multiple features | `ModalService` |",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    closeOnBackdropClick: {
      control: "boolean",
      description: "Close when clicking the backdrop overlay.",
    },
    closeOnEscape: {
      control: "boolean",
      description: "Close on Escape key.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the dialog.",
    },
  },
  decorators: [moduleMetadata({ imports: [ServiceForcedDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ServiceForcedChoice: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-dialog-svc-forced-demo />",
    })
};
