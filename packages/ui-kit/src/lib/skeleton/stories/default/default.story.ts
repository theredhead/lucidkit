import { UISkeleton } from "../../skeleton.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISkeleton],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {

  /**
   * Storybook control forwarded to the skeleton example.
   */
  public readonly variant = input<ReturnType<UISkeleton["variant"]>>("text");

  /**
   * Storybook control forwarded to the skeleton example.
   */
  public readonly lines = input<ReturnType<UISkeleton["lines"]>>(3);

  /**
   * Storybook control forwarded to the skeleton example.
   */
  public readonly width = input<ReturnType<UISkeleton["width"]>>("360px");

  /**
   * Storybook control forwarded to the skeleton example.
   */
  public readonly height = input<ReturnType<UISkeleton["height"]>>("1rem");

  /**
   * Storybook control forwarded to the skeleton example.
   */
  public readonly animated = input<ReturnType<UISkeleton["animated"]>>(true);

}
