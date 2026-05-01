import { UIImage } from "../../image.component";

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=400&fit=crop";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-contain-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIImage],
  templateUrl: "./contain.story.html",
  styleUrl: "./contain.story.scss",
})
export class ContainStorySource {
  public readonly alt = input("Contained image");

  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly height = input<number | undefined>(300);

  public readonly src = input(SAMPLE_SRC);

  public readonly width = input<number | undefined>(400);
}
