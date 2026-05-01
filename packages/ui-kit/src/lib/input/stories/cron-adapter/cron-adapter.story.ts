import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-cron-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./cron-adapter.story.html",
  styleUrl: "./cron-adapter.story.scss",
})
export class CronAdapterStorySource {
}
