import { UIImage } from "../../image.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIImage],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly alt = input("Mountain landscape");

  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly height = input<number | undefined>(300);

  public readonly src = input(SAMPLE_SRC);

  public readonly width = input<number | undefined>(400);
}
