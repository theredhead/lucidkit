import { UIInput } from "../../input.component";
import { DecimalTextAdapter } from "../../adapters/decimal-text-adapter";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-decimal-adapter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./decimal-adapter.story.html",
  styleUrl: "./decimal-adapter.story.scss",
})
export class DecimalAdapterStorySource {
  protected readonly adapter = new DecimalTextAdapter();
  protected rawDec = "";
  protected decValue: string | null = null;
}
