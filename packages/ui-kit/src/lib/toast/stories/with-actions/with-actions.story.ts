import { UIToastContainer } from "../../toast.component";
import { ToastService } from "../../toast.service";
import { UIButton } from "../../../button/button.component";

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

@Component({
  selector: "ui-with-actions-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToastContainer, UIButton],
  templateUrl: "./with-actions.story.html",
  styleUrl: "./with-actions.story.scss",
})
export class WithActionsStorySource {
  private readonly toast = inject(ToastService);

  protected showWithUndo(): void {
    this.toast.info("Item deleted.", {
      title: "Deleted",
      actionLabel: "Undo",
      actionFn: () => this.toast.success("Deletion undone."),
    });
  }

  protected showWithRetry(): void {
    this.toast.error("Upload failed.", {
      title: "Error",
      actionLabel: "Retry",
      actionFn: () => this.toast.info("Retrying upload…"),
    });
  }

  protected showPersistent(): void {
    this.toast.warning("Your session expires in 5 minutes.", {
      title: "Session",
      duration: 0,
      actionLabel: "Extend",
      actionFn: () => this.toast.success("Session extended."),
    });
  }
}
