import { UISplitContainer } from "../../split-container.component";
import { UISplitPanel } from "../../split-panel.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-vertical-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer, UISplitPanel],
  templateUrl: "./vertical.story.html",
  styleUrl: "./vertical.story.scss",
})
export class VerticalStorySource {}
