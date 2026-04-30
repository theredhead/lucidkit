import { UIAnalogClock } from "../../analog-clock.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-size-gallery-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAnalogClock],
  templateUrl: "./size-gallery.story.html",
  styleUrl: "./size-gallery.story.scss",
})
export class SizeGalleryStorySource {
  protected readonly sizes = [80, 120, 160, 220, 300] as const;
}
