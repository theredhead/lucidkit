import { UIButton } from "../../button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-gallery-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./gallery.story.html",
  styleUrl: "./gallery.story.scss",
})
export class GalleryStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/button/button.stories.ts.
}
