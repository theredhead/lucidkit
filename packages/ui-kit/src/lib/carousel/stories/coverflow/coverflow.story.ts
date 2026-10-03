import { UICarousel } from "../../carousel.component";
import { CoverflowCarouselStrategy } from "../../coverflow-strategy";

import { ChangeDetectionStrategy, Component, input, computed } from "@angular/core";

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

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly peekOffset = input<number>(58);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly stackGap = input<number>(25);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly rotateY = input<number>(70);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly sideScale = input<number>(0.85);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly depthOffset = input<number>(100);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly blur = input<boolean>(true);

  /**
   * Storybook control forwarded to the carousel example.
   */
  public readonly fade = input<boolean>(true);

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

  protected readonly strategy = computed(() => new CoverflowCarouselStrategy({
    peekOffset: this.peekOffset(),
    stackGap: this.stackGap(),
    rotateY: this.rotateY(),
    sideScale: this.sideScale(),
    depthOffset: this.depthOffset(),
    blur: this.blur(),
    fade: this.fade(),
  }));

  public readonly photos = PHOTOS;
  public active = 25;
}
