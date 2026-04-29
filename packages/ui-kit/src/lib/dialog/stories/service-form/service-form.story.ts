import { ChangeDetectionStrategy, Component, inject, input, signal } from "@angular/core";
import { UIButton } from "../../../button/button.component";
import { UIInput } from "../../../input/input.component";
import { UIDialogBody } from "../../dialog-body.component";
import { UIDialogFooter } from "../../dialog-footer.component";
import { UIDialogHeader } from "../../dialog-header.component";
import { ModalService } from "../../dialog.service";
import { ModalRef, type UIModalContent } from "../../dialog.types";

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
  selector: "ui-dialog-svc-form-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styleUrl: "./service-form.story.scss",
  templateUrl: "./service-form.story.html",
})
export class ServiceFormDemo {
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
