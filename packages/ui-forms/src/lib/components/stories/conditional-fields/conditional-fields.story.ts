import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-conditional-fields-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./conditional-fields.story.html",
  styleUrl: "./conditional-fields.story.scss",
})
export class ConditionalFieldsStorySource {
  // Review required: this scaffold was generated from packages/ui-forms/src/lib/components/form.stories.ts.
}
