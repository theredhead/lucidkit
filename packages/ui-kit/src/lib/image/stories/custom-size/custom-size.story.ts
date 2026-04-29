import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-size-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./custom-size.story.html",
  styleUrl: "./custom-size.story.scss",
})
export class CustomSizeStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/image/image.stories.ts.
}
