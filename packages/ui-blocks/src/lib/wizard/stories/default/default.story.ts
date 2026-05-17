import { Component, input, signal } from "@angular/core";
import {
  UIButton,
  UIDialog,
  UIDialogBody,
  UIDialogFooter,
  UIDialogHeader,
  UIInput,
} from "@theredhead/lucid-kit";
import { UIWizard } from "../../wizard.component";
import { UIWizardStep } from "../../wizard-step.component";

@Component({
  selector: "ui-story-wizard-basic",
  standalone: true,
  imports: [
    UIWizard,
    UIWizardStep,
    UIInput,
    UIDialog,
    UIDialogHeader,
    UIDialogBody,
    UIDialogFooter,
    UIButton,
  ],
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
  protected readonly showResult = signal(false);

  public onComplete(): void {
    this.showResult.set(true);
  }
}
