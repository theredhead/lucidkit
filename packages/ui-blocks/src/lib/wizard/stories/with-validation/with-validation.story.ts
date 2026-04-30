import { Component, signal } from "@angular/core";
import { UIWizard } from "../../wizard.component";
import { UIWizardStep } from "../../wizard-step.component";

@Component({
  selector: "ui-story-wizard-validation",
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  templateUrl: "./with-validation.story.html",
})
export class ValidationWizardStory {
  public readonly accepted = signal(false);

  public onComplete(): void {
    alert("Wizard completed with validation!");
  }
}
