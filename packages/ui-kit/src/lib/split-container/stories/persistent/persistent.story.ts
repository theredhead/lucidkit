import { UISplitContainer } from "../../split-container.component";
import { UISplitPanel } from "../../split-panel.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-persistent-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer, UISplitPanel],
  templateUrl: "./persistent.story.html",
  styleUrl: "./persistent.story.scss",
})
export class PersistentStorySource {}
