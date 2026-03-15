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
import { UIDialog } from "./dialog.component";
import { ModalService } from "./dialog.service";
import { ModalRef, type UIModalContent } from "./dialog.types";

// ════════════════════════════════════════════════════════════════════
//  Declarative demos  (UIDialog component with content projection)
// ════════════════════════════════════════════════════════════════════

@Component({
  selector: "ui-dialog-declarative-demo",
  standalone: true,
  imports: [UIDialog, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-button (click)="showDialog.set(true)">Open Declarative Dialog</ui-button>

    <ui-dialog [(open)]="showDialog" ariaLabel="Example dialog">
      <span ui-dialog-title>Hello Dialog</span>
      <p>
        This is a declarative dialog component built on the native
        <code>&lt;dialog&gt;</code> element.
      </p>
      <p>It supports projected header, body, and footer slots.</p>
      <div ui-dialog-footer>
        <ui-button variant="outlined" (click)="showDialog.set(false)"
          >Cancel</ui-button
        >
        <ui-button (click)="showDialog.set(false)">OK</ui-button>
      </div>
    </ui-dialog>
  `,
})
class DeclarativeDemo {
  public readonly showDialog = signal(false);
}

@Component({
  selector: "ui-dialog-persistent-demo",
  standalone: true,
  imports: [UIDialog, UIButton],
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
      <span ui-dialog-title>Persistent Dialog</span>
      <p>
        Clicking the backdrop won't close this dialog. You must use the button
        below.
      </p>
      <div ui-dialog-footer>
        <ui-button (click)="showDialog.set(false)">Got it</ui-button>
      </div>
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
  imports: [UIButton],
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
    <header class="dlg-header">{{ title() }}</header>
    <div class="dlg-body">
      <p style="margin: 0; opacity: 0.75; line-height: 1.5;">{{ message() }}</p>
    </div>
    <footer class="dlg-footer">
      <ui-button variant="ghost" (click)="modalRef.close(false)"
        >Cancel</ui-button
      >
      <ui-button variant="filled" (click)="modalRef.close(true)"
        >Confirm</ui-button
      >
    </footer>
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
  imports: [UIButton, UIInput],
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
    <header class="dlg-header">{{ title() }}</header>
    <div class="dlg-body">
      <ui-input
        [placeholder]="fieldPlaceholder()"
        [(value)]="fieldValue"
        ariaLabel="Name input"
      />
    </div>
    <footer class="dlg-footer">
      <ui-button variant="ghost" (click)="modalRef.close()">Cancel</ui-button>
      <ui-button variant="filled" (click)="modalRef.close(fieldValue())"
        >Save</ui-button
      >
    </footer>
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
  imports: [UIButton],
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
    <header class="dlg-header">Choose an option</header>
    <footer class="dlg-footer">
      <ui-button variant="ghost" (click)="pick('A')">Option A</ui-button>
      <ui-button variant="outlined" (click)="pick('B')">Option B</ui-button>
      <ui-button variant="filled" (click)="pick('C')">Option C</ui-button>
    </footer>
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
    background: var(--tv-surface-2, #fbfbfc);
    color: var(--tv-text, #1d232b);
    border: 1px solid var(--tv-border, #d7dce2);
    border-radius: 4px;
    font-family: var(--tv-font, monospace);
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
  title: "@theredhead/UI Kit/Dialog",
  tags: ["autodocs"],
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

/** Declarative dialog with projected header / body / footer slots. */
export const Declarative: Story = {
  render: () => ({
    template: `<ui-dialog-declarative-demo />`,
  }),
};

/** Declarative dialog that cannot be closed by clicking the backdrop. */
export const DeclarativePersistent: Story = {
  render: () => ({
    template: `<ui-dialog-persistent-demo />`,
  }),
};

// ── Service-based (imperative) ─────────────────────────────────────

/** Basic confirm dialog opened via `ModalService.openModal()`. */
export const ServiceConfirm: Story = {
  render: () => ({
    template: `<ui-dialog-svc-basic-demo />`,
  }),
};

/** Confirm dialog with custom title and message passed as inputs. */
export const ServiceCustomInputs: Story = {
  render: () => ({
    template: `<ui-dialog-svc-custom-demo />`,
  }),
};

/** Form dialog that returns a string value on save. */
export const ServiceForm: Story = {
  render: () => ({
    template: `<ui-dialog-svc-form-demo />`,
  }),
};

/** Dialog demonstrating output handler wiring via `outputs` config. */
export const ServiceOutputs: Story = {
  render: () => ({
    template: `<ui-dialog-svc-outputs-demo />`,
  }),
};

/**
 * Dialog that cannot be dismissed by Escape or backdrop click —
 * the user must explicitly choose a button.
 */
export const ServiceForcedChoice: Story = {
  render: () => ({
    template: `<ui-dialog-svc-forced-demo />`,
  }),
};
