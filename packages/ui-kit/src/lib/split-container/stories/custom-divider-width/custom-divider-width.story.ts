import { UISplitContainer } from "../../split-container.component";
import { UISplitPanel } from "../../split-panel.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-divider-width-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer, UISplitPanel],
  templateUrl: "./custom-divider-width.story.html",
  styleUrl: "./custom-divider-width.story.scss",
})
export class CustomDividerWidthStorySource {}
