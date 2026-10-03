import { UIToggle } from "../../toggle.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToggle],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {

  /**
   * Storybook control forwarded to the toggle example.
   */
  public readonly value = input<ReturnType<UIToggle["value"]>>(false);

  /**
   * Storybook control forwarded to the toggle example.
   */
  public readonly onLabel = input<ReturnType<UIToggle["onLabel"]>>("ON");

  /**
   * Storybook control forwarded to the toggle example.
   */
  public readonly offLabel = input<ReturnType<UIToggle["offLabel"]>>("OFF");

  /**
   * Storybook control forwarded to the toggle example.
   */
  public readonly size = input<ReturnType<UIToggle["size"]>>("medium");

  /**
   * Storybook control forwarded to the toggle example.
   */
  public readonly disabled = input<ReturnType<UIToggle["disabled"]>>(false);

  /**
   * Storybook control forwarded to the toggle example.
   */
  public readonly ariaLabel = input<ReturnType<UIToggle["ariaLabel"]>>("Toggle switch");

}
