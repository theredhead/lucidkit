import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-validation-demo-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./validation-demo.story.html",
  styleUrl: "./validation-demo.story.scss",
})
export class ValidationDemoStorySource {
  // Review required: this scaffold was generated from packages/ui-forms/src/lib/components/form.stories.ts.
}
