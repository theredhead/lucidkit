import { UIInput } from "../../input.component";
import { PercentageTextAdapter } from "../../adapters/percentage-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-percentage-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./percentage-adapter.story.html",
  styleUrl: "./percentage-adapter.story.scss",
})
export class PercentageAdapterStorySource {
  protected readonly adapter = new PercentageTextAdapter();
  protected rawPct = "";
  protected pctValue: string | null = null;
}
