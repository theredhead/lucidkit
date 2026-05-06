import { Component, input, signal } from "@angular/core";
import { UIInput } from "@theredhead/lucid-kit";
import { UIWizard } from "../../wizard.component";
import { UIWizardStep } from "../../wizard-step.component";

@Component({
  selector: "ui-story-wizard-basic",
  standalone: true,
  imports: [UIWizard, UIWizardStep, UIInput],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class BasicWizardStory {
  public readonly linear = input(false);
  public readonly showStepIndicator = input(true);
  public readonly backLabel = input("Back");
  public readonly nextLabel = input("Next");
  public readonly finishLabel = input("Finish");
  public readonly ariaLabel = input("Wizard");

  protected readonly email = signal("");
  protected readonly password = signal("");
  protected readonly displayName = signal("");

  public onComplete(): void {
    alert("Wizard completed!");
  }
}
