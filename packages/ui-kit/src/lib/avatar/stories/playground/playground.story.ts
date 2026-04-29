import { UIAvatar } from "../../avatar.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAvatar],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/avatar/avatar.stories.ts.

  public ariaLabel = ("User avatar") as const;
  public email = ("") as const;
  public name = ("Jane Doe") as const;
  public size = ("medium") as const;
  public src = ("") as const;
}
