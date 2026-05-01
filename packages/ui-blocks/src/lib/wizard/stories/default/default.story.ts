import { Component, input } from "@angular/core";
import { UIWizard } from "../../wizard.component";
import { UIWizardStep } from "../../wizard-step.component";

@Component({
  selector: "ui-story-wizard-basic",
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  templateUrl: "./default.story.html",
})
export class BasicWizardStory {
  public readonly linear = input(false);
  public readonly showStepIndicator = input(true);
  public readonly backLabel = input("Back");
  public readonly nextLabel = input("Next");
  public readonly finishLabel = input("Finish");
  public readonly ariaLabel = input("Wizard");

  public onComplete(): void {
    alert("Wizard completed!");
  }
}
