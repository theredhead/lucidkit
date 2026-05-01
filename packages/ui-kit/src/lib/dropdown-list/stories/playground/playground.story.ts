import { UIDropdownList, UIDropdownListPanel } from "../../dropdown-list.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList, UIDropdownListPanel],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {

  public ariaLabel = ("Choose a fruit") as const;
  public disabled = (false) as const;
  public options = undefined as never;
  public placeholder = ("— Select —") as const;
}
