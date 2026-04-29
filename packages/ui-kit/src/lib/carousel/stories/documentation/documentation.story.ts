import { UICarousel } from "../../carousel.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-documentation-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICarousel],
  templateUrl: "./documentation.story.html",
  styleUrl: "./documentation.story.scss",
})
export class DocumentationStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/carousel/carousel.stories.ts.
}
