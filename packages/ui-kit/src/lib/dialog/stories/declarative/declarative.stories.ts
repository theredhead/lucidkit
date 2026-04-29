import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DeclarativeDemo } from "./declarative.story";

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
  decorators: [moduleMetadata({ imports: [DeclarativeDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Declarative: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          "## Declarative (Template-driven)",
          "",
          "Place `<ui-dialog>` in your template with projected `<ui-dialog-header>`, `<ui-dialog-body>`, and `<ui-dialog-footer>` slots. Control visibility via `[(open)]` two-way binding.",
          "",
          "## Imperative (Service-based)",
          "",
          "Inject `ModalService` and call `openModal<T, R>()` with a component, optional `inputs`/`outputs`, and subscribe to `closed` for the result.",
          "",
          "## Key Features",
          "",
          "- **Backdrop** — modal backdrop with optional `closeOnBackdropClick`",
          "- **Escape key** — configurable `closeOnEscape` (default `true`)",
          "- **Typed results** — `ref.closed` emits `R | undefined` when the dialog closes",
          "- **Input/output forwarding** — pass component inputs and wire outputs via config",
          "- **Forced choice** — disable both escape and backdrop click to require an explicit button press",
          "",
          "## ModalConfig",
          "",
          "| Option | Type | Default | Description |",
          "|--------|------|---------|-------------|",
          "| `component` | `Type<T>` | *(required)* | The Angular component to render inside the dialog |",
          "| `inputs` | `Record<string, any>` | — | Input bindings forwarded to the component |",
          "| `outputs` | `Record<string, Function>` | — | Output handlers wired to the component |",
          "| `closeOnEscape` | `boolean` | `true` | Allow closing with the Escape key |",
          "| `closeOnBackdropClick` | `boolean` | `true` | Allow closing by clicking the backdrop |",
          "| `ariaLabel` | `string` | — | Accessible label for the dialog |",
          "",
          "**CSS custom properties** — `--ui-surface`, `--ui-text`, `--ui-border`, `--ui-accent`",
        ].join("\n")
      }
    }
  },
  render: () => ({
      template: "<ui-dialog-declarative-demo />",
    })
};
