import { UIToastContainer } from "../../toast.component";
import { ToastService } from "../../toast.service";
import { UIButton } from "../../../button/button.component";

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

@Component({
  selector: "ui-all-severities-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToastContainer, UIButton],
  templateUrl: "./all-severities.story.html",
  styleUrl: "./all-severities.story.scss",
})
export class AllSeveritiesStorySource {
  private readonly toast = inject(ToastService);

  protected showInfo(): void {
    this.toast.info("This is an informational message.", { title: "Info" });
  }

  protected showSuccess(): void {
    this.toast.success("Operation completed successfully.", {
      title: "Success",
    });
  }

  protected showWarning(): void {
    this.toast.warning("Please review before continuing.", {
      title: "Warning",
    });
  }

  protected showError(): void {
    this.toast.error("Something went wrong. Please try again.", {
      title: "Error",
    });
  }
}
