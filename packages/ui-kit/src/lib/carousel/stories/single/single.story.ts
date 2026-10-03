import { UICarousel } from "../../carousel.component";
import { SingleCarouselStrategy } from "../../single-strategy";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

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

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly showControls = input<ReturnType<UICarousel["showControls"]>>(true);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly showIndicators = input<ReturnType<UICarousel["showIndicators"]>>(true);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly wrap = input<ReturnType<UICarousel["wrap"]>>(true);

  public readonly photos = PHOTOS;
  public readonly strategy = new SingleCarouselStrategy();
  public active = 0;
}
