import { UIImage } from "../../image.component";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-cover-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIImage],
  templateUrl: "./cover.story.html",
  styleUrl: "./cover.story.scss",
})
export class CoverStorySource {
  public readonly alt = input("Cover image");

  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly height = input<number | undefined>(300);

  public readonly src = input(SAMPLE_SRC);

  public readonly width = input<number | undefined>(400);
}
