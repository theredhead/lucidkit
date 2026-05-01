import { UISplitContainer } from "../../split-container.component";
import { UISplitPanel } from "../../split-panel.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-constrained-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer, UISplitPanel],
  templateUrl: "./constrained.story.html",
  styleUrl: "./constrained.story.scss",
})
export class ConstrainedStorySource {}
