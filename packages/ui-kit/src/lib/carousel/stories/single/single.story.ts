import { UICarousel } from "../../carousel.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-single-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICarousel],
  templateUrl: "./single.story.html",
  styleUrl: "./single.story.scss",
})
export class SingleStorySource {
}
