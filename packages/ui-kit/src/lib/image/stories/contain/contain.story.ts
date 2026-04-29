import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-contain-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./contain.story.html",
  styleUrl: "./contain.story.scss",
})
export class ContainStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/image/image.stories.ts.
}
