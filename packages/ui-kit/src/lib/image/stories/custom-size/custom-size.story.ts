import { UIImage } from "../../image.component";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-size-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIImage],
  templateUrl: "./custom-size.story.html",
  styleUrl: "./custom-size.story.scss",
})
export class CustomSizeStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/image/image.stories.ts.

  public height = (200) as const;
  public src = SAMPLE_SRC;
  public width = (800) as const;
}
