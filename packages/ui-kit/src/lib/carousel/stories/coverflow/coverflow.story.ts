import { UICarousel } from "../../carousel.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-coverflow-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICarousel],
  templateUrl: "./coverflow.story.html",
  styleUrl: "./coverflow.story.scss",
})
export class CoverflowStorySource {
}
