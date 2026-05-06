import { UICountdown } from "../../countdown.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICountdown],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  protected readonly launchDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  );

  protected onLaunch(): void {
    // countdown expired
  }
}
