import { ChangeDetectionStrategy, Component, inject, output, signal } from "@angular/core";
import { UIButton } from "../../../button/button.component";
import { UIDialogFooter } from "../../dialog-footer.component";
import { UIDialogHeader } from "../../dialog-header.component";
import { ModalService } from "../../dialog.service";
import { ModalRef, type UIModalContent } from "../../dialog.types";

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
  selector: "ui-dialog-svc-outputs-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  styleUrl: "./service-outputs.story.scss",
  templateUrl: "./service-outputs.story.html",
})
export class ServiceOutputsDemo {
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
