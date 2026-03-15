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
import { ModalService } from "./modal.service";
import { ModalRef, type UIModalContent } from "./modal.types";

// ── Dialog content components (used inside the modal) ──────────────

/** Simple confirm dialog returning a boolean result. */
@Component({
  selector: "ui-story-confirm-dialog",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [
    `
      :host {
        display: block;
        padding: 1.5rem;
        min-width: 22rem;
      }
      .modal-title {
        margin: 0 0 0.5rem;
        font-size: 1.125rem;
        font-weight: 600;
      }
      .modal-body {
        margin: 0 0 1.5rem;
        line-height: 1.5;
        opacity: 0.75;
      }
      .modal-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }
    `,
  ],
  template: `
    <h2 class="modal-title">{{ title() }}</h2>
    <p class="modal-body">{{ message() }}</p>
    <div class="modal-actions">
      <ui-button variant="ghost" (click)="modalRef.close(false)"
        >Cancel</ui-button
      >
      <ui-button variant="filled" (click)="modalRef.close(true)"
        >Confirm</ui-button
      >
    </div>
  `,
})
class StoryConfirmDialog implements UIModalContent<boolean> {
  readonly modalRef = inject(ModalRef<boolean>);
  readonly title = input("Confirm Action");
  readonly message = input("Are you sure you want to proceed?");
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
        display: block;
        padding: 1.5rem;
        min-width: 24rem;
      }
      .modal-title {
        margin: 0 0 1rem;
        font-size: 1.125rem;
        font-weight: 600;
      }
      .modal-field {
        margin: 1rem 0 1.5rem;
      }
      .modal-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }
    `,
  ],
  template: `
    <h2 class="modal-title">{{ title() }}</h2>
    <div class="modal-field">
      <ui-input
        [placeholder]="fieldPlaceholder()"
        [(value)]="fieldValue"
        ariaLabel="Name input"
      />
    </div>
    <div class="modal-actions">
      <ui-button variant="ghost" (click)="modalRef.close()">Cancel</ui-button>
      <ui-button variant="filled" (click)="modalRef.close(fieldValue())"
        >Save</ui-button
      >
    </div>
  `,
})
class StoryFormDialog implements UIModalContent<string> {
  readonly modalRef = inject(ModalRef<string>);
  readonly title = input("Enter Details");
  readonly fieldPlaceholder = input("Type here…");
  readonly fieldValue = signal("");
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
        display: block;
        padding: 1.5rem;
        min-width: 22rem;
      }
      .modal-title {
        margin: 0 0 1rem;
        font-size: 1.125rem;
        font-weight: 600;
      }
      .modal-actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }
    `,
  ],
  template: `
    <h2 class="modal-title">Choose an option</h2>
    <div class="modal-actions">
      <ui-button variant="ghost" (click)="pick('A')">Option A</ui-button>
      <ui-button variant="outlined" (click)="pick('B')">Option B</ui-button>
      <ui-button variant="filled" (click)="pick('C')">Option C</ui-button>
    </div>
  `,
})
class StoryOutputDialog implements UIModalContent {
  readonly modalRef = inject(ModalRef);
  readonly chosen = output<string>();

  pick(option: string): void {
    this.chosen.emit(option);
    this.modalRef.close(option);
  }
}

// ── Demo wrapper components (render a button + result) ─────────────

@Component({
  selector: "ui-modal-basic-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
  template: `
    <ui-button (click)="open()">Open Confirm Dialog</ui-button>
    @if (lastResult() !== undefined) {
      <div class="story-output">
        <strong>Result:</strong> {{ lastResult() }}
      </div>
    }
  `,
})
class BasicDemo {
  private readonly modal = inject(ModalService);
  protected readonly lastResult = signal<boolean | undefined>(undefined);

  open(): void {
    this.modal
      .openModal<StoryConfirmDialog, boolean>({
        component: StoryConfirmDialog,
      })
      .closed.subscribe((r) => this.lastResult.set(r));
  }
}

@Component({
  selector: "ui-modal-custom-inputs-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
  template: `
    <ui-button (click)="open()">Delete Item</ui-button>
    @if (lastResult() !== undefined) {
      <div class="story-output">
        <strong>Confirmed:</strong> {{ lastResult() }}
      </div>
    }
  `,
})
class CustomInputsDemo {
  private readonly modal = inject(ModalService);
  protected readonly lastResult = signal<boolean | undefined>(undefined);

  open(): void {
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
  selector: "ui-modal-form-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
  template: `
    <ui-button (click)="open()">Rename Item</ui-button>
    @if (lastResult() !== undefined) {
      <div class="story-output">
        <strong>Saved name:</strong> "{{ lastResult() }}"
      </div>
    }
  `,
})
class FormDemo {
  private readonly modal = inject(ModalService);
  protected readonly lastResult = signal<string | undefined>(undefined);

  open(): void {
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
  selector: "ui-modal-outputs-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
  template: `
    <ui-button (click)="open()">Choose Option</ui-button>
    @if (outputResult()) {
      <div class="story-output">
        <strong>Output handler received:</strong> "{{ outputResult() }}"
      </div>
    }
  `,
})
class OutputsDemo {
  private readonly modal = inject(ModalService);
  protected readonly outputResult = signal<string | undefined>(undefined);

  open(): void {
    this.modal.openModal<StoryOutputDialog, string>({
      component: StoryOutputDialog,
      outputs: {
        chosen: (value: string) => this.outputResult.set(value),
      },
    });
  }
}

@Component({
  selector: "ui-modal-forced-choice-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styles: [
    `
      :host {
        display: block;
        max-width: 400px;
      }
      .story-output {
        margin-top: 1rem;
        font-size: 0.8125rem;
        padding: 0.75rem;
        background: var(--tv-surface-2, #fbfbfc);
        color: var(--tv-text, #1d232b);
        border: 1px solid var(--tv-border, #d7dce2);
        border-radius: 4px;
        font-family: var(--tv-font, monospace);
        overflow-x: auto;
      }
    `,
  ],
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
class ForcedChoiceDemo {
  private readonly modal = inject(ModalService);
  protected readonly lastResult = signal<boolean | undefined>(undefined);

  open(): void {
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

// ── Storybook meta & stories ───────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Kit/Modal",
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        BasicDemo,
        CustomInputsDemo,
        FormDemo,
        OutputsDemo,
        ForcedChoiceDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/** Basic confirm dialog opened via `ModalService.openModal()`. */
export const Default: Story = {
  render: () => ({
    template: `<ui-modal-basic-demo />`,
  }),
};

/** Confirm dialog with custom title and message passed as inputs. */
export const WithCustomInputs: Story = {
  render: () => ({
    template: `<ui-modal-custom-inputs-demo />`,
  }),
};

/** Form dialog that returns a string value on save. */
export const FormDialog: Story = {
  render: () => ({
    template: `<ui-modal-form-demo />`,
  }),
};

/** Dialog demonstrating output handler wiring via `outputs` config. */
export const WithOutputs: Story = {
  render: () => ({
    template: `<ui-modal-outputs-demo />`,
  }),
};

/**
 * Dialog that cannot be dismissed by Escape or backdrop click —
 * the user must explicitly choose a button.
 */
export const ForcedChoice: Story = {
  render: () => ({
    template: `<ui-modal-forced-choice-demo />`,
  }),
};
