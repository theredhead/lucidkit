import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-without-submit-button-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./without-submit-button.story.html",
  styleUrl: "./without-submit-button.story.scss",
})
export class WithoutSubmitButtonStorySource {
  // Review required: this scaffold was generated from packages/ui-forms/src/lib/components/form.stories.ts.
}
