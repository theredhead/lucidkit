import { UIInput } from "../../input.component";
import { TimeTextAdapter } from "../../adapters/time-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-time-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./time-adapter.story.html",
  styleUrl: "./time-adapter.story.scss",
})
export class TimeAdapterStorySource {
  protected readonly adapter = new TimeTextAdapter();
  protected rawTime = "";
  protected timeValue: string | null = null;
}
