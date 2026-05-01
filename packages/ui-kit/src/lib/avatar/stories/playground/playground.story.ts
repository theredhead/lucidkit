import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIAvatar, type AvatarSize } from "../../avatar.component";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIAvatar],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public readonly ariaLabel = input<string>("User avatar");

  public readonly email = input<string>("");

  public readonly name = input<string>("Jane Doe");

  public readonly size = input<AvatarSize>("medium");

  public readonly src = input<string>("");
}
