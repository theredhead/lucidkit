import { UICarousel } from "../../carousel.component";
import { CoverflowCarouselStrategy } from "../../coverflow-strategy";

import { ChangeDetectionStrategy, Component } from "@angular/core";

const PHOTOS = Array.from({ length: 50 }, (_, i) => ({
  name: `Photo ${i + 1}`,
  url: `https://picsum.photos/seed/cover${i + 1}/240/240`,
}));

@Component({
  selector: "ui-coverflow-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICarousel],
  templateUrl: "./coverflow.story.html",
  styleUrl: "./coverflow.story.scss",
})
export class CoverflowStorySource {
  public readonly photos = PHOTOS;
  public readonly strategy = new CoverflowCarouselStrategy();
  public active = 25;
}
