import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-wizard-form-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./wizard-form.story.html",
  styleUrl: "./wizard-form.story.scss",
})
export class WizardFormStorySource {
  // Review required: this scaffold was generated from packages/ui-forms/src/lib/components/form.stories.ts.
}
