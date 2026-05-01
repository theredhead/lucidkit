import { UIToastContainer } from "../../toast.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-severities-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToastContainer],
  templateUrl: "./all-severities.story.html",
  styleUrl: "./all-severities.story.scss",
})
export class AllSeveritiesStorySource {
}
