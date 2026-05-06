import { UIInput } from "../../input.component";
import { CronTextAdapter } from "../../adapters/cron-text-adapter";

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
  protected readonly adapter = new CronTextAdapter();
  protected rawCron = "";
  protected cronValue: string | null = null;
}
