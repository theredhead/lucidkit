import { Component, input, signal } from "@angular/core";
import { UIWizard } from "../../wizard.component";
import { UIWizardStep } from "../../wizard-step.component";

@Component({
  selector: "ui-story-wizard-validation",
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  templateUrl: "./with-validation.story.html",
})
export class ValidationWizardStory {
  /** Whether the wizard enforces sequential progression. */
  public readonly linear = input<boolean>(true);

  /** Whether to show the step indicator bar. */
  public readonly showStepIndicator = input<boolean>(true);

  /** Label for the Back button. */
  public readonly backLabel = input<string>("Back");

  /** Label for the Next button. */
  public readonly nextLabel = input<string>("Next");

  /** Label for the Finish button. */
  public readonly finishLabel = input<string>("Finish");

  /** Accessible label forwarded to the wizard. */
  public readonly ariaLabel = input<string>("Wizard");

  public readonly accepted = signal(false);

  public onComplete(): void {
    alert("Wizard completed with validation!");
  }
}
