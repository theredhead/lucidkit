import { UIImage } from "../../image.component";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-contain-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIImage],
  templateUrl: "./contain.story.html",
  styleUrl: "./contain.story.scss",
})
export class ContainStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/image/image.stories.ts.

  public alt = ("Contained image") as const;
  public height = (300) as const;
  public src = SAMPLE_SRC;
  public width = (400) as const;
}
