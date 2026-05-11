import { UICarousel } from "../../carousel.component";
import { ScrollCarouselStrategy } from "../../scroll-strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

const PHOTOS = Array.from({ length: 50 }, (_, i) => ({
  name: `Photo ${i + 1}`,
  url: `https://picsum.photos/seed/carousel${i + 1}/280/200`,
}));

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICarousel],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly photos = PHOTOS;
  public readonly strategy = new ScrollCarouselStrategy();
  public active = 0;
}
