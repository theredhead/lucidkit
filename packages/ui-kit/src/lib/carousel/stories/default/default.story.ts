import { UICarousel } from "../../carousel.component";
import { ScrollCarouselStrategy } from "../../scroll-strategy";

import { ChangeDetectionStrategy, Component, input, computed } from "@angular/core";

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

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly fade = input<boolean>(false);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly gap = input<number>(16);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly itemWidth = input<number>(280);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly showControls = input<ReturnType<UICarousel["showControls"]>>(true);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly showIndicators = input<ReturnType<UICarousel["showIndicators"]>>(false);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly wrap = input<ReturnType<UICarousel["wrap"]>>(false);

  protected readonly strategy = computed(() => new ScrollCarouselStrategy({
    fade: this.fade(),
    gap: this.gap(),
    itemWidth: this.itemWidth(),
  }));

  public readonly photos = PHOTOS;
  public active = 0;
}
