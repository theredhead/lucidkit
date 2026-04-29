import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import {
  UICountdown,
  type CountdownFormat,
  type CountdownMode,
} from "../../countdown.component";

@Component({
  selector: "ui-countdown-demo",
  standalone: true,
  imports: [UICountdown],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./showcase.story.html",
})
export class CountdownDemo {
  protected readonly twoHours = Date.now() + 2 * 60 * 60 * 1000;
  protected readonly fortyFiveSec = Date.now() + 45 * 1000;
  protected readonly fiveMinAgo = Date.now() - 5 * 60 * 1000;
  protected readonly expired = signal(false);

  protected onExpired(): void {
    this.expired.set(true);
  }
}
