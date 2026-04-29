import { UIIcon } from "../../icon.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/icon/icon.stories.ts.

  public ariaLabel = ("") as const;
  public size = (24) as const;
  public svg = undefined as never;
}
