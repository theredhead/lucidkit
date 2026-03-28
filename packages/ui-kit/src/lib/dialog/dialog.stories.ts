import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIButton } from "../button/button.component";
import { UIInput } from "../input/input.component";
import { UIDialogBody } from "./dialog-body.component";
import { UIDialogFooter } from "./dialog-footer.component";
import { UIDialogHeader } from "./dialog-header.component";
import { UIDialog } from "./dialog.component";
import { ModalService } from "./dialog.service";
import { ModalRef, type UIModalContent } from "./dialog.types";

// ════════════════════════════════════════════════════════════════════
//  Declarative demos  (UIDialog component with content projection)
// ════════════════════════════════════════════════════════════════════

@Component({
  selector: "ui-dialog-declarative-demo",
  standalone: true,
  imports: [UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button (click)="showDialog.set(true)"
      >Open Declarative Dialog</ui-button
    >

    <ui-dialog [(open)]="showDialog" ariaLabel="Example dialog">
      <ui-dialog-header>Hello Dialog</ui-dialog-header>
      <ui-dialog-body>
        <p>
          This is a declarative dialog component built on the native
          <code>&lt;dialog&gt;</code> element.
        </p>
        <p>It supports projected header, body, and footer slots.</p>
      </ui-dialog-body>
      <ui-dialog-footer>
        <ui-button variant="outlined" (click)="showDialog.set(false)"
          >Cancel</ui-button
        >
        <ui-button (click)="showDialog.set(false)">OK</ui-button>
      </ui-dialog-footer>
    </ui-dialog>
  `,
})
class DeclarativeDemo {
  public readonly showDialog = signal(false);
}

@Component({
  selector: "ui-dialog-persistent-demo",
  standalone: true,
  imports: [UIDialog, UIDialogHeader, UIDialogBody, UIDialogFooter, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button (click)="showDialog.set(true)"
      >Open (no backdrop close)</ui-button
    >

    <ui-dialog
      [(open)]="showDialog"
      [closeOnBackdropClick]="false"
      ariaLabel="Persistent dialog"
    >
      <ui-dialog-header>Persistent Dialog</ui-dialog-header>
      <ui-dialog-body>
        <p>
          Clicking the backdrop won't close this dialog. You must use the button
          below.
        </p>
      </ui-dialog-body>
      <ui-dialog-footer>
        <ui-button (click)="showDialog.set(false)">Got it</ui-button>
      </ui-dialog-footer>
    </ui-dialog>
  `,
})
class PersistentDemo {
  public readonly showDialog = signal(false);
}

// ════════════════════════════════════════════════════════════════════
//  Service demos  (ModalService + dynamic component)
// ════════════════════════════════════════════════════════════════════

/** Simple confirm dialog returning a boolean result. */
@Component({
  selector: "ui-story-confirm-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton, UIDialogHeader, UIDialogBody, UIDialogFooter],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-width: 22rem;
      }
    `,
  ],
  template: `
    <ui-dialog-header>{{ title() }}</ui-dialog-header>
    <ui-dialog-body>
      <p style="margin: 0; opacity: 0.75; line-height: 1.5;">{{ message() }}</p>
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button variant="ghost" (click)="modalRef.close(false)"
        >Cancel</ui-button
      >
      <ui-button variant="filled" (click)="modalRef.close(true)"
        >Confirm</ui-button
      >
    </ui-dialog-footer>
  `,
})
class StoryConfirmDialog implements UIModalContent<boolean> {
  public readonly modalRef = inject(ModalRef<boolean>);
  public readonly title = input("Confirm Action");
  public readonly message = input("Are you sure you want to proceed?");
}

/** Form dialog returning a string result. */
@Component({
  selector: "ui-story-form-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton, UIInput, UIDialogHeader, UIDialogBody, UIDialogFooter],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-width: 24rem;
      }
    `,
  ],
  template: `
    <ui-dialog-header>{{ title() }}</ui-dialog-header>
    <ui-dialog-body>
      <ui-input
        [placeholder]="fieldPlaceholder()"
        [(value)]="fieldValue"
        ariaLabel="Name input"
      />
    </ui-dialog-body>
    <ui-dialog-footer>
      <ui-button variant="ghost" (click)="modalRef.close()">Cancel</ui-button>
      <ui-button variant="filled" (click)="modalRef.close(fieldValue())"
        >Save</ui-button
      >
    </ui-dialog-footer>
  `,
})
class StoryFormDialog implements UIModalContent<string> {
  public readonly modalRef = inject(ModalRef<string>);
  public readonly title = input("Enter Details");
  public readonly fieldPlaceholder = input("Type here…");
  public readonly fieldValue = signal("");
}

