import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIIcon, UIIcons } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-story-icon-default",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public svg: string = UIIcons.Lucide.Text.Bold;
  public size = 24;
  public ariaLabel = "";
}
