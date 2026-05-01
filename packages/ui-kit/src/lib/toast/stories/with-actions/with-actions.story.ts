import { UIToastContainer } from "../../toast.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-actions-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToastContainer],
  templateUrl: "./with-actions.story.html",
  styleUrl: "./with-actions.story.scss",
})
export class WithActionsStorySource {
}
