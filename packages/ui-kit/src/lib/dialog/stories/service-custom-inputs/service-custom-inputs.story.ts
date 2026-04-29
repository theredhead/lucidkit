import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from "@angular/core";

import { UIButton } from "../../../button/button.component";
import { UIInput } from "../../../input/input.component";
import { UIDialogBody } from "../../dialog-body.component";
import { UIDialogFooter } from "../../dialog-footer.component";
import { UIDialogHeader } from "../../dialog-header.component";
import { UIDialog } from "../../dialog.component";
import { ModalService } from "../../dialog.service";
import { ModalRef, type UIModalContent } from "../../dialog.types";

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
  selector: "ui-dialog-svc-custom-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styleUrl: "./service-custom-inputs.story.scss",
  templateUrl: "./service-custom-inputs.story.html",
})
export class ServiceCustomDemo {
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
