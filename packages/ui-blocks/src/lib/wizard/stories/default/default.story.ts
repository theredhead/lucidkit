import { Component } from "@angular/core";
import { UIWizard } from "../../wizard.component";
import { UIWizardStep } from "../../wizard-step.component";

@Component({
  selector: "ui-story-wizard-basic",
  standalone: true,
  imports: [UIWizard, UIWizardStep],
  templateUrl: "./default.story.html",
})
export class BasicWizardStory {
  public onComplete(): void {
    alert("Wizard completed!");
  }
}
