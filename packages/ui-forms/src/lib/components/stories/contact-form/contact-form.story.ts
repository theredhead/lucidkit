import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-contact-form-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./contact-form.story.html",
  styleUrl: "./contact-form.story.scss",
})
export class ContactFormStorySource {
  // Review required: this scaffold was generated from packages/ui-forms/src/lib/components/form.stories.ts.
}
