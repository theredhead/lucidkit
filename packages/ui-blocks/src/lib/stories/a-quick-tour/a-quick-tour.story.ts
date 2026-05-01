import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIDemoQuickTourShowcase } from "./a-quick-tour-showcase";

@Component({
  selector: "ui-a-quick-tour-story-source",
  standalone: true,
  imports: [UIDemoQuickTourShowcase],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./a-quick-tour.story.html",
  styleUrl: "./a-quick-tour.story.scss",
})
export class QuickTourStorySource {}
