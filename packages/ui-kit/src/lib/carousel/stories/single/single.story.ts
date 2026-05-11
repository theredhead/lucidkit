import { UICarousel } from "../../carousel.component";
import { SingleCarouselStrategy } from "../../single-strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

const PHOTOS = Array.from({ length: 7 }, (_, i) => ({
  name: `Slide ${i + 1}`,
  url: `https://picsum.photos/seed/single${i + 1}/1200/720`,
}));

@Component({
  selector: "ui-single-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICarousel],
  templateUrl: "./single.story.html",
  styleUrl: "./single.story.scss",
})
export class SingleStorySource {
  public readonly photos = PHOTOS;
  public readonly strategy = new SingleCarouselStrategy();
  public active = 0;
}
