import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIDropdownList } from "../../dropdown-list.component";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {}
