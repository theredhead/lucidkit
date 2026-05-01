import { UIDrawer } from "../../drawer.component";
import { UIButton } from "../../../button/button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDrawer, UIButton],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {

  public ariaLabel = ("Side panel") as const;
  public closeOnBackdropClick = (true) as const;
  public closeOnEscape = (true) as const;
  public open = undefined as never;
  public position = ("left") as const;
  public width = ("medium") as const;
}