/** Dialog that emits an output event before closing. */
@Component({
  selector: "ui-story-output-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton, UIDialogHeader, UIDialogFooter],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-width: 22rem;
      }
    `,
  ],
  template: `
    <ui-dialog-header>Choose an option</ui-dialog-header>
    <ui-dialog-footer>
      <ui-button variant="ghost" (click)="pick('A')">Option A</ui-button>
      <ui-button variant="outlined" (click)="pick('B')">Option B</ui-button>
      <ui-button variant="filled" (click)="pick('C')">Option C</ui-button>
    </ui-dialog-footer>
  `,
})
class StoryOutputDialog implements UIModalContent {
  public readonly modalRef = inject(ModalRef);
  public readonly chosen = output<string>();

  public pick(option: string): void {
    this.chosen.emit(option);
    this.modalRef.close(option);
  }
}

// ── Service demo wrappers ──────────────────────────────────────────

const storyOutputStyles = `
  :host { display: block; max-width: 400px; }
  .story-output {
    margin-top: 1rem; font-size: 0.8125rem; padding: 0.75rem;
    background: var(--ui-surface-2, #fbfbfc);
    color: var(--ui-text, #1d232b);
    border: 1px solid var(--ui-border, #d7dce2);
    border-radius: 4px;
    font-family: var(--ui-font, monospace);
    overflow-x: auto;
  }
`;

@Component({
  selector: "ui-dialog-svc-basic-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [storyOutputStyles],
  template: `
    <ui-button (click)="open()">Open Confirm Dialog</ui-button>
    @if (lastResult() !== undefined) {
      <div class="story-output">
        <strong>Result:</strong> {{ lastResult() }}
      </div>
    }
  `,
})
class ServiceBasicDemo {
  private readonly modal = inject(ModalService);
  protected readonly lastResult = signal<boolean | undefined>(undefined);

  protected open(): void {
    this.modal
      .openModal<StoryConfirmDialog, boolean>({
        component: StoryConfirmDialog,
      })
      .closed.subscribe((r) => this.lastResult.set(r));
  }
}

@Component({
  selector: "ui-dialog-svc-custom-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [storyOutputStyles],
  template: `
    <ui-button (click)="open()">Delete Item</ui-button>
    @if (lastResult() !== undefined) {
      <div class="story-output">
        <strong>Confirmed:</strong> {{ lastResult() }}
      </div>
    }
  `,
})
class ServiceCustomDemo {
  private readonly modal = inject(ModalService);
  protected readonly lastResult = signal<boolean | undefined>(undefined);

  protected open(): void {
    this.modal
      .openModal<StoryConfirmDialog, boolean>({
        component: StoryConfirmDialog,
        inputs: {
          title: "Delete Item?",
          message:
            "This will permanently remove the item and all associated data. This action cannot be undone.",
        },
        ariaLabel: "Confirm deletion",
      })
      .closed.subscribe((r) => this.lastResult.set(r));
  }
}

@Component({
  selector: "ui-dialog-svc-form-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [storyOutputStyles],
  template: `
    <ui-button (click)="open()">Rename Item</ui-button>
    @if (lastResult() !== undefined) {
      <div class="story-output">
        <strong>Saved name:</strong> "{{ lastResult() }}"
      </div>
    }
  `,
})
class ServiceFormDemo {
  private readonly modal = inject(ModalService);
  protected readonly lastResult = signal<string | undefined>(undefined);

  protected open(): void {
    this.modal
      .openModal<StoryFormDialog, string>({
        component: StoryFormDialog,
        inputs: {
          title: "Rename Item",
          fieldPlaceholder: "Enter new name…",
        },
        ariaLabel: "Rename item",
      })
      .closed.subscribe((r) => this.lastResult.set(r));
  }
}

@Component({
  selector: "ui-dialog-svc-outputs-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [storyOutputStyles],
  template: `
    <ui-button (click)="open()">Choose Option</ui-button>
    @if (outputResult()) {
      <div class="story-output">
        <strong>Output handler received:</strong> "{{ outputResult() }}"
      </div>
    }
  `,
})
class ServiceOutputsDemo {
  private readonly modal = inject(ModalService);
  protected readonly outputResult = signal<string | undefined>(undefined);

  protected open(): void {
    this.modal.openModal<StoryOutputDialog, string>({
      component: StoryOutputDialog,
      outputs: {
        chosen: (value: string) => this.outputResult.set(value),
      },
    });
  }
}

@Component({
  selector: "ui-dialog-svc-forced-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [storyOutputStyles],
  template: `
    <ui-button (click)="open()">Open Forced-Choice Dialog</ui-button>
    <p style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.7;">
      Escape and backdrop click are disabled — you must choose a button.
    </p>
    @if (lastResult() !== undefined) {
      <div class="story-output">
        <strong>Result:</strong> {{ lastResult() }}
      </div>
    }
  `,
})
class ServiceForcedDemo {
  private readonly modal = inject(ModalService);
  protected readonly lastResult = signal<boolean | undefined>(undefined);

  protected open(): void {
    this.modal
      .openModal<StoryConfirmDialog, boolean>({
        component: StoryConfirmDialog,
        inputs: {
          title: "Unsaved Changes",
          message: "You have unsaved changes. Do you want to discard them?",
        },
        closeOnEscape: false,
        closeOnBackdropClick: false,
        ariaLabel: "Unsaved changes warning",
      })
      .closed.subscribe((r) => this.lastResult.set(r));
  }
}

// ════════════════════════════════════════════════════════════════════
//  Storybook meta & stories
// ════════════════════════════════════════════════════════════════════

const meta: Meta = {
  title: "@Theredhead/UI Kit/Dialog",
  tags: ["autodocs"],
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
  decorators: [
    moduleMetadata({
      imports: [
        DeclarativeDemo,
        PersistentDemo,
        ServiceBasicDemo,
        ServiceCustomDemo,
        ServiceFormDemo,
        ServiceOutputsDemo,
        ServiceForcedDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj;

// ── Declarative ────────────────────────────────────────────────────

/**
 * **Declarative** — Template-driven dialog using `<ui-dialog>` with
 * projected header, body, and footer slots. Visibility is controlled
 * via the `[(open)]` two-way binding.
 */
export const Declarative: Story = {
  render: () => ({
    template: `<ui-dialog-declarative-demo />`,
  }),
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
        ].join("\n"),
      },
      source: {
        code: `<ui-button (click)="showDialog.set(true)">Open Dialog</ui-button>

<ui-dialog [(open)]="showDialog" ariaLabel="Example dialog">
  <ui-dialog-header>Hello Dialog</ui-dialog-header>
  <ui-dialog-body>
    <p>Dialog body content goes here.</p>
  </ui-dialog-body>
  <ui-dialog-footer>
    <ui-button variant="outlined" (click)="showDialog.set(false)">Cancel</ui-button>
    <ui-button (click)="showDialog.set(false)">OK</ui-button>
  </ui-dialog-footer>
</ui-dialog>

<!-- readonly showDialog = signal(false); -->`,
        language: "html",
      },
    },
  },
};

/**
 * **Declarative persistent** — Same as above but with
 * `[closeOnBackdropClick]="false"`. Clicking the backdrop does not close
 * the dialog — the user must explicitly click the button.
 */
export const DeclarativePersistent: Story = {
  render: () => ({
    template: `<ui-dialog-persistent-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-dialog
  [(open)]="showDialog"
  [closeOnBackdropClick]="false"
  ariaLabel="Persistent dialog">
  <ui-dialog-header>Persistent Dialog</ui-dialog-header>
  <ui-dialog-body>
    <p>Clicking the backdrop will not close this dialog.</p>
  </ui-dialog-body>
  <ui-dialog-footer>
    <ui-button (click)="showDialog.set(false)">Got it</ui-button>
  </ui-dialog-footer>
</ui-dialog>

<!-- readonly showDialog = signal(false); -->`,
        language: "html",
      },
    },
  },
};

// ── Service-based (imperative) ─────────────────────────────────────

/**
 * **Service confirm** — Opens a confirmation dialog imperatively via
 * `ModalService.openModal()`. The `closed` observable emits `true`
 * (confirmed) or `undefined` (dismissed).
 */
export const ServiceConfirm: Story = {
  render: () => ({
    template: `<ui-dialog-svc-basic-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `private readonly modal = inject(ModalService);

this.modal
  .openModal<ConfirmDialog, boolean>({
    component: ConfirmDialog,
  })
  .closed.subscribe((confirmed) => {
    if (confirmed) { /* handle confirmation */ }
  });`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Service with custom inputs** — Demonstrates forwarding `inputs` to the
 * dialog component via the modal config. The title and message are set
 * dynamically rather than hard-coded in the component.
 */
export const ServiceCustomInputs: Story = {
  render: () => ({
    template: `<ui-dialog-svc-custom-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `this.modal
  .openModal<ConfirmDialog, boolean>({
    component: ConfirmDialog,
    inputs: {
      title: 'Delete Item?',
      message: 'This will permanently remove the item. This action cannot be undone.',
    },
    ariaLabel: 'Confirm deletion',
  })
  .closed.subscribe((confirmed) => {
    if (confirmed) { /* handle deletion */ }
  });`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Service form** — A dialog containing a text input that returns the
 * entered value on save. Demonstrates how `ref.close(value)` passes
 * a typed result back to the caller.
 */
export const ServiceForm: Story = {
  render: () => ({
    template: `<ui-dialog-svc-form-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `this.modal
  .openModal<FormDialog, string>({
    component: FormDialog,
    inputs: {
      title: 'Rename Item',
      fieldPlaceholder: 'Enter new name…',
    },
    ariaLabel: 'Rename item',
  })
  .closed.subscribe((name) => {
    if (name) { /* use saved name */ }
  });`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Service with outputs** — Wires component outputs via the `outputs`
 * config option. The dialog component emits events and the caller
 * handles them without needing `ref.closed`.
 */
export const ServiceOutputs: Story = {
  render: () => ({
    template: `<ui-dialog-svc-outputs-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `this.modal.openModal<OptionDialog, string>({
  component: OptionDialog,
  outputs: {
    chosen: (value: string) => console.log('Chosen:', value),
  },
});`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Forced choice** — Both `closeOnEscape` and `closeOnBackdropClick` are
 * disabled. The user must explicitly choose one of the dialog buttons.
 * Ideal for unsaved-changes warnings or destructive-action confirmations.
 */
export const ServiceForcedChoice: Story = {
  render: () => ({
    template: `<ui-dialog-svc-forced-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        code: `this.modal
  .openModal<ConfirmDialog, boolean>({
    component: ConfirmDialog,
    inputs: {
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Do you want to discard them?',
    },
    closeOnEscape: false,
    closeOnBackdropClick: false,
    ariaLabel: 'Unsaved changes warning',
  })
  .closed.subscribe((result) => {
    if (result) { /* discard changes */ }
  });`,
        language: "typescript",
      },
    },
  },
};
