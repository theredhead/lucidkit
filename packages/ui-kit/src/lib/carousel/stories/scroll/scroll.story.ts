import { UICarousel } from "../../carousel.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-scroll-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICarousel],
  templateUrl: "./scroll.story.html",
  styleUrl: "./scroll.story.scss",
})
export class ScrollStorySource {
}
