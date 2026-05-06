import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIIcon, UIIcons } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-story-icon-sizes",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./sizes.story.html",
  styleUrl: "./sizes.story.scss",
})
export class SizesStorySource {
  protected readonly svg = UIIcons.Lucide.Text.Bold;
  protected readonly sizes = [12, 16, 20, 24, 32, 48];
}
